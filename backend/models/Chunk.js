const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  documentName: { type: String, default: '' },
  pageNumber: { type: Number, default: 1 },
  section: { type: String, default: '' },
  verified: { type: Boolean, default: true },
  extractionTimestamp: { type: Date, default: Date.now },
  chunkText: { type: String, required: true },
  embedding: { type: [Number], default: [] },
  chunkIndex: { type: Number, required: true }
});

module.exports = mongoose.model('Chunk', chunkSchema);
