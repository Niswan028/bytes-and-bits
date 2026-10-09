const { detectDuplicateLabTests, detectDrugInteractions, detectAllergyConflicts } = require('./reconciliationEngine');
const { SYNTHETIC_PATIENTS } = require('../data/patientsData');

/**
 * CareSyncIQ Clinical Safety Risk Scanner
 * Scans patient profiles for duplicate tests, drug interactions, and allergy conflicts.
 */
async function detectRisks() {
  let totalRisksDetected = 0;

  for (const patient of SYNTHETIC_PATIENTS) {
    const duplicates = detectDuplicateLabTests(patient.id, 30);
    const interactions = detectDrugInteractions(patient.id);
    const allergies = detectAllergyConflicts(patient.id);

    const patientTotal = duplicates.length + interactions.length + allergies.length;
    totalRisksDetected += patientTotal;

    if (patientTotal > 0) {
      console.log(`[Safety Scanner] Patient ${patient.id} (${patient.name}): ${patientTotal} clinical safety alerts identified.`);
    }
  }

  return totalRisksDetected;
}

module.exports = {
  detectRisks
};
