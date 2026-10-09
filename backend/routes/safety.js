const express = require('express');
const router = express.Router();
const {
  detectDuplicateLabTests,
  detectDrugInteractions,
  detectAllergyConflicts,
  reconcileActiveMedications
} = require('../middleware/reconciliationEngine');

/**
 * GET /api/safety/:patientId
 * Aggregated clinical safety audit
 */
router.get('/safety/:patientId', (req, res) => {
  const patientId = req.params.patientId || 'P1001';
  const windowDays = parseInt(req.query.windowDays, 10) || 30;

  const duplicateTests = detectDuplicateLabTests(patientId, windowDays);
  const drugInteractions = detectDrugInteractions(patientId);
  const allergyConflicts = detectAllergyConflicts(patientId);
  const reconciledMedications = reconcileActiveMedications(patientId);

  const totalSafetyAlerts = duplicateTests.length + drugInteractions.length + allergyConflicts.length;

  res.json({
    success: true,
    patientId,
    windowDays,
    totalSafetyAlerts,
    disclaimer: 'RULE-BASED DEMO SET, NOT CLINICAL-GRADE - Created for hackathon evaluation.',
    summary: {
      duplicateTestsCount: duplicateTests.length,
      drugInteractionsCount: drugInteractions.length,
      allergyConflictsCount: allergyConflicts.length,
      totalEstimatedCostWastedINR: duplicateTests.reduce((acc, d) => acc + (d.estimatedWastedCostINR || 0), 0)
    },
    alerts: {
      duplicateTests,
      drugInteractions,
      allergyConflicts,
      reconciledMedications
    }
  });
});

/**
 * GET /api/safety/:patientId/duplicates
 */
router.get('/safety/:patientId/duplicates', (req, res) => {
  const patientId = req.params.patientId || 'P1001';
  const windowDays = parseInt(req.query.windowDays, 10) || 30;
  const duplicateTests = detectDuplicateLabTests(patientId, windowDays);
  res.json({
    success: true,
    patientId,
    windowDays,
    duplicateTests
  });
});

module.exports = router;
