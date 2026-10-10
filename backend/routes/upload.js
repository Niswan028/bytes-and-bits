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
const { SYNTHETIC_SOURCE_DOCUMENTS, SYNTHETIC_PATIENTS } = require('../data/patientsData');
const { detectDuplicateLabTests, detectDrugInteractions, detectAllergyConflicts } = require('../middleware/reconciliationEngine');

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

    const docType = req.body.documentType || classifyMedicalDocumentType(req.file.originalname, docResult.text);
    const docId = `doc_${Date.now()}`;

    // Target patient identification
    const requestedPatientId = req.body.patientId || docResult.structuredEntities?.patient?.uhid || 'P1001';
    const targetPatient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === requestedPatientId.toLowerCase()) || SYNTHETIC_PATIENTS[0];

    const provider = req.body.doctor || docResult.structuredEntities?.provider?.doctor || 'Attending Physician';
    const clinic = req.body.facility || docResult.structuredEntities?.provider?.facility || 'Outpatient Diagnostic Centre';
    const eventDate = req.body.date || docResult.structuredEntities?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let eventType = 'VISIT';
    let category = 'Clinical Consultation';
    if (docType === 'prescription') {
      eventType = 'PRESCRIPTION';
      category = 'Prescription Order';
    } else if (docType === 'lab_report') {
      eventType = 'LAB';
      category = 'Pathology & Biochemistry';
    } else if (docType === 'discharge_summary') {
      eventType = 'DISCHARGE';
      category = 'Inpatient Discharge Summary';
    } else if (docType === 'imaging_report') {
      eventType = 'IMAGING';
      category = 'Radiology & Imaging';
    } else if (docType === 'pharmacy_log') {
      eventType = 'DISPENSE';
      category = 'Pharmacy Dispensing';
    }

    const eventId = `evt-${Date.now()}`;
    const timelineEvent = {
      id: eventId,
      date: eventDate,
      category,
      type: eventType,
      title: req.body.title || `${clinic} - ${docType.replace('_', ' ').toUpperCase()}`,
      provider,
      clinic,
      badge: docResult.ocrConfidence < 0.75 ? 'Needs Clinician Review' : 'Verified Clinical Record',
      badgeColor: docResult.ocrConfidence < 0.75 ? 'amber' : 'emerald',
      summary: req.body.notes || (docResult.text.length > 250 ? docResult.text.slice(0, 250) + '...' : docResult.text),
      sourceDoc: req.file.originalname,
      page: 1,
      ocrConfidence: `${(docResult.ocrConfidence * 100).toFixed(1)}%`,
      isScanned: docResult.isScanned
    };

    // Prepend to target patient timeline
    targetPatient.timelineEvents.unshift(timelineEvent);

    // If medications extracted, append to patient activeMedications
    if (docResult.structuredEntities?.medications?.length > 0) {
      docResult.structuredEntities.medications.forEach(m => {
        targetPatient.activeMedications.push({
          drugName: m.drugName || m.name,
          dose: m.dose || 'Standard',
          form: 'Tablet',
          frequency: m.instructions || '1 Tab OD',
          route: 'Oral',
          startDate: eventDate,
          prescribedBy: provider,
          clinic: clinic,
          sourceDoc: req.file.originalname,
          page: 1,
          status: 'Active',
          needsReview: m.needsReview || docResult.ocrConfidence < 0.75
        });
      });
    }

    // If lab tests extracted, append to patient labTrends
    if (docResult.structuredEntities?.labTests?.length > 0) {
      docResult.structuredEntities.labTests.forEach(l => {
        targetPatient.labTrends.push({
          date: eventDate,
          test: l.name || l.testName,
          value: parseFloat(l.value) || l.value,
          unit: l.unit || '',
          referenceRange: l.ref || l.referenceRange || '',
          status: l.status || 'NORMAL',
          provider: clinic,
          sourceDoc: req.file.originalname,
          page: 1
        });
      });
    }

    // If allergies extracted, append to patient allergies
    if (docResult.structuredEntities?.allergies?.length > 0) {
      docResult.structuredEntities.allergies.forEach(a => {
        targetPatient.allergies.push({
          substance: a.substance,
          reaction: a.reaction || 'Hypersensitivity',
          severity: a.severity || 'Moderate',
          recordedDate: eventDate,
          sourceDoc: req.file.originalname,
          page: 1
        });
      });
    }

    // Run instant cross-provider safety check
    const duplicateTests = detectDuplicateLabTests(targetPatient.id, 30);
    const drugInteractions = detectDrugInteractions(targetPatient.id);
    const allergyConflicts = detectAllergyConflicts(targetPatient.id);
    const safetyAlerts = {
      duplicateTests,
      drugInteractions,
      allergyConflicts,
      totalAlerts: duplicateTests.length + drugInteractions.length + allergyConflicts.length
    };

    // Register in-memory doc cache
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

    // Append to audit ledger
    auditLedger.appendEntry({
      eventType: 'RECORD_INGESTED',
      patientId: targetPatient.id,
      recordId: req.file.originalname,
      description: `Uploaded and parsed ${docType} (${req.file.originalname}) into ${targetPatient.name}'s longitudinal record`,
      actor: 'Patient / Clinic Ingestion Desk',
      payload: {
        filename: req.file.originalname,
        documentType: docType,
        patientId: targetPatient.id,
        patientName: targetPatient.name,
        sha256Hash,
        ocrConfidence: docResult.ocrConfidence,
        pageCount: docResult.pageCount,
        safetyAlertsTriggered: safetyAlerts.totalAlerts
      }
    });

    res.json({
      success: true,
      message: `Medical record parsed, verified, and integrated into ${targetPatient.name}'s health timeline.`,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
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
      },
      createdTimelineEvent: timelineEvent,
      safetyAlerts
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
