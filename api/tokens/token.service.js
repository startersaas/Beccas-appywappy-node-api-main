// api/tokens/token.service.js
import BaseService from "../../services/base.service.js";
import Token from "./token.model.js";

class TokenService extends BaseService {
  getModel() {
    return Token;
  }

  async findTokensForUser(userId, accountId) {
    return this.getModel().find({
      userId: userId,
      accountId: accountId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('leadId').lean();
  }

  async findTokenForLead(leadId, userId, accountId) {
    return this.getModel().findOne({
      leadId: leadId,
      userId: userId,
      accountId: accountId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).lean();
  }

  async deactivateToken(tokenId, userId, accountId) {
    return this.getModel().findOneAndUpdate(
      { 
        _id: tokenId,
        userId: userId,
        accountId: accountId
      },
      { isActive: false },
      { new: true }
    ).lean();
  }

  async generateTokenForLead(leadId, userId, accountId) {
    // Check if token already exists
    const existingToken = await this.findTokenForLead(leadId, userId, accountId);
    
    if (existingToken) {
      // If token exists but is expired or inactive, update it
      if (!existingToken.isActive || existingToken.expiresAt <= new Date()) {
        return this.getModel().findByIdAndUpdate(
          existingToken._id,
          {
            isActive: true,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          { new: true }
        ).lean();
      }
      
      // If token exists and is active, return it
      return existingToken;
    }
    
    // Otherwise create a new token
    const token = await Token.generateToken(userId, leadId, accountId);
    await token.save();
    return token.toObject();
  }
}

export default new TokenService();


