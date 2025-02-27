// api/subscriptions/subscription.controller.js
import stripeConf from "../../stripe.conf.js";
import SubscriptionService from "./subscription.service.js";
import SubscriptionValidator from "./subscription.validator.js";
import UserService from "../users/user.service.js";

class Controller {
// subscription.controller.js
async subscribe(req, res, next) {
  try {
    // Validate request body
    const subscriptionErrors = await SubscriptionValidator.onCreate(req.body);
    if (subscriptionErrors) {
      return res.status(422).json({
        success: false,
        errors: subscriptionErrors.details,
      });
    }

    // Get user by email from JWT
    const user = await UserService.oneBy({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log('Found user in controller:', user);  // Debug log

    const subscription = await SubscriptionService.subscribe(
      user,  // Pass entire user object instead of just ID
      req.body.planId
    );
    return res.status(200).json(subscription);
  } catch (error) {
    console.error('Subscription controller error:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
      details: error.details || {}
    });
  }
}

  async getCustomer(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const sCustomer = await SubscriptionService.getCustomer(
        user.accountId
      );
      return res.status(200).json(sCustomer);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getCustomerInvoices(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const invoices = await SubscriptionService.getCustomerInvoices(
        user.accountId
      );
      return res.status(200).json(invoices);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getCustomerCards(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const cards = await SubscriptionService.getCustomerCards(
        user.accountId
      );
      return res.status(200).json(cards);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async createSetupIntent(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const setupIntent = await SubscriptionService.createSetupIntent(
        user.accountId
      );
      return res.status(200).json(setupIntent);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async removeCreditCard(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const sCustomer = await SubscriptionService.removeCreditCard(
        user.accountId,
        req.body.cardId
      );
      return res.status(200).json(sCustomer);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async setDefaultCreditCard(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const sCustomer = await SubscriptionService.setDefaultCreditCard(
        user.accountId,
        req.body.cardId
      );
      return res.status(200).json(sCustomer);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async cancelSubscription(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const sCustomer = await SubscriptionService.cancelSubscription(
        user.accountId,
        req.body.subscriptionId
      );
      return res.status(200).json(sCustomer);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getPlans(req, res, next) {
    try {
      return res.status(200).json(stripeConf);
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async createCustomerCheckoutSession(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const redirectUrl = await SubscriptionService.createCustomerCheckoutSession(
        user.id,
        req.body.planId
      );
      return res.status(200).json({ redirect_url: redirectUrl });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async createCustomerPortalSession(req, res, next) {
    try {
      const user = await UserService.oneBy({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const redirectUrl = await SubscriptionService.createCustomerPortalSession(
        user.accountId
      );
      return res.status(200).json({ redirect_url: redirectUrl });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default new Controller();