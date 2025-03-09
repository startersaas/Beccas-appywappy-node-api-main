// api/tokens/token.model.js
import mongoose from "mongoose";
import localDatabase from "../../common/localDatabase.js";
import crypto from "crypto";

const schema = new localDatabase.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastAccessed: {
      type: Date,
      default: null
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

schema.virtual("id").get(function () {
  return this._id;
});

// Static method to generate token
schema.statics.generateToken = function(userId, leadId, accountId) {
  const data = `${userId}-${leadId}-${Date.now()}`;
  const token = crypto.createHash('md5').update(data).digest('hex');
  
  return new this({
    token,
    userId,
    leadId,
    accountId
  });
};

const Token = localDatabase.model("Token", schema, "token");

export default Token;


