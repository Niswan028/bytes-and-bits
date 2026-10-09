const express = require('express');
const router = express.Router();
const { auditLedger } = require('../middleware/auditTrail');
const { SYNTHETIC_PATIENTS } = require('../data/patientsData');

// In-memory store of active consents and access logs
const consentStore = new Map();
const accessLogs = [];

// Seed an initial demo access code for testing
const SEED_CODE = 'DOC-8942';
consentStore.set(SEED_CODE, {
  code: SEED_CODE,
  patientId: 'P1001',
  recipientDoctor: 'Dr. Sneha Roy (Fortis Care)',
  scopeCategory: 'ALL',
  scopeCondition: 'DIABETES_HYPERTENSION',
  scopeDateRange: 'LAST_6_MONTHS',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
  isRevoked: false,
  accessCount: 1
});

accessLogs.push({
  id: 'log-001',
  code: SEED_CODE,
  patientId: 'P1001',
  accessedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  accessorName: 'Dr. Sneha Roy',
  accessorRole: 'Cardiologist',
  ipAddress: '192.168.1.45',
  scopeAccessed: 'DIABETES_HYPERTENSION (Last 6 Months)'
});

/**
 * POST /api/consent/create
 * Patient creates a time-limited doctor sharing permission
 */
router.post('/consent/create', (req, res) => {
  const {
    patientId = 'P1001',
    recipientDoctor = 'Consulting Physician',
    scopeCategory = 'ALL',
    scopeCondition = 'ALL',
    scopeDateRange = 'LAST_6_MONTHS',
    durationMinutes = 60
  } = req.body;

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const code = `DOC-${randomDigits}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString();

  const consentRecord = {
    code,
    patientId,
    recipientDoctor,
    scopeCategory,
    scopeCondition,
    scopeDateRange,
    createdAt: now.toISOString(),
    expiresAt,
    isRevoked: false,
    accessCount: 0
  };

  consentStore.set(code, consentRecord);

  // Record into SHA-256 audit ledger
  auditLedger.appendEntry({
    eventType: 'CONSENT_GRANTED',
    patientId,
    recordId: code,
    description: `Patient granted ${durationMinutes}-minute time-limited access to ${recipientDoctor}`,
    actor: `Patient (${patientId})`,
    payload: { code, recipientDoctor, scopeCategory, scopeCondition, expiresAt }
  });

  res.json({
    success: true,
    message: 'Time-limited access code generated successfully.',
    consent: consentRecord
  });
});

/**
 * GET /api/consent/doctor/:code
 * Doctor accesses shared records using code (NO patient login required)
 */
router.get('/consent/doctor/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const consent = consentStore.get(code);

  if (!consent) {
    return res.status(404).json({
      success: false,
      error: 'INVALID_CODE',
      message: 'Access code not found. Please verify the code with the patient.'
    });
  }

  if (consent.isRevoked) {
    return res.status(403).json({
      success: false,
      error: 'CONSENT_REVOKED',
      message: 'This access permission was explicitly revoked by the patient.'
    });
  }

  const now = new Date();
  if (now > new Date(consent.expiresAt)) {
    return res.status(403).json({
      success: false,
      error: 'CODE_EXPIRED',
      message: 'This access code has expired. Request a new time-limited code from the patient.'
    });
  }

  // Increment access counter and record log
  consent.accessCount = (consent.accessCount || 0) + 1;
  const accessLogEntry = {
    id: `log-${Date.now()}`,
    code,
    patientId: consent.patientId,
    accessedAt: now.toISOString(),
    accessorName: consent.recipientDoctor,
    accessorRole: 'Attending Clinician',
    ipAddress: req.ip || '127.0.0.1',
    scopeAccessed: `${consent.scopeCondition} / ${consent.scopeCategory}`
  };
  accessLogs.unshift(accessLogEntry);

  auditLedger.appendEntry({
    eventType: 'DOCTOR_ACCESSED',
    patientId: consent.patientId,
    recordId: code,
    description: `Clinician ${consent.recipientDoctor} accessed records under consent ${code}`,
    actor: consent.recipientDoctor,
    payload: { code, accessTimestamp: now.toISOString() }
  });

  // Filter patient data according to consented scope
  const patient = SYNTHETIC_PATIENTS.find(p => p.id === consent.patientId) || SYNTHETIC_PATIENTS[0];
  let filteredMedications = [...patient.activeMedications];
  let filteredLabs = [...patient.labTrends];

  if (consent.scopeCategory === 'LABS_ONLY') {
    filteredMedications = [];
  } else if (consent.scopeCategory === 'PRESCRIPTIONS_ONLY') {
    filteredLabs = [];
  }

  res.json({
    success: true,
    accessGranted: true,
    consentDetails: {
      code: consent.code,
      recipientDoctor: consent.recipientDoctor,
      scopeCategory: consent.scopeCategory,
      scopeCondition: consent.scopeCondition,
      expiresAt: consent.expiresAt
    },
    patient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      chronicConditions: patient.chronicConditions,
      criticalAllergies: patient.allergies,
      activeMedications: filteredMedications,
      recentKeyLabs: filteredLabs.slice(-6),
      emergencyContact: patient.emergencyContact
    }
  });
});

/**
 * POST /api/consent/revoke/:code
 * Patient immediately revokes access
 */
router.post('/consent/revoke/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const consent = consentStore.get(code);

  if (!consent) {
    return res.status(404).json({ success: false, error: 'Code not found' });
  }

  consent.isRevoked = true;
  consent.revokedAt = new Date().toISOString();

  auditLedger.appendEntry({
    eventType: 'CONSENT_REVOKED',
    patientId: consent.patientId,
    recordId: code,
    description: `Patient revoked doctor access code ${code}`,
    actor: `Patient (${consent.patientId})`,
    payload: { code, revokedAt: consent.revokedAt }
  });

  res.json({
    success: true,
    message: `Access code ${code} revoked successfully. Immediate effect.`,
    consent
  });
});

/**
 * GET /api/consent/patient/:patientId
 * Patient gets all active and past consents
 */
router.get('/consent/patient/:patientId', (req, res) => {
  const patientId = req.params.patientId || 'P1001';
  const consents = Array.from(consentStore.values()).filter(c => c.patientId === patientId);
  const logs = accessLogs.filter(l => l.patientId === patientId);

  res.json({
    success: true,
    patientId,
    totalConsents: consents.length,
    consents,
    accessLogs: logs
  });
});

module.exports = router;
