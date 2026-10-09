const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  sources: { type: [String], default: [] },
  relatedAlerts: { type: [String], default: [] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', querySchema);
