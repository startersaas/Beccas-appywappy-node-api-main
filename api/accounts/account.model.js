// ./api/accounts/account.model.js
import moment from "moment";
import localDatabase from "../../common/localDatabase.js";

const subscriptionTrial = "trial";
const subscriptionPaymentFailed = "payment_failed";
const subscriptionDeactivated = "deactivated";
const subscriptionActive = "active";

const schema = new localDatabase.Schema(
  {
    subdomain: String,
    displayName: String,
    companyName: String,
    companyVat: String,
    companyBillingAddress: String,
    companySdi: String,
    companyPec: String,
    companyPhone: String,
    companyEmail: String,
    companyCountry: String,
    privacyAccepted: {
      type: Boolean,
      default: false,
    },
    marketingAccepted: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: String,
    paymentFailed: {
      type: Boolean,
      default: false,
    },
    paymentFailedFirstAt: Date,
    paymentFailedSubscriptionEndsAt: Date,
    manualPayment: {
      type: Boolean,
      default: false,
    },
    trialPeriodEndsAt: Date,
    stripePlanId: String,
    subscriptionExpiresAt: Date,
    planType: String,
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

/*schema.virtual("subscriptionStatus").get(function () {
  if (moment(this.trialPeriodEndsAt).isAfter(Date.now())) {
    return subscriptionTrial;
  } else if (
    this.trialPeriodEndsAt &&
    moment(this.trialPeriodEndsAt).isBefore(Date.now())
  ) {
    return subscriptionDeactivated;
  } else if (
    this.paymentFailed &&
    moment(this.paymentFailedSubscriptionEndsAt).isAfter(Date.now())
  ) {
    return subscriptionPaymentFailed;
  } else if (
    this.paymentFailed &&
    moment(this.paymentFailedSubscriptionEndsAt).isBefore(Date.now())
  ) {
    return subscriptionDeactivated;
  } else if (moment(this.subscriptionExpiresAt).isBefore(Date.now())) {
    return subscriptionDeactivated;
  } else {
    return subscriptionActive;
  }
});*/

schema.virtual("subscriptionStatus").get(function () {
  // First check if there's an active subscription
  if (this.subscriptionExpiresAt && moment(this.subscriptionExpiresAt).isAfter(Date.now())) {
    return subscriptionActive;
  }
  
  // Then check for failed payments
  if (this.paymentFailed) {
    if (moment(this.paymentFailedSubscriptionEndsAt).isAfter(Date.now())) {
      return subscriptionPaymentFailed;
    }
    return subscriptionDeactivated;
  }
  
  // Then check trial status
  if (this.trialPeriodEndsAt) {
    if (moment(this.trialPeriodEndsAt).isAfter(Date.now())) {
      return subscriptionTrial;
    }
    return subscriptionDeactivated;
  }
  
  // If no conditions match, account is deactivated
  return subscriptionDeactivated;
});

schema.virtual("id").get(function () {
  return this._id;
});

const Account = localDatabase.model("Account", schema, "account");

export default Account;
