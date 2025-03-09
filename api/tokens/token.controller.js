// api/tokens/token.controller.js
import TokenService from "./token.service.js";

class TokenController {
  async index(req, res) {
    try {
      const tokens = await TokenService.findTokensForUser(
        req.user._id,
        req.user.accountId
      );
      
      return res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve tokens."
      });
    }
  }

  async deactivateToken(req, res) {
    try {
      const token = await TokenService.deactivateToken(
        req.params.id,
        req.user._id,
        req.user.accountId
      );
      
      if (!token) {
        return res.status(404).json({
          success: false,
          message: "Token not found or already deactivated."
        });
      }
      
      return res.json({
        success: true,
        message: "Token deactivated successfully."
      });
    } catch (error) {
      console.error('Error deactivating token:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to deactivate token."
      });
    }
  }

  async generateToken(req, res) {
    try {
      if (!req.body.leadId) {
        return res.status(400).json({
          success: false,
          message: "Lead ID is required."
        });
      }
      
      const token = await TokenService.generateTokenForLead(
        req.body.leadId,
        req.user._id,
        req.user.accountId
      );
      
      return res.json({
        success: true,
        data: token
      });
    } catch (error) {
      console.error('Error generating token:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate token."
      });
    }
  }
}

export default new TokenController();


