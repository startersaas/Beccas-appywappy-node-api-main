import * as fs from "fs/promises";
import * as path from "path";
import BaseService from "../../services/base.service.js";

class PublicService extends BaseService {
  getModel() {
    // Since we don't have a model/collection, we return null
    // This is just to satisfy the BaseService abstract method
    return null;
  }

  async getResourcesDir() {
    // Use environment variable for the resources directory
    return process.env.PUBLIC_RESOURCES_DIRECTORY || path.join(process.cwd(), 'public-resources');
  }

  isValidResourcePath(resourcePath) {
    // Prevent directory traversal and other security issues
    // This regex allows alphanumeric, underscores, hyphens, and forward slashes (for subdirectories)
    // but blocks paths with '..' which could be used for traversal
    return /^[a-zA-Z0-9_\-\/]+$/.test(resourcePath) && !resourcePath.includes('..');
  }

  async getAllResourcesInfo() {
    const resourcesDir = await this.getResourcesDir();
    
    // Ensure directory exists
    try {
      await fs.access(resourcesDir);
    } catch (error) {
      // If directory doesn't exist, create it
      if (error.code === 'ENOENT') {
        await fs.mkdir(resourcesDir, { recursive: true });
        return []; // Return empty array for newly created directory
      }
      throw error;
    }
    
    return this.processDirectory(resourcesDir);
  }

  async processDirectory(dirPath, basePath = '') {
    const result = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const relativePath = path.join(basePath, entry.name);
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // If it's a directory, get its stats and recursively process contents
        const stats = await fs.stat(fullPath);
        const children = await this.processDirectory(fullPath, relativePath);
        
        result.push({
          name: entry.name,
          path: relativePath,
          type: 'directory',
          size: this.calculateDirectorySize(children),
          modifiedTime: stats.mtime,
          createdTime: stats.birthtime,
          children: children
        });
      } else if (entry.isFile()) {
        // If it's a file, get its stats
        const stats = await fs.stat(fullPath);
        
        result.push({
          name: entry.name,
          path: relativePath,
          type: 'file',
          size: stats.size,
          modifiedTime: stats.mtime,
          createdTime: stats.birthtime,
          extension: path.extname(entry.name).toLowerCase()
        });
      }
    }
    
    // Sort: directories first, then files, both alphabetically
    return result.sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  calculateDirectorySize(children) {
    return children.reduce((total, item) => {
      return total + (typeof item.size === 'number' ? item.size : 0);
    }, 0);
  }

  async getResourceInfo(resourceName) {
    const resourcesDir = await this.getResourcesDir();
    const resourcePath = path.join(resourcesDir, resourceName);
    
    try {
      const stats = await fs.stat(resourcePath);
      
      if (stats.isDirectory()) {
        // If it's a directory, get detailed information including contents
        const children = await this.processDirectory(resourcePath);
        
        return {
          name: path.basename(resourcePath),
          path: resourceName,
          type: 'directory',
          size: this.calculateDirectorySize(children),
          modifiedTime: stats.mtime,
          createdTime: stats.birthtime,
          children: children
        };
      } else if (stats.isFile()) {
        // If it's a file, get detailed information
        return {
          name: path.basename(resourcePath),
          path: resourceName,
          type: 'file',
          size: stats.size,
          modifiedTime: stats.mtime,
          createdTime: stats.birthtime,
          extension: path.extname(resourcePath).toLowerCase()
        };
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Resource not found
        return null;
      }
      throw error;
    }
    
    return null;
  }
}

export default new PublicService();

