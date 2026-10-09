const express = require('express');
const router = express.Router();
const { SYNTHETIC_PATIENTS, SYNTHETIC_SOURCE_DOCUMENTS } = require('../data/patientsData');

/**
 * GET /api/patients
 * List all synthetic patients with conditions, active meds, and key stats
 */
router.get('/patients', (req, res) => {
  res.json({
    success: true,
    total: SYNTHETIC_PATIENTS.length,
    disclaimer: 'SYNTHETIC DEMO DATA ONLY - No real patient information.',
    patients: SYNTHETIC_PATIENTS.map(p => ({
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      dob: p.dob,
      bloodGroup: p.bloodGroup,
      chronicConditions: p.chronicConditions,
      allergiesCount: p.allergies.length,
      activeMedicationsCount: p.activeMedications.length,
      timelineEventsCount: p.timelineEvents.length,
      hasSafetyAlerts: p.timelineEvents.some(e => e.type.includes('ALERT') || e.type.includes('CONFLICT') || e.type.includes('DUPLICATE'))
    }))
  });
});

/**
 * GET /api/patients/:id
 * Retrieve comprehensive patient longitudinal health profile
 */
router.get('/patients/:id', (req, res) => {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }

  res.json({
    success: true,
    disclaimer: 'SYNTHETIC DEMO DATA - Generated for hackathon evaluation.',
    patient
  });
});

/**
 * GET /api/patients/:id/timeline
 * Retrieve structured timeline events with filtering
 */
router.get('/patients/:id/timeline', (req, res) => {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }

  const { category, provider, condition } = req.query;
  let events = [...patient.timelineEvents];

  if (category && category !== 'all') {
    events = events.filter(e => e.type.toLowerCase().includes(category.toLowerCase()) || e.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (provider && provider !== 'all') {
    events = events.filter(e => e.provider.toLowerCase().includes(provider.toLowerCase()) || e.clinic.toLowerCase().includes(provider.toLowerCase()));
  }

  res.json({
    success: true,
    patientId: patient.id,
    patientName: patient.name,
    totalEvents: events.length,
    events
  });
});

/**
 * GET /api/patients/:id/emergency
 * One-tap emergency care handoff view
 */
router.get('/patients/:id/emergency', (req, res) => {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }

  // Get most recent critical labs
  const recentLabs = patient.labTrends.slice(-5);

  res.json({
    success: true,
    disclaimer: 'EMERGENCY CLINICAL SUMMARY (DEMO) - Verify with attending physician.',
    emergencyRecord: {
      patientId: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      emergencyContact: patient.emergencyContact,
      criticalAllergies: patient.allergies,
      chronicConditions: patient.chronicConditions,
      activeMedications: patient.activeMedications,
      recentKeyLabs: recentLabs,
      sha256Seal: 'e7c4f1a8b9d2301984712039abcdf0123456789abcdef0123456789abcdef0'
    }
  });
});

/**
 * GET /api/documents
 * List all synthetic ingested source records
 */
router.get('/documents', (req, res) => {
  res.json({
    success: true,
    total: SYNTHETIC_SOURCE_DOCUMENTS.length,
    documents: SYNTHETIC_SOURCE_DOCUMENTS
  });
});

module.exports = router;
