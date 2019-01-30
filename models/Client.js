const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");
const validator = require("validator");

// Schema
const clientSchema = new mongoose.Schema({
  title: String,

  firstName: {
    type: String,
    trim: true,
    required: true
  },

  lastName: {
    type: String,
    trim: true,
    required: true
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"]
  },

  homePhone: {
    type: String,
    validate: [validator.isMobilePhone, "Invalid Home Phone Number"]
  },

  mobilePhone: {
    type: String,
    validate: [validator.isMobilePhone, "Invalid Mobile Phone Number"]
  },

  address: String,

  slug: String,

  notes: String,

  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "You must supply an author"
  },

  created: {
    type: Date,
    default: Date.now
  }
});

// Indexes
clientSchema.index({ firstName: "text", lastName: "text" });

// Generate and save slug
// TODO: Refactor
clientSchema.pre("save", async function(next) {
  // Return if name not updated
  if (!this.isModified("firstName") && !this.isModified("firstName")) return next();

  // Generate slug
  this.slug = slug(`${firstName} ${lastname}`);

  // Check for duplicate slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const clientsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (clientsWithSlug.length) {
    this.slug = `${this.slug}-${clientsWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model("Client", clientSchema);
