// api/subscriptions/subscription.service.js
import moment from "moment";
import Stripe from "stripe";
import i18n from "../../common/i18n.js";
import ApplicationError from "../../libs/errors/application.error.js";
import AccountService from "../accounts/account.service.js";
import EmailService from "../emails/email.service.js";
import UserService from "../users/user.service.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class SubscriptionService {
  /*async createCustomer(userId) {
    try {
      const user = await UserService.byId(userId);
      const account = await AccountService.findById(user.accountId);
      const sCustomer = await stripe.customers.create({
        email: user.email,
        name: account.companyName,
        address: {
          line1: account.companyBillingAddress,
          country: account.companyCountry,
        },
        metadata: {
          companyName: account.companyName,
          address: account.companyBillingAddress,
          vat: account.companyVat,
          subdomain: account.subdomain,
          sdi: account.companySdi,
          phone: account.companyPhone,
          name: user.name,
          surname: user.surname,
        },
      });
      account.stripeCustomerId = sCustomer.id;
      await account.save();
      return account;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }*/
  
async createCustomer(userId) {
  try {
    const user = await UserService.oneBy({ _id: userId });
    if (!user) {
      throw new ApplicationError('User not found', {}, 404);
    }

    const account = await AccountService.findById(user.accountId);
    if (!account) {
      throw new ApplicationError('Account not found', {}, 404);
    }

    const sCustomer = await stripe.customers.create({
      email: user.email,
      name: account.companyName,
      address: {
        line1: account.companyBillingAddress || '',
        country: account.companyCountry || '',
      },
      metadata: {
        companyName: account.companyName || '',
        address: account.companyBillingAddress || '',
        vat: account.companyVat || '',
        subdomain: account.subdomain || '',
        sdi: account.companySdi || '',
        phone: account.companyPhone || '',
        name: user.name || '',
        surname: user.surname || '',
      },
    });

    // Use AccountService's update method
    const updatedAccount = await AccountService.update(account._id, {
      stripeCustomerId: sCustomer.id
    });

    console.log('Successfully created Stripe customer:', sCustomer.id);
    return updatedAccount;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new ApplicationError(error.message, {}, error.status || 500);
  }
}

  /*async subscribe(userId, planId) {
    let sCustomer;

    const user = await UserService.byId(userId);
    let account = await AccountService.findById(user.accountId);

    if (!account.stripeCustomerId) {
      account = await this.createCustomer(userId);
    }

    try {
      sCustomer = await stripe.customers.retrieve(account.stripeCustomerId, {
        expand: ["subscriptions"],
      });

      const haveSubscription =
        sCustomer.subscriptions.data.filter((sub) => sub.status === "active")
          .length > 0;

      let subscription = null;
      if (haveSubscription) {
        subscription = await stripe.subscriptions.update(
          sCustomer.subscriptions.data[0].id,
          {
            cancel_at_period_end: false,
            proration_behavior: "always_invoice",
            expand: ["latest_invoice.payment_intent"],
            payment_behavior: "default_incomplete",
            automatic_tax: {
              enabled: true,
            },
            items: [
              {
                id: sCustomer.subscriptions.data[0].items.data[0].id,
                plan: planId,
              },
            ],
          }
        );
        return subscription;
      } else {
        for (const sb of sCustomer.subscriptions.data.filter(
          (sub) => sub.status !== "active"
        )) {
          await stripe.subscriptions.del(sb.id);
        }

        subscription = await stripe.subscriptions.create({
          customer: sCustomer.id,
          items: [{ plan: planId }],
          expand: ["latest_invoice.payment_intent"],
          automatic_tax: {
            enabled: true,
          },
          payment_behavior: "default_incomplete",
        });

        await account.save();
        return subscription;
      }
    } catch (e) {
      return new ApplicationError(e.message, {}, 500);
    }
  }*/
  
async subscribe(user, planId) {
  if (!user || !user._id || !planId) {
    throw new ApplicationError('Missing required parameters', {}, 400);
  }

  console.log('Starting subscription process for user:', {
    userId: user._id,
    email: user.email,
    accountId: user.accountId
  });

  try {
    let account = await AccountService.findById(user.accountId);
    if (!account) {
      throw new ApplicationError('Account not found', {}, 404);
    }
    console.log('Found account:', account.companyName);

    // Create customer if doesn't exist
    if (!account.stripeCustomerId) {
      console.log('No Stripe customer found, creating new customer');
      account = await this.createCustomer(user._id);
    }

    const sCustomer = await stripe.customers.retrieve(account.stripeCustomerId, {
      expand: ['subscriptions'],
    });
    console.log('Retrieved Stripe customer:', sCustomer.id);

    const activeSubscription = sCustomer.subscriptions.data.find(
      (sub) => sub.status === 'active'
    );

    let subscription;
    if (activeSubscription) {
      console.log('Updating existing subscription:', activeSubscription.id);
      subscription = await stripe.subscriptions.update(
        activeSubscription.id,
        {
          cancel_at_period_end: false,
          proration_behavior: 'always_invoice',
          expand: ['latest_invoice.payment_intent'],
          payment_behavior: 'default_incomplete',
          automatic_tax: { enabled: true },
          items: [{
            id: activeSubscription.items.data[0].id,
            plan: planId,
          }],
        }
      );
    } else {
      // Cancel any inactive subscriptions
      console.log('Canceling inactive subscriptions');
      const inactiveSubscriptions = sCustomer.subscriptions.data.filter(
        (sub) => sub.status !== 'active'
      );
      
      for (const sub of inactiveSubscriptions) {
        await stripe.subscriptions.cancel(sub.id);
      }

      console.log('Creating new subscription');
      subscription = await stripe.subscriptions.create({
        customer: sCustomer.id,
        items: [{ plan: planId }],
        expand: ['latest_invoice.payment_intent'],
        automatic_tax: { enabled: true },
        payment_behavior: 'default_incomplete',
      });
    }

    // Update the account with subscription info
    await AccountService.update(account._id, {
      stripePlanId: planId,
      subscriptionExpiresAt: new Date(subscription.current_period_end * 1000)
    });

    console.log('Subscription operation completed successfully');
    return subscription;

  } catch (error) {
    console.error('Subscription service error:', error);
    throw new ApplicationError(
      error.message || 'Subscription operation failed',
      {},
      error.status || 500
    );
  }
}

  async getCustomer(accountId) {
    try {
      const account = await AccountService.findById(accountId);
      if (!account.stripeCustomerId) {
        return new ApplicationError("User is not a stripe USER", {}, 500);
      }
      const sCustomer = await stripe.customers.retrieve(
        account.stripeCustomerId,
        {
          expand: ["subscriptions"],
        }
      );
      return sCustomer;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async getCustomerInvoices(accountId) {
    try {
      const account = await AccountService.findById(accountId);
      if (!account.stripeCustomerId) {
        return new ApplicationError("User is not a stripe USER", {}, 500);
      }
      const invoices = await stripe.invoices.list({
        customer: account.stripeCustomerId,
      });
      return invoices.data;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async getCustomerCards(accountId) {
    try {
      const account = await AccountService.findById(accountId);
      if (!account.stripeCustomerId) {
        return new ApplicationError("User is not a stripe USER", {}, 500);
      }
      const paymentMethods = await stripe.paymentMethods.list({
        customer: account.stripeCustomerId,
        type: "card",
      });
      return paymentMethods.data;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async createSetupIntent(accountId) {
    try {
      const account = await AccountService.findById(accountId);
      if (!account.stripeCustomerId) {
        return new ApplicationError("User is not a stripe USER", {}, 500);
      }
      const setupIntent = await stripe.setupIntents.create({
        customer: account.stripeCustomerId,
        payment_method_types: ["card"],
      });
      return setupIntent;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async removeCreditCard(accountId, cardId) {
    try {
      const account = await AccountService.findById(accountId);
      if (!account.stripeCustomerId) {
        return new ApplicationError("User is not a stripe USER", {}, 500);
      }
      await stripe.paymentMethods.detach(cardId);
      const sCustomer = await stripe.customers.retrieve(
        account.stripeCustomerId,
        {
          expand: ["subscriptions"],
        }
      );
      return sCustomer;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async setDefaultCreditCard(accountId, cardId) {
    try {
      const account = await AccountService.findById(accountId);
      if (!account.stripeCustomerId) {
        return new ApplicationError("User is not a stripe USER", {}, 500);
      }
      await stripe.customers.update(account.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: cardId,
        },
      });
      const sCustomer = await stripe.customers.retrieve(
        account.stripeCustomerId,
        {
          expand: ["subscriptions"],
        }
      );
      return sCustomer;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async cancelSubscription(accountId, subscriptionId) {
    try {
      const account = await AccountService.findById(accountId);
      if (!account.stripeCustomerId) {
        return new ApplicationError("User is not a stripe USER", {}, 500);
      }
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      const sCustomer = await stripe.customers.retrieve(
        account.stripeCustomerId,
        {
          expand: ["subscriptions"],
        }
      );
      return sCustomer;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async runNotifyExpiringTrials() {
    const accounts = await AccountService.find({
      trialPeriodEndsAt: {
        $lt: moment(Date.now()).add(3, "days"),
        $gt: Date.now(),
      },
    });
    for (const account of accounts) {
      const user = await UserService.oneBy({
        accountId: account.id,
        accountOwner: true,
      });
      const daysToExpire = Math.round(
        moment(account.trialPeriodEndsAt).diff(Date.now(), "days", true)
      );
      EmailService.generalNotification(
        user.email,
        i18n.t("subscriptionService.runNotifyExpiringTrials.subject", {
          daysToExpire: daysToExpire,
        }),
        i18n.t("subscriptionService.runNotifyExpiringTrials.message", {
          daysToExpire: daysToExpire,
        }),
        user.language
      );
    }
  }

  async runNotifyPaymentFailed() {
    const accounts = await AccountService.find({
      paymentFailed: true,
      paymentFailedSubscriptionEndsAt: {
        $lt: moment(Date.now()).add(3, "days"),
        $gt: Date.now(),
      },
    });
    for (const account of accounts) {
      const user = await UserService.oneBy({
        accountId: account.id,
        accountOwner: true,
      });
      const daysToExpire = Math.round(
        moment(account.paymentFailedSubscriptionEndsAt).diff(
          Date.now(),
          "days",
          true
        )
      );
      EmailService.generalNotification(
        user.email,
        i18n.t("subscriptionService.runNotifyPaymentFailed.subject", {
          daysToExpire: daysToExpire,
        }),
        i18n.t("subscriptionService.runNotifyPaymentFailed.message", {
          date: moment(account.paymentFailedSubscriptionEndsAt).format(
            "DD/MM/YYYY"
          ),
        }),
        user.language
      );
    }
  }

  async createCustomerCheckoutSession(userId, planId) {
    try {
      const user = await UserService.byId(userId);
      let account = await AccountService.findById(user.accountId);

      if (!account.stripeCustomerId) {
        account = await this.createCustomer(userId);
      }

      const session = await stripe.checkout.sessions.create({
        success_url: process.env.FRONTEND_CUSTOMER_PORTAL_REDIRECT_URL,
        cancel_url: process.env.FRONTEND_CUSTOMER_PORTAL_REDIRECT_URL,
        line_items: [{ price: planId, quantity: 1 }],
        mode: "subscription",
        customer: account.stripeCustomerId,
        automatic_tax: { enabled: true },
      });

      return session.url;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }

  async createCustomerPortalSession(accountId) {
    try {
      const account = await AccountService.findById(accountId);

      const session = await stripe.billingPortal.sessions.create({
        customer: account.stripeCustomerId,
        return_url: process.env.FRONTEND_CUSTOMER_PORTAL_REDIRECT_URL,
      });
      return session.url;
    } catch (error) {
      return new ApplicationError(error.message, {}, 500);
    }
  }
}

export default new SubscriptionService();
