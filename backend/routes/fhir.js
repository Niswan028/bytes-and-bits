const express = require('express');
const router = express.Router();
const { generateFhirR4Bundle, validateFhirBundleSchema } = require('../middleware/fhirExporter');

/**
 * GET /api/fhir/:patientId
 * Return generated FHIR R4 Bundle with structural schema validation report
 */
router.get('/fhir/:patientId', (req, res) => {
  const patientId = req.params.patientId || 'P1001';
  const bundle = generateFhirR4Bundle(patientId);
  const validation = validateFhirBundleSchema(bundle);

  res.json({
    success: true,
    patientId,
    standard: 'HL7 FHIR Release 4 (R4)',
    schemaValidation: validation,
    bundle
  });
});

/**
 * GET /api/fhir/:patientId/download
 * Download raw FHIR R4 JSON bundle file
 */
router.get('/fhir/:patientId/download', (req, res) => {
  const patientId = req.params.patientId || 'P1001';
  const bundle = generateFhirR4Bundle(patientId);

  res.setHeader('Content-Type', 'application/fhir+json');
  res.setHeader('Content-Disposition', `attachment; filename="caresynciq_fhir_r4_${patientId.toLowerCase()}.json"`);
  res.send(JSON.stringify(bundle, null, 2));
});

module.exports = router;
