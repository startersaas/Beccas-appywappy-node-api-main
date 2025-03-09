import * as fs from "fs";
import * as path from "path";
import _ from "lodash";
import WorkspaceService from "./workspace.service.js";
import WorkspaceSerializer from "./workspace.serializer.js";
import WorkspaceValidator from "./workspace.validator.js";

class Controller {
  async index(req, res) {
    const workspaces = await WorkspaceService.find({ 
      $or: [
        { userId: req.user._id }, 
        { "teams._id": { $in: req.user.teams?.map(team => team._id) || [] } }
      ],
      accountId: req.user.accountId
    });
    return res.json(WorkspaceSerializer.index(workspaces));
  }

  async byId(req, res) {
    const workspace = await WorkspaceService.findByIdAndUser(
      req.params.id,
      req.user._id,
      req.user.accountId
    );
    
    if (workspace) {
      // Update last accessed timestamp
      await WorkspaceService.update(
        workspace._id,
        req.user._id,
        req.user.accountId,
        { lastAccessed: new Date() }
      );
      
      return res.json(WorkspaceSerializer.show(workspace));
    } else {
      return res.status(404).json({
        success: false,
        message: "Workspace not found."
      });
    }
  }

  async create(req, res) {
    const errors = await WorkspaceValidator.onCreate(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors.details,
      });
    }
    
    const workspaceData = _.pick(req.body, [
      "name",
      "description",
      "filePath",
      "fileType",
      "fileSize",
      "metadata",
      "isPublic",
      "teams"
    ]);
    
    const workspace = await WorkspaceService.create(
      workspaceData,
      req.user._id,
      req.user.accountId
    );
    
    if (workspace) {
      return res.json(WorkspaceSerializer.show(workspace));
    } else {
      return res.status(422).json({
        success: false,
        message: "Failed to create workspace."
      });
    }
  }

  async update(req, res) {
    const errors = await WorkspaceValidator.onUpdate(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors.details,
      });
    }
    
    const workspaceData = _.pick(req.body, [
      "name",
      "description",
      "filePath",
      "fileType",
      "fileSize",
      "metadata",
      "isPublic",
      "teams"
    ]);
    
    const workspace = await WorkspaceService.update(
      req.params.id,
      req.user._id,
      req.user.accountId,
      workspaceData
    );
    
    if (workspace) {
      return res.json(WorkspaceSerializer.show(workspace));
    } else {
      return res.status(422).json({
        success: false,
        message: "Failed to update workspace or workspace not found."
      });
    }
  }

  async delete(req, res) {
    const result = await WorkspaceService.delete(
      req.params.id,
      req.user._id,
      req.user.accountId
    );
    
    if (result) {
      return res.json({
        success: true,
        message: "Workspace deleted successfully."
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Workspace not found or you don't have permission to delete it."
      });
    }
  }

  async getWorkspaceFile(req, res) {
    try {
      const workspaceName = req.params.name;
      
      // Validate workspace name to prevent directory traversal
      if (!WorkspaceService.isValidWorkspaceFileName(workspaceName)) {
        return res.status(400).json({
          success: false,
          message: "Invalid workspace file name."
        });
      }
      
      const filePath = await WorkspaceService.getWorkspaceFilePath(workspaceName);
      
      // Check if the file exists
      const fileExists = await WorkspaceService.workspaceFileExists(filePath);
      
      if (!fileExists) {
        return res.status(404).json({
          success: false,
          message: "Workspace file not found."
        });
      }
      
      // Determine content type
      const contentType = WorkspaceService.getContentType(workspaceName);
      if (contentType) {
        res.set('Content-Type', contentType);
      }

      // Set filename for download
      res.set('Content-Disposition', `attachment; filename="${workspaceName}"`);
      
      // Send the file
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({
            success: false,
            message: "Error sending workspace file."
          });
        }
      });
    } catch (error) {
      console.error('Error retrieving workspace file:', error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve workspace file."
      });
    }
  }
}

export default new Controller();