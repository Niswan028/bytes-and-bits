const express = require('express');
const router = express.Router();
const { auditLedger } = require('../middleware/auditTrail');

// In-memory verification queue
const verificationQueue = [
  {
    id: 'vq-001',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentName: 'urgent_care_allergy_conflict_rx_p1001.png',
    pageNumber: 1,
    fieldLabel: 'Prescribed Antibiotic Formulation',
    extractedValue: 'Tab. Augmentin 625 mg (Amoxicillin 500mg + Clavulanic Acid 125mg)',
    ocrConfidence: 0.72,
    detectionReason: 'Low OCR confidence / phone photo capture angle + severe penicillin allergy conflict detected.',
    status: 'NEEDS_REVIEW',
    verifiedBy: null,
    registrationNo: null,
    verifiedAt: null
  },
  {
    id: 'vq-002',
    patientId: 'P1002',
    patientName: 'Priya Venkat',
    documentName: 'ortho_care_nsaid_allergy_rx_p1002.png',
    pageNumber: 1,
    fieldLabel: 'Analgesic Prescription & Dosage',
    extractedValue: 'Tab. Ibuprofen 400 mg TDS',
    ocrConfidence: 0.68,
    detectionReason: 'Handwritten prescription script with low stroke contrast. Contradicts asthma allergy profile.',
    status: 'NEEDS_REVIEW',
    verifiedBy: null,
    registrationNo: null,
    verifiedAt: null
  },
  {
    id: 'vq-003',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentName: 'city_family_clinic_conflicting_rx_p1001.pdf',
    pageNumber: 1,
    fieldLabel: 'Second-Line Oral Hypoglycemic Dose',
    extractedValue: 'Tab. Metformin Extended Release 850 mg BD',
    ocrConfidence: 0.88,
    detectionReason: 'Potential biguanide dose escalation contradiction against Apollo Sugar Clinic record.',
    status: 'VERIFIED',
    verifiedBy: 'Dr. Arvind Rao',
    registrationNo: 'KMC-38192',
    verifiedAt: '2026-04-06T10:30:00.000Z'
  }
];

const handleGetQueue = (req, res) => {
  res.json({
    success: true,
    totalItems: verificationQueue.length,
    pendingReviewCount: verificationQueue.filter(v => v.status === 'NEEDS_REVIEW').length,
    items: verificationQueue
  });
};

router.get('/verification/queue', handleGetQueue);
router.get('/verify/queue', handleGetQueue);

const handleSignoff = (req, res) => {
  const { id, itemId, clinicianName, doctorName, registrationNo, registrationNumber, correctedValue, notes } = req.body;
  const targetId = id || itemId;
  const docName = clinicianName || doctorName;
  const regNo = registrationNo || registrationNumber;

  if (!targetId || !docName || !regNo) {
    return res.status(400).json({ success: false, error: 'Missing required clinician signoff details (id/itemId, clinicianName/doctorName, registrationNo).' });
  }

  const item = verificationQueue.find(v => v.id === targetId);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found in verification queue.' });
  }

  item.status = 'VERIFIED';
  item.verifiedBy = docName;
  item.registrationNo = regNo;
  item.verifiedAt = new Date().toISOString();
  if (correctedValue) {
    item.extractedValue = correctedValue;
    item.correctionApplied = true;
  }
  if (notes) item.clinicianNotes = notes;

  // Append to cryptographic audit trail
  auditLedger.appendEntry({
    eventType: 'FIELD_VERIFIED',
    patientId: item.patientId,
    recordId: item.documentName,
    description: `Clinician ${docName} (${regNo}) signed off on field: ${item.fieldLabel}`,
    actor: `${docName} (${regNo})`,
    payload: {
      fieldLabel: item.fieldLabel,
      verifiedValue: item.extractedValue,
      verifiedBy: docName,
      registrationNo: regNo,
      notes: notes || 'Verified accurate against source document'
    }
  });

  res.json({
    success: true,
    message: 'Clinician sign-off recorded in clinical audit trail.',
    item
  });
};

router.post('/verification/signoff', handleSignoff);
router.post('/verify/sign-off', handleSignoff);
router.post('/verify/signoff', handleSignoff);

module.exports = router;
