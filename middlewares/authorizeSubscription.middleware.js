// middlewares/authorizeSubscription.middleware.js
import { getStatusCode, StatusCodes } from "http-status-codes";
import ApplicationError from "../libs/errors/application.error.js";
import AccountService from "../api/accounts/account.service.js";

export default () => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        throw new ApplicationError(
          getStatusCode(StatusCodes.UNAUTHORIZED),
          "Not authorized",
          StatusCodes.UNAUTHORIZED
        );
      }
      
      const account = await AccountService.findById(user.accountId);
      
      // Check if account has active subscription or is in trial period
      if (['active', 'trial'].includes(account.subscriptionStatus)) {
        // For trial users, only allow access to trial routes
        if (account.subscriptionStatus === 'trial' && 
            req.path !== '/trial-leads' && 
            !req.path.startsWith('/trial-')) {
          throw new ApplicationError(
            getStatusCode(StatusCodes.FORBIDDEN),
            "This feature requires an active subscription",
            StatusCodes.FORBIDDEN
          );
        }
        
        // For all other valid subscription statuses, allow access
        return next();
      }
      
      throw new ApplicationError(
        getStatusCode(StatusCodes.FORBIDDEN),
        "Your subscription is inactive or expired",
        StatusCodes.FORBIDDEN
      );
    } catch (error) {
      // If error is already an ApplicationError, pass it through
      if (error instanceof ApplicationError) {
        throw error;
      }
      
      // Otherwise wrap in generic error
      throw new ApplicationError(
        getStatusCode(StatusCodes.INTERNAL_SERVER_ERROR),
        "Error verifying subscription status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
};

