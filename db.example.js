// db.example.js - Real Estate Leads Schema Examples
// Contains preferred schema models for real estate leads

// SCHEMA 1: Comprehensive MLS-Style Property Leads
const mlsPropertyLeadSchema = {
  "_id": ObjectId,
  "listingId": String,        // Unique MLS identifier
  "status": String,           // Active, Pending, Sold, Withdrawn, etc.
  "propertyType": String,     // Single Family, Condo, Multi-Family, Land, etc.
  
  // Core Property Details
  "price": Number,
  "originalPrice": Number,    // If price reductions occurred
  "address": {
    "street": String,
    "unit": String,
    "city": String,
    "state": String,
    "zipCode": String,
    "county": String,
    "neighborhood": String,
    "latitude": Number,
    "longitude": Number
  },
  
  // Property Specifications
  "bedrooms": Number,
  "bathrooms": Number,
  "halfBaths": Number,
  "squareFeet": Number,
  "lotSize": Number,          // In acres or sq ft
  "yearBuilt": Number,
  "stories": Number,
  
  // Property Features
  "features": {
    "hasGarage": Boolean,
    "garageSpaces": Number,
    "hasPool": Boolean,
    "hasSpa": Boolean,
    "hasFireplace": Boolean,
    "hasBasement": Boolean,
    "cooling": String,        // Central, Window, None
    "heating": String,
    "appliances": [String],   // Refrigerator, Dishwasher, etc.
    "flooringTypes": [String],
    "construction": String,   // Brick, Frame, Stucco
    "roof": String,
    "waterfront": Boolean,
    "view": String
  },
  
  // Financial & Transaction Info
  "taxAssessment": Number,
  "taxYear": Number,
  "hoa": {
    "feeAmount": Number,
    "frequency": String      // Monthly, Quarterly, Annual
  },
  "daysOnMarket": Number,
  "closeDate": Date,
  "closePrice": Number,
  
  // Listing Details
  "listedDate": Date,
  "description": String,      // Full property description
  "remarks": String,          // Agent remarks, often contains valuable insights
  "showingInstructions": String,
  "lockboxLocation": String,
  "virtualTourUrl": String,
  
  // Agent & Office Info
  "listingAgent": {
    "name": String,
    "email": String,
    "phone": String,
    "office": String,
    "licenseNumber": String
  },
  "coListingAgent": {
    "name": String,
    "email": String,
    "phone": String
  },
  
  // Schools & Districts
  "schools": {
    "elementary": String,
    "middle": String,
    "high": String,
    "district": String
  },
  
  // Media
  "photos": [
    {
      "url": String,
      "description": String,
      "order": Number
    }
  ],
  "floorPlans": [String],
  "documents": [
    {
      "type": String,       // Disclosure, Survey, Inspection
      "url": String
    }
  ],
  
  // Internal tracking fields
  "ownerName": String,     // If available from public records
  "ownerPhone": String,    // If available
  "ownerEmail": String,    // If available
  "previousTransactions": [
    {
      "date": Date,
      "price": Number,
      "type": String       // Sale, Refinance, etc.
    }
  ],
  
  // Lead Management
  "leadQuality": Number,   // Your internal scoring 1-10
  "notes": String,
  "assignedToUserId": String,  // Your subscriber who has access to this lead
  "leadSource": String,
  "lastUpdated": Date,
  "createdAt": Date
};

// SCHEMA 2: FSBO/Flat-Fee MLS Seller Leads (Advanced)
const advancedSellerLeadSchema = {
  "_id": ObjectId,
  "sellerInfo": {
    "name": String,
    "phone": String,
    "email": String,
    "bestTimeToContact": String
  },
  "propertyInfo": {
    "address": {
      "street": String,
      "unit": String,
      "city": String,
      "state": String,
      "zipCode": String,
      "county": String,
      "neighborhood": String,
      "latitude": Number,
      "longitude": Number
    },
    "bedrooms": Number,
    "bathrooms": Number,
    "squareFeet": Number,
    "lotSize": Number,
    "yearBuilt": Number,
    "askingPrice": Number
  },
  "listingInfo": {
    "listingType": String,      // "FSBO", "Flat Fee MLS", "Discount Broker"
    "dateCreated": Date,
    "expirationDate": Date,
    "servicePaid": Number,      // Amount paid for listing service
    "serviceProvider": String,  // Your company or competitor
    "listingUrl": String,       // Link to original listing
    "mlsNumber": String         // If applicable
  },
  "status": String,             // "Active", "Pending", "Sold", "Expired"
  "notes": String,              // Special instructions, seller motivation, etc.
  "assignedToUserId": String,   // Subscriber who has this lead
  "leadQuality": Number,        // Your internal scoring
  "lastUpdated": Date
};

// SCHEMA 3: Simplified Seller Lead Schema
const simpleSellerLeadSchema = {
  "_id": ObjectId,
  "sellerName": String,
  "contactInfo": {
    "phone": String,
    "email": String
  },
  "propertyAddress": String,
  "propertyDetails": {
    "bedrooms": Number,
    "bathrooms": Number,
    "squareFeet": Number,
    "askingPrice": Number
  },
  "listingType": String,      // "FSBO", "Flat Fee MLS", "Discount Broker"
  "status": String,           // "Active", "Pending", "Sold", "Expired"
  "notes": String,
  "assignedTo": String,
  "createdAt": Date
};

// Export schemas for use in your application
module.exports = {
  mlsPropertyLeadSchema,
  advancedSellerLeadSchema,
  simpleSellerLeadSchema
};

