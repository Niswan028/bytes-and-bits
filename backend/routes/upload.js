const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const mongoose = require('mongoose');
const Document = require('../models/Document');
const { extractDocument } = require('../middleware/textExtractor');
const { chunkAndEmbed } = require('../middleware/embedder');
const { auditLedger } = require('../middleware/auditTrail');
const { registerInMemoryDocument, getInMemoryDocuments } = require('../middleware/memoryStore');
const { SYNTHETIC_SOURCE_DOCUMENTS } = require('../data/patientsData');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp', '.xlsx', '.xls', '.csv', '.tsv', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Supported formats: PDF, PNG, JPG, BMP, TIFF, XLSX, CSV, DOCX, TXT`));
    }
  }
});

function classifyMedicalDocumentType(filename = '', contentText = '') {
  const text = `${filename} ${contentText}`.toLowerCase();
  if (text.includes('prescription') || text.includes('rx') || text.includes('tab.') || text.includes('cap.') || text.includes('dosage')) return 'prescription';
  if (text.includes('discharge') || text.includes('inpatient') || text.includes('admission') || text.includes('hospital course')) return 'discharge_summary';
  if (text.includes('lipid') || text.includes('cholesterol') || text.includes('hba1c') || text.includes('pathology') || text.includes('biochemistry') || text.includes('lab') || text.includes('blood sugar')) return 'lab_report';
  if (text.includes('pharmacy') || text.includes('dispense') || text.includes('refill') || text.includes('batch')) return 'pharmacy_log';
  if (text.includes('x-ray') || text.includes('scan') || text.includes('radiology') || text.includes('ultrasound') || text.includes('mri')) return 'imaging_report';
  return 'clinical_note';
}

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No medical document uploaded.' });
    }

    const filePath = path.join(uploadsDir, req.file.filename);
    console.log(`[Upload] Ingesting clinical record: ${req.file.originalname}`);

    // Compute cryptographic SHA-256 seal
    const fileBuffer = fs.readFileSync(filePath);
    const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Extract text & multimodal OCR with image preprocessing
    const docResult = await extractDocument(filePath, req.file.originalname, req.file.mimetype);

    // Check failure state
    if (docResult.failureState || !docResult.text || docResult.text.trim().length === 0) {
      return res.status(422).json({
        success: false,
        error: 'UNREADABLE_DOCUMENT',
        message: docResult.errorMessage || 'Failed to extract text from document. File may be severely damaged, blurry, or empty.',
        filename: req.file.originalname
      });
    }

    const docType = classifyMedicalDocumentType(req.file.originalname, docResult.text);
    const docId = `doc_${Date.now()}`;

    // Register in-memory
    registerInMemoryDocument({
      _id: docId,
      originalName: req.file.originalname,
      documentType: docType,
      status: docResult.ocrConfidence < 0.75 ? 'needs_review' : 'verified',
      uploadDate: new Date(),
      pageCount: docResult.pageCount || 1,
      processingMethod: docResult.isScanned ? 'tesseract_ocr' : 'digital',
      ocrConfidence: docResult.ocrConfidence,
      fileHash: sha256Hash,
      structuredEntities: docResult.structuredEntities
    });

    // Chunk and generate local vector embeddings
    await chunkAndEmbed(docId, docResult.pages, req.file.originalname);

    // Append to cryptographic audit ledger
    auditLedger.appendEntry({
      eventType: 'RECORD_INGESTED',
      patientId: docResult.structuredEntities?.patient?.uhid || 'P1001',
      recordId: req.file.originalname,
      description: `Uploaded and processed ${docType} (${req.file.originalname})`,
      actor: 'Patient Portal Upload',
      payload: {
        filename: req.file.originalname,
        documentType: docType,
        sha256Hash,
        ocrConfidence: docResult.ocrConfidence,
        pageCount: docResult.pageCount
      }
    });

    res.json({
      success: true,
      message: 'Medical record processed, verified, and logged in health registry.',
      document: {
        id: docId,
        filename: req.file.originalname,
        documentType: docType,
        pageCount: docResult.pageCount,
        isScanned: docResult.isScanned,
        ocrConfidence: docResult.ocrConfidence,
        sha256Seal: sha256Hash,
        structuredEntities: docResult.structuredEntities,
        needsClinicianReview: docResult.ocrConfidence < 0.75
      }
    });
  } catch (err) {
    console.error('[Upload] Error processing file:', err.message);
    res.status(500).json({
      success: false,
      error: 'FILE_INGESTION_ERROR',
      details: err.message
    });
  }
});

/**
 * GET /api/documents
 * List all uploaded documents
 */
router.get('/documents', (req, res) => {
  const inMem = getInMemoryDocuments();
  const allDocs = inMem.length > 0 ? inMem : SYNTHETIC_SOURCE_DOCUMENTS;
  res.json({
    success: true,
    total: allDocs.length,
    documents: allDocs
  });
});

module.exports = router;
