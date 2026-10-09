const express = require('express');
const router = express.Router();
const { compilePatientDossier } = require('../middleware/reportCompiler');

/**
 * POST /api/reports/compile
 * Trigger compilation of a verified patient health dossier
 */
router.post('/reports/compile', async (req, res) => {
  try {
    const { patientId = 'P1001', template = 'patient_longitudinal_health_record' } = req.body;
    const dossier = await compilePatientDossier(patientId, template);
    res.json({
      success: true,
      message: 'Clinical dossier compiled and verified in health registry.',
      report: dossier
    });
  } catch (error) {
    console.error('[reports.js] Error compiling dossier:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/compile
 * Convenient GET endpoint for quick UI inspection
 */
router.get('/reports/compile', async (req, res) => {
  try {
    const patientId = req.query.patientId || 'P1001';
    const template = req.query.template || 'patient_longitudinal_health_record';
    const dossier = await compilePatientDossier(patientId, template);
    res.json({
      success: true,
      report: dossier
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
