// api/emails/email.service.js
import * as fs from "fs";
import { Liquid } from "liquidjs";
import i18n from "../../common/i18n.js";
import transporter from "../../common/transporter.js";
import BaseService from "../../services/base.service.js";
import Email from "./email.model.js";

class EmailService extends BaseService {
  getModel() {
    return Email;
  }

  async loadEmail(code, lang = "en") {
    let email = await this.oneBy({ code: code, lang: lang });
    if (!email) {
      email = {
        body: fs.readFileSync(`views/mailer/${code}.email.liquid`, "utf8"),
      };
    }
    return email;
  }

  async forgotPasswordLink(user) {
    const data = await this.loadEmail("forgotPassword", user.language);
    const engine = new Liquid();
    const emailText = await engine.parseAndRender(data.body, {
      email: user.email,
      passwordResetToken: user.passwordResetToken,
    });
    const mailOptions = {
      to: user.email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: data.subject || "[StarterSaaS] Reset password code",
      html: emailText,
    };
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent to:', user.email, 'Subject:', mailOptions.subject);
      console.log('Email sent: ' + result.response);
      return result;
    } catch (error) {
      console.log('Error sending email to:', user.email, 'Error:', error);
      throw error;
    }
  }

  async sendActivationEmail(user) {
    const data = await this.loadEmail("activationLink", user.language);
    const engine = new Liquid();
    const emailText = await engine.parseAndRender(data.body, {
      email: user.email,
      confirmationToken: user.confirmationToken,
    });
    const mailOptions = {
      to: user.email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: "[StarterSaaS] Activation code",
      html: emailText,
    };
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent to:', user.email, 'Subject:', mailOptions.subject);
      console.log('Email sent: ' + result.response);
      return result;
    } catch (error) {
      console.log('Error sending email to:', user.email, 'Error:', error);
      throw error;
    }
  }

  async activated(user) {
    const data = await this.loadEmail("activate", user.language);
    const engine = new Liquid();
    const emailText = await engine.parseAndRender(data.body, {
      email: user.email,
      frontendLoginURL: process.env.FRONTEND_LOGIN_URL,
    });
    const mailOptions = {
      to: user.email,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: data.subject || "[Startersaaskit] Account activated",
      html: emailText,
    };
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent to:', user.email, 'Subject:', mailOptions.subject);
      console.log('Email sent: ' + result.response);
      return result;
    } catch (error) {
      console.log('Error sending email to:', user.email, 'Error:', error);
      throw error;
    }
  }

  async generalNotification(toEmail, subject, message, locale = i18n.locale()) {
    const data = await this.loadEmail("notification", locale);
    const engine = new Liquid();
    const emailText = await engine.parseAndRender(data.body, {
      email: toEmail,
      message: message,
      frontendLoginURL: process.env.FRONTEND_LOGIN_URL,
    });
    const mailOptions = {
      to: toEmail,
      from: process.env.DEFAULT_EMAIL_FROM,
      subject: subject,
      html: emailText,
    };
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent to:', toEmail, 'Subject:', mailOptions.subject);
      console.log('Email sent: ' + result.response);
      return result;
    } catch (error) {
      console.log('Error sending email to:', toEmail, 'Error:', error);
      throw error;
    }
  }
}

export default new EmailService();