// api/leads/lead.model.js
import mongoose from "mongoose";
import localDatabase from "../../common/localDatabase.js";

const photoSchema = new localDatabase.Schema({
  url: String,
  description: String,
  order: Number
});

const documentSchema = new localDatabase.Schema({
  type: String,
  url: String
});

const previousTransactionSchema = new localDatabase.Schema({
  date: Date,
  price: Number,
  type: String
});

const schema = new localDatabase.Schema(
  {
    listingId: String,
    status: String,
    propertyType: String,
    
    // Core Property Details
    price: Number,
    originalPrice: Number,
    address: {
      street: String,
      unit: String,
      city: String,
      state: String,
      zipCode: String,
      county: String,
      neighborhood: String,
      latitude: Number,
      longitude: Number
    },
    
    // Property Specifications
    bedrooms: Number,
    bathrooms: Number,
    halfBaths: Number,
    squareFeet: Number,
    lotSize: Number,
    yearBuilt: Number,
    stories: Number,
    
    // Property Features
    features: {
      hasGarage: Boolean,
      garageSpaces: Number,
      hasPool: Boolean,
      hasSpa: Boolean,
      hasFireplace: Boolean,
      hasBasement: Boolean,
      cooling: String,
      heating: String,
      appliances: [String],
      flooringTypes: [String],
      construction: String,
      roof: String,
      waterfront: Boolean,
      view: String
    },
    
    // Financial & Transaction Info
    taxAssessment: Number,
    taxYear: Number,
    hoa: {
      feeAmount: Number,
      frequency: String
    },
    daysOnMarket: Number,
    closeDate: Date,
    closePrice: Number,
    
    // Listing Details
    listedDate: Date,
    description: String,
    remarks: String,
    showingInstructions: String,
    lockboxLocation: String,
    virtualTourUrl: String,
    
    // Agent & Office Info
    listingAgent: {
      name: String,
      email: String,
      phone: String,
      office: String,
      licenseNumber: String
    },
    coListingAgent: {
      name: String,
      email: String,
      phone: String
    },
    
    // Schools & Districts
    schools: {
      elementary: String,
      middle: String,
      high: String,
      district: String
    },
    
    // Media
    photos: [photoSchema],
    floorPlans: [String],
    documents: [documentSchema],
    
    // Internal tracking fields
    ownerName: String,
    ownerPhone: String,
    ownerEmail: String,
    previousTransactions: [previousTransactionSchema],
    
    // Lead Management
    leadQuality: Number,
    notes: String,
    assignedToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    leadSource: String,
    lastUpdated: Date
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

schema.virtual("id").get(function () {
  return this._id;
});

const Lead = localDatabase.model("Lead", schema, "lead");

export default Lead;

