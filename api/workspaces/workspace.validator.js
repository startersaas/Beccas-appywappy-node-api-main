import Joi from "@hapi/joi";

class WorkspaceValidator {
  async onCreate(obj) {
    const schemaKeys = {
      name: Joi.string().required(),
      description: Joi.string().allow('').optional(),
      filePath: Joi.string().allow(null).optional(),
      fileType: Joi.string().allow(null).optional(),
      fileSize: Joi.number().optional(),
      metadata: Joi.object().optional(),
      isPublic: Joi.boolean().optional(),
      teams: Joi.array().items(Joi.object({
        _id: Joi.string().hex().length(24),
        code: Joi.string(),
        name: Joi.string()
      })).optional()
    };
    
    const schema = Joi.object().keys(schemaKeys);
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async onUpdate(obj) {
    const schemaKeys = {
      name: Joi.string().optional(),
      description: Joi.string().allow('').optional(),
      filePath: Joi.string().allow(null).optional(),
      fileType: Joi.string().allow(null).optional(),
      fileSize: Joi.number().optional(),
      metadata: Joi.object().optional(),
      isPublic: Joi.boolean().optional(),
      teams: Joi.array().items(Joi.object({
        _id: Joi.string().hex().length(24),
        code: Joi.string(),
        name: Joi.string()
      })).optional(),
      lastAccessed: Joi.date().optional()
    };
    
    const schema = Joi.object().keys(schemaKeys);
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }
}

export default new WorkspaceValidator();

