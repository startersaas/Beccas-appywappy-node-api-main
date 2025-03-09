import mongoose from "mongoose";
import localDatabase from "../../common/localDatabase.js";

const schema = new localDatabase.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    filePath: {
      type: String,
      default: null
    },
    fileType: {
      type: String,
      default: null
    },
    fileSize: {
      type: Number,
      default: 0
    },
    metadata: {
      type: Object,
      default: {}
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teams: [{
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      code: { type: String },
      name: { type: String }
    }],
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

const Workspace = localDatabase.model("Workspace", schema, "workspace");

export default Workspace;

