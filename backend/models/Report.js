const mongoose = require('mongoose');

const fieldTraceabilitySchema = new mongoose.Schema({
  fieldKey: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  unit: { type: String, default: '' },
  sourceDocumentName: { type: String, required: true },
  pageNumber: { type: Number, default: 1 },
  section: { type: String, default: '' },
  extractionTimestamp: { type: Date, default: Date.now },
  verified: { type: Boolean, default: true },
  confidence: { type: Number, default: 1.0 }
}, { _id: false });

const reportSectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fields: [fieldTraceabilitySchema],
  tableData: { type: mongoose.Schema.Types.Mixed, default: null }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  templateId: { type: String, default: 'patient_longitudinal_health_record' },
  patientId: { type: String, default: 'P1001' },
  patientName: { type: String, default: 'Rajesh Sharma' },
  clinicalSpecialty: { type: String, default: 'Endocrinology & Internal Medicine' },
  consultingClinician: { type: String, default: '' },
  facility: { type: String, default: '' },
  verificationSeal: { type: String, default: 'CSIQ-CLINICAL-AUTH' },
  status: {
    type: String,
    enum: ['draft', 'compiled', 'verified', 'published'],
    default: 'compiled'
  },
  generatedAt: { type: Date, default: Date.now },
  sourceDocuments: [{
    documentName: String,
    hash: String,
    pageCount: Number,
    isScanned: Boolean
  }],
  sections: [reportSectionSchema],
  markdownContent: { type: String, default: '' },
  summary: { type: String, default: '' },
  compilationHash: { type: String, default: '' },
  overallAccuracy: { type: Number, default: 100.0 }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
