const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  fileUrl: { type: String },
  extractedText: { type: String, default: '' },
  documentType: {
    type: String,
    enum: [
      'prescription',
      'diagnostic_lab_report',
      'discharge_summary',
      'consultation_note',
      'pharmacy_dispensing_log',
      'imaging_scan',
      'allergy_record',
      'clinical_dossier',
      'general'
    ],
    default: 'general'
  },
  patientId: { type: String, default: 'P1001' },
  pageCount: { type: Number, default: 1 },
  isScanned: { type: Boolean, default: false },
  verified: { type: Boolean, default: true },
  extractionTimestamp: { type: Date, default: Date.now },
  pages: [{
    pageNumber: { type: Number, required: true },
    text: { type: String, default: '' },
    section: { type: String, default: '' },
    confidence: { type: Number, default: 100 },
    method: { type: String, default: 'digital' }
  }],
  hash: { type: String },
  auditLedgerId: { type: String },
  errorMessage: { type: String, default: '' },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, default: 'uploaded' }
});

module.exports = mongoose.model('Document', documentSchema);
