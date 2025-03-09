// api/leads/lead.controller.js
import LeadService from "./lead.service.js";
import TokenService from "../tokens/token.service.js";
import LeadValidator from "./lead.validator.js";

class LeadController {
  async index(req, res) {
    try {
      const leads = await LeadService.findLeadsForUser(
        req.user._id,
        req.user.accountId,
        10 // Hard limit of 10 leads
      );
      
      return res.json({
        success: true,
        data: leads
      });
    } catch (error) {
      console.error('Error retrieving leads:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve leads."
      });
    }
  }

  async byId(req, res) {
    try {
      const lead = await LeadService.getLeadById(
        req.params.id,
        req.user._id,
        req.user.accountId
      );
      
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found or access denied."
        });
      }
      
      return res.json({
        success: true,
        data: lead
      });
    } catch (error) {
      console.error('Error retrieving lead:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve lead."
      });
    }
  }

  // This is intentionally disabled but included
  async create(req, res) {
    return res.status(403).json({
      success: false,
      message: "This operation is not allowed."
    });
  }

  // This is intentionally disabled but included
  async update(req, res) {
    return res.status(403).json({
      success: false,
      message: "This operation is not allowed."
    });
  }

  // This is intentionally disabled but included
  async delete(req, res) {
    return res.status(403).json({
      success: false,
      message: "This operation is not allowed."
    });
  }

  async generateLeads(req, res) {
    try {
      // Limit number to max 10
      const number = Math.min(parseInt(req.params.number) || 10, 10);
      
      const leads = await LeadService.generateLeads(
        req.user._id,
        req.user.accountId,
        number
      );
      
      return res.json({
        success: true,
        data: leads,
        count: leads.length
      });
    } catch (error) {
      console.error('Error generating leads:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate leads."
      });
    }
  }

  async generateTrialLeads(req, res) {
    try {
      // For trial accounts, always limit to 3 leads
      const leads = await LeadService.generateTrialLeads(
        req.user._id,
        req.user.accountId,
        3
      );
      
      return res.json({
        success: true,
        data: leads,
        count: leads.length,
        message: "Trial leads generated successfully."
      });
    } catch (error) {
      console.error('Error generating trial leads:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate trial leads."
      });
    }
  }

  async subscriberUpdateNotifier(req, res) {
    try {
      await LeadService.notifySubscribersOfNewLeads();
      
      return res.json({
        success: true,
        message: "Notification process completed successfully."
      });
    } catch (error) {
      console.error('Error in subscriber update notifier:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to process subscriber notifications."
      });
    }
  }
}

export default new LeadController();

