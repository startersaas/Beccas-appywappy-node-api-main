// ./api/accounts/account.serializer.js
import BaseSerializer from "../../serializers/base.serializer.js";
import moment from "moment";

class AccountSerializer extends BaseSerializer {
  constructor() {
    super();
    this.properties = [
      "_id",
      "subdomain",
      "companyName",
      "companyVat",
      "companyBillingAddress",
      "companySdi",
      "companyPec",
      "companyPhone",
      "companyEmail",
      "companyCountry",
      "paymentFailed",
      "paymentFailedFirstAt",
      "trialPeriodEndsAt",
      "paymentFailedSubscriptionEndsAt",
      "privacyAccepted",
      "marketingAccepted",
      "stripePlanId",
      "subscriptionExpiresAt",
      "planType",
      "createdAt",
      "updatedAt",
      "subscriptionStatus"
    ];
  }

  show(object) {
    const serialized = super.show(object);
    
    // Calculate subscription status
    if (serialized.subscriptionExpiresAt && moment(serialized.subscriptionExpiresAt).isAfter(Date.now())) {
      serialized.subscriptionStatus = 'active';
    } else if (serialized.paymentFailed) {
      if (serialized.paymentFailedSubscriptionEndsAt && 
          moment(serialized.paymentFailedSubscriptionEndsAt).isAfter(Date.now())) {
        serialized.subscriptionStatus = 'payment_failed';
      } else {
        serialized.subscriptionStatus = 'deactivated';
      }
    } else if (serialized.trialPeriodEndsAt) {
      if (moment(serialized.trialPeriodEndsAt).isAfter(Date.now())) {
        serialized.subscriptionStatus = 'trial';
      } else {
        serialized.subscriptionStatus = 'deactivated';
      }
    } else {
      serialized.subscriptionStatus = 'deactivated';
    }
    
    return serialized;
  }
}

export default new AccountSerializer();