// api/leads/lead.validator.js
import Joi from "@hapi/joi";

class LeadValidator {
  // Validation methods would go here if needed for the create/update operations
  // Since these operations are disabled, this is mostly a placeholder
  async onCreate(obj) {
    const schema = Joi.object({
      // Define validation rules if needed
    });
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async onUpdate(obj) {
    const schema = Joi.object({
      // Define validation rules if needed
    });
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }
}

export default new LeadValidator();

