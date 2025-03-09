import PublicService from "./public.service.js";

class Controller {
  async getAllResources(req, res) {
    try {
      const resources = await PublicService.getAllResourcesInfo();
      return res.json({
        success: true,
        data: resources
      });
    } catch (error) {
      console.error('Error retrieving resources:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve resources information."
      });
    }
  }

  async getResourceByName(req, res) {
    try {
      const resourceName = req.params.name;
      
      // Validate resource name to prevent directory traversal
      if (!PublicService.isValidResourcePath(resourceName)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource name."
        });
      }
      
      const resource = await PublicService.getResourceInfo(resourceName);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found."
        });
      }
      
      return res.json({
        success: true,
        data: resource
      });
    } catch (error) {
      console.error('Error retrieving resource:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve resource information."
      });
    }
  }
}

export default new Controller();

