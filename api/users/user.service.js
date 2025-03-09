// ./api/users/user.service.js
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import BaseService from "../../services/base.service.js";
import EmailService from "../emails/email.service.js";
import User from "./user.model.js";

class UsersService extends BaseService {
  getModel() {
    return User;
  }

  async update(id, accountId, data) {
    return this.getModel().findOneAndUpdate(
      { _id: id, accountId: accountId },
      data,
      { new: true }
    );
  }

  async delete(id, accountId) {
    return this.getModel().findOneAndDelete({ _id: id, accountId: accountId });
  }

  async create(data, sendConfirm = false) {
    // const sendForgot = false
    // const sendConfirm = false
    // if (data.password && data.password !== '') {
    //   const salt = bcrypt.genSaltSync(10)
    //   const hash = bcrypt.hashSync(data.password, salt)
    //   data.password = hash
    // } else {
    //   data.passwordResetToken = (Math.floor(100000 + Math.random() * 900000)).toString()
    //   data.passwordResetExpires = new Date(Date.now() + 3600000)
    //   sendForgot = true
    // }
    if (sendConfirm) {
      data.confirmationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
    } else {
      data.active = true;
    }
    if (data.password && data.password !== "") {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;
    } else {
      data.password = "justaplaceholder";
    }
    data.sso = uuidv4();
    const user = new User(data);
    await user.save();
    // if (sendForgot) {
    //   EmailService.forgotPasswordLink(data)
    // }
    if (sendConfirm) {
      EmailService.sendActivationEmail(data);
    }
    EmailService.activated(data);
    return user.toObject();
  }

  async updatePassword(userId, password) {
    const user = await this.byId(userId, {});
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    await user.save();
  }
}

export default new UsersService();


