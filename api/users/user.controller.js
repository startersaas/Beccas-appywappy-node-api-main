// ./api/users/user.controller.js
import { logData } from "../../common/loggerUtility.cjs"; // Importing logData function
import _ from "lodash";
import AccountSerializer from "../accounts/account.serializer.js";
import AccountService from "../accounts/account.service.js";
import UserSerializer from "./user.serializer.js";
import UserService from "./user.service.js";
import UserValidator from "./user.validator.js";

class Controller {
  async byId(req, res) {
    const user = await UserService.oneBy({
      _id: req.params.id,
      accountId: req.user.accountId,
    });
    if (user) res.json(UserSerializer.show(user));
    else res.status(404).end();
  }

  async me(req, res) {
    const me = req.user;
    if (req.query.withAccount === "true") {
      const account = await AccountService.findById(me.accountId);
      me.account = AccountSerializer.show(account);
    }
    res.json(UserSerializer.show(me));
  }

async updateMe(req, res) {
  console.log('User ID:', req.user._id);  // Log user _id
  console.log('Request Body:', JSON.stringify(req.body));  // Log the incoming request data

  const errors = await UserValidator.onUpdateMe(req.body);
  if (errors) {
    console.log('Validation Errors:', JSON.stringify(errors.details));  // Log validation errors
    return res.status(422).json({
      success: false,
      errors: errors.details,
    });
  }

  console.log('Current User Object:', JSON.stringify(req.user));  // Log the user object

  const userData = _.pick(req.body, ["name", "surname", "language"]);
  console.log('User Data to Update:', JSON.stringify(userData));  // Log the data to be updated

  const result = await UserService.update(
    req.user._id,  // Use _id instead of id
    req.user.accountId,
    userData
  );
  console.log('Update Result:', JSON.stringify(result));  // Log the result of the update operation

  if (result) {
    return res.json(UserSerializer.show(result));
  } else {
    console.log('Update Failed');  // Log a failure message if update fails
    return res.status(422).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
}

  /*async create(req, res) {
    const errors = await UserValidator.onCreate(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors.details,
      });
    }
    const userData = _.pick(req.body, [
      "email",
      "password",
      "name",
      "surname",
      "language",
      "role",
    ]);
    userData.email = userData.email.trim();
    userData.accountId = req.user.accountId;
    const user = await UserService.create(userData);
    if (user) {
      return res.json(UserSerializer.show(user));
    } else {
      return res.status(422).json({
        message: "Failed to save the user.",
      });
    }
  }*/
  
// Backend controller (in user.controller.js)
async create(req, res) {
  try {
    console.log('Create user - Request body:', req.body);
    console.log('Create user - User context:', {
      userId: req.user?._id,
      accountId: req.user?.accountId
    });

    const errors = await UserValidator.onCreate(req.body);
    if (errors) {
      console.log('Create user - Validation errors:', errors.details);
      return res.status(422).json({
        success: false,
        errors: errors.details,
      });
    }

    const userData = _.pick(req.body, [
      "email",
      "password",
      "name",
      "surname",
      "language",
      "role",
    ]);
    
    console.log('Create user - Processed userData:', userData);
    
    userData.email = userData.email.trim();
    userData.accountId = req.user.accountId;

    console.log('Create user - Final userData:', userData);

    const user = await UserService.create(userData);
    console.log('Create user - Service response:', user);

    if (user) {
      const serializedUser = UserSerializer.show(user);
      console.log('Create user - Serialized response:', serializedUser);
      return res.json(serializedUser);
    } else {
      console.log('Create user - Failed to save user');
      return res.status(422).json({
        message: "Failed to save the user.",
      });
    }
  } catch (error) {
    console.error('Create user - Unexpected error:', {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      message: "An unexpected error occurred while creating the user.",
      error: error.message
    });
  }
}

  async index(req, res) {
    const users = await UserService.find({ accountId: req.user.accountId });
    return res.json(UserSerializer.index(users));
  }

  async update(req, res) {
    const errors = await UserValidator.onUpdate(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors.details,
      });
    }
    const userData = _.pick(req.body, ["name", "surname", "role", "language"]);
    const result = await UserService.update(
      req.params.id,
      req.user.accountId,
      userData
    );
    if (result) {
      return res.json(UserSerializer.show(result.toObject()));
    } else {
      return res.status(422).json({
        success: false,
        message: "Failed to update user.",
      });
    }
  }

  async delete(req, res) {
    if (req.params.id !== req.user.id) {
      await UserService.delete(req.params.id, req.user.accountId);
      return res.json({
        success: true,
        message: "User delete successfully.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Failed to delete user.",
    });
  }

  async changeMyPassword(req, res) {
    const errors = await UserValidator.onResetMyPassword(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        message: "Failed to update password",
        errors: errors.details,
      });
    }
    const data = _.pick(req.body, ["password"]);
    UserService.updatePassword(req.user.id, data.password.trim());
    return res.json({
      success: true,
      message: "Successfully changed password!",
    });
  }

  async generateSso(req, res) {
    // const userData = { sso: uuidv4() }
    // const result = await UserService.update(req.user.id, userData)
    // if (result) {
    //   return res.json({ sso: result.sso })
    // } else {
    //   return res.status(422).json({
    //     success: false,
    //     message: 'Failed to update profile.'
    //   })
    // }
    return res.json({ sso: req.user.sso });
  }
}
export default new Controller();
