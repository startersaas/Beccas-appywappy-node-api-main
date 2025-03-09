// api/subscriptions/subscription.router.js
import * as express from "express";
import passport from "passport";
import ROLE from "../../api/users/role.model.js";
import { wrap } from "../../common/exceptions.js";
import authorizeRequest from "../../middlewares/authorizeRequest.middleware.js";
import subscriptionController from "./subscription.controller.js";

export default express
  .Router()
  .post(
    "/subscriptions",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.subscribe)
  )
  .delete(
    "/subscriptions",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.cancelSubscription)
  )
  .get(
    "/customers/me",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.getCustomer)
  )
  .get(
    "/customers/me/invoices",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.getCustomerInvoices)
  )
  .get(
    "/customers/me/cards",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.getCustomerCards)
  )
  .post(
    "/create-setup-intent",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.createSetupIntent)
  )
  .delete(
    "/cards",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.removeCreditCard)
  )
  .put(
    "/cards",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.setDefaultCreditCard)
  )
  .get("/plans", wrap(subscriptionController.getPlans))
  .post(
    "/create-customer-checkout-session",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.createCustomerCheckoutSession)
  )
  .post(
    "/create-customer-portal-session",
    passport.authenticate("jwt", { session: false }),
    authorizeRequest([ROLE.ADMIN]),
    wrap(subscriptionController.createCustomerPortalSession)
  );
