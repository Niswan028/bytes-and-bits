const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    default: 'Clinical Entity'
  },
  description: { type: String, default: '' },
  properties: { type: mongoose.Schema.Types.Mixed, default: {} },
  documentId: {
    type: mongoose.Schema.Types.Mixed
  },
  sourceDocumentName: { type: String, default: '' },
  occurrences: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entity', entitySchema);
