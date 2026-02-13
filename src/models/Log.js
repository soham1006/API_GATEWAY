const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  apiKey: String,
  path: String,
  method: String,
  statusCode: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
