import * as fs from "fs/promises";
import * as path from "path";
import BaseService from "../../services/base.service.js";
import Workspace from "./workspace.model.js";

class WorkspaceService extends BaseService {
  getModel() {
    return Workspace;
  }

  async create(data, userId, accountId) {
    data.userId = userId;
    data.accountId = accountId;
    
    const workspace = new Workspace(data);
    await workspace.save();
    return workspace.toObject();
  }

  async update(id, userId, accountId, data) {
    return this.getModel().findOneAndUpdate(
      { _id: id, accountId: accountId },
      data,
      { new: true }
    );
  }

  async delete(id, userId, accountId) {
    return this.getModel().findOneAndDelete({ 
      _id: id, 
      accountId: accountId
    });
  }

  async findByIdAndUser(id, userId, accountId) {
    const workspace = await this.getModel().findOne({
      _id: id,
      $or: [
        { userId: userId },
        { "teams._id": { $in: userId.teams?.map(team => team._id) || [] } }
      ],
      accountId: accountId
    }).lean();
    
    return workspace;
  }

  async getWorkspaceFilePath(name) {
    // Use environment variable for the workspaces directory
    const workspacesDir = process.env.WORKSPACES_FILES_DIRECTORY || path.join(process.cwd(), 'workspace-files');
    return path.join(workspacesDir, name);
  }

  async workspaceFileExists(filePath) {
    try {
      await fs.access(filePath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  isValidWorkspaceFileName(name) {
    // Prevent directory traversal and other security issues
    // Only allow alphanumeric characters, hyphens, underscores, and certain extensions
    const validNameRegex = /^[a-zA-Z0-9_-]+\.(pdf|txt|csv|json|xml|zip|tar|gz|xlsx|docx|png|jpg|jpeg|svg)$/;
    return validNameRegex.test(name) && !name.includes('..');
  }

  getContentType(filename) {
    // Map common file extensions to content types
    const extension = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.zip': 'application/zip',
      '.tar': 'application/x-tar',
      '.gz': 'application/gzip',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    
    return contentTypes[extension] || 'application/octet-stream';
  }
}

export default new WorkspaceService();