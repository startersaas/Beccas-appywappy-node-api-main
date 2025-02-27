// ./api/users/user.validator.js
import Joi from "@hapi/joi";
import UserService from "./user.service.js";

class UserValidator {
  async onLogin(obj) {
    const schema = Joi.object({
      password: Joi.string(),
      email: Joi.string().email(),
    });
    const { error } = schema.validate(obj);
    return error;
  }

  async onSso(obj) {
    const schema = Joi.object({
      sso: Joi.string(),
    });
    const { error } = schema.validate(obj);
    return error;
  }

  async onSignup(obj) {
    const emailExists = await UserService.oneBy({ email: obj.email });
    const schemaKeys = {
      password: Joi.string().min(8).required(),
      language: Joi.string(),
    };
    if (emailExists) {
      schemaKeys.email = Joi.string().invalid(obj.email).required();
    } else {
      schemaKeys.email = Joi.string().email().required();
    }
    const schema = Joi.object().keys(schemaKeys);
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async forgotPassword(obj) {
    const schema = Joi.object({
      email: Joi.string().email(),
    });
    const { error } = schema.validate(obj);
    return error;
  }

  async onResetPassword(obj) {
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
      passwordResetToken: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async onResetMyPassword(obj) {
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async onActivate(obj) {
    const schema = Joi.object({
      token: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async onResendActivation(obj) {
    const schema = Joi.object({
      email: Joi.string().email(),
    });
    const { error } = schema.validate(obj);
    return error;
  }

  async onUpdate(obj) {
    const schemaKeys = {
      name: Joi.string(),
      surname: Joi.string(),
      language: Joi.any().allow("it", "en"),
      role: Joi.any().allow("user", "admin"),
    };
    const schema = Joi.object().keys(schemaKeys);
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async onUpdateMe(obj) {
    const schemaKeys = {
      name: Joi.string(),
      surname: Joi.string(),
      language: Joi.any().allow("it", "en"),
    };
    const schema = Joi.object().keys(schemaKeys);
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }

  async onCreate(obj) {
    const emailExists = await UserService.oneBy({ email: obj.email });
    const schemaKeys = {
      name: Joi.string(),
      surname: Joi.string(),
      language: Joi.any().allow("it", "en"),
      role: Joi.any().allow("user", "admin"),
      password: Joi.string(),
    };
    if (emailExists) {
      schemaKeys.email = Joi.string().invalid(obj.email).required();
    } else {
      schemaKeys.email = Joi.string().email().required();
    }
    const schema = Joi.object().keys(schemaKeys);
    const { error } = schema.validate(obj, { abortEarly: false });
    return error;
  }
}

export default new UserValidator();
