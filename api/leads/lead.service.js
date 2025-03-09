// api/leads/lead.service.js
import BaseService from "../../services/base.service.js";
import Lead from "./lead.model.js";
import Token from "../tokens/token.model.js";
import EmailService from "../emails/email.service.js";
import UserService from "../users/user.service.js";
import faker from "faker";
import i18n from "../../common/i18n.js";

class LeadService extends BaseService {
  getModel() {
    return Lead;
  }

  async findLeadsForUser(userId, accountId, limit = 10) {
    // Find all tokens for this user
    const tokens = await Token.find({ 
      userId: userId,
      accountId: accountId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).lean();
    
    // Get the lead IDs from tokens
    const leadIds = tokens.map(token => token.leadId);
    
    // Find all leads that match these IDs
    const leads = await this.getModel().find({
      _id: { $in: leadIds }
    }).limit(limit).lean();
    
    return leads;
  }

  async generateLeads(userId, accountId, count = 10) {
    // Limit to max 10 records
    const actualCount = Math.min(count, 10);
    
    // Find leads that haven't been assigned to this user yet
    const existingLeadIds = await Token.distinct('leadId', { 
      userId: userId,
      accountId: accountId
    });
    
    // Find unassigned leads, limited to requested count
    const leads = await this.getModel().find({
      _id: { $nin: existingLeadIds }
    }).limit(actualCount).lean();
    
    // If not enough leads found, return what we have
    if (leads.length < actualCount) {
      return leads;
    }
    
    // Create tokens for each lead
    const tokens = [];
    for (const lead of leads) {
      const token = await Token.generateToken(userId, lead._id, accountId);
      await token.save();
      tokens.push(token);
    }
    
    return leads;
  }

  async generateTrialLeads(userId, accountId, count = 3) {
    // Always limit trial leads to 3
    const actualCount = Math.min(count, 3);
    
    // Create mock leads
    const mockLeads = [];
    
    for (let i = 0; i < actualCount; i++) {
      const mockLead = new Lead({
        listingId: `TRIAL-${faker.random.alphaNumeric(8).toUpperCase()}`,
        status: "Active",
        propertyType: faker.random.arrayElement([
          "Single Family", "Condo", "Townhouse", "Multi-Family"
        ]),
        price: faker.commerce.price(150000, 1500000, 0),
        originalPrice: faker.commerce.price(150000, 1500000, 0),
        address: {
          street: faker.address.streetAddress(),
          city: faker.address.city(),
          state: faker.address.stateAbbr(),
          zipCode: faker.address.zipCode(),
          county: faker.address.county()
        },
        bedrooms: faker.random.number({min: 1, max: 6}),
        bathrooms: faker.random.number({min: 1, max: 4}),
        squareFeet: faker.random.number({min: 800, max: 4000}),
        yearBuilt: faker.random.number({min: 1960, max: 2020}),
        description: "TRIAL ACCOUNT: This is a mock listing for demonstration purposes only.",
        leadQuality: faker.random.number({min: 3, max: 8}),
        notes: "This is a trial lead and does not represent a real property."
      });
      
      await mockLead.save();
      mockLeads.push(mockLead);
      
      // Create token for this lead
      const token = await Token.generateToken(userId, mockLead._id, accountId);
      await token.save();
    }
    
    return mockLeads;
  }

  async getLeadById(leadId, userId, accountId) {
    // Check if user has access to this lead
    const token = await Token.findOne({
      leadId: leadId,
      userId: userId,
      accountId: accountId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
    
    if (!token) {
      return null;
    }
    
    // Update last accessed time
    token.lastAccessed = new Date();
    await token.save();
    
    // Get the lead
    const lead = await this.getModel().findById(leadId).lean();
    return lead;
  }

  async notifySubscribersOfNewLeads() {
    // Get all users with active subscriptions
    const users = await UserService.find({});
    const activeUsers = [];
    
    for (const user of users) {
      // Check if user has active subscription
      try {
        const account = await UserService.findAccountForUser(user._id);
        if (account && ['active'].includes(account.subscriptionStatus)) {
          activeUsers.push(user);
        }
      } catch (error) {
        console.error(`Error checking subscription for user ${user._id}:`, error);
      }
    }
    
    // For each active user, check if they have new leads in the last 24 hours
    for (const user of activeUsers) {
      try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const newTokens = await Token.find({
          userId: user._id,
          createdAt: { $gt: oneDayAgo },
          isActive: true
        }).populate('leadId').lean();
        
        if (newTokens.length > 0) {
          // Send email notification
          await EmailService.generalNotification(
            user.email,
            i18n.t("leadService.newLeadsNotification.subject", { count: newTokens.length }),
            i18n.t("leadService.newLeadsNotification.message", { 
              count: newTokens.length,
              frontendURL: process.env.FRONTEND_URL + "/leads"
            }),
            user.language
          );
        }
      } catch (error) {
        console.error(`Error notifying user ${user._id} of new leads:`, error);
      }
    }
  }
}

export default new LeadService();


