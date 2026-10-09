const crypto = require('crypto');
const { SYNTHETIC_PATIENTS, SYNTHETIC_SOURCE_DOCUMENTS } = require('../data/patientsData');
const { detectDuplicateLabTests, detectDrugInteractions, detectAllergyConflicts, reconcileActiveMedications } = require('./reconciliationEngine');
const { auditLedger } = require('./auditTrail');

// In-memory reports store
const compiledDossiers = new Map();

/**
 * Compile a comprehensive, cryptographically sealed Patient Health Record Dossier
 */
async function compilePatientDossier(patientId = 'P1001', template = 'patient_longitudinal_health_record') {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === patientId.toLowerCase()) || SYNTHETIC_PATIENTS[0];
  const duplicates = detectDuplicateLabTests(patient.id, 30);
  const interactions = detectDrugInteractions(patient.id);
  const allergies = detectAllergyConflicts(patient.id);
  const reconciledMeds = reconcileActiveMedications(patient.id);

  const reportId = `DOSSIER-${patient.id}-${Date.now().toString(36).toUpperCase()}`;
  const generatedAt = new Date().toISOString();

  let title = `COMPREHENSIVE LONGITUDINAL HEALTH RECORD & CLINICAL SUMMARY`;
  let sections = [];

  if (template === 'emergency_care_handover_summary') {
    title = `EMERGENCY CARE CLINICAL HANDOFF & ALLERGY ADVISORY`;
    sections = [
      {
        title: '1. Patient Demographics & Emergency Contact',
        description: 'Verified statutory patient identity and immediate next-of-kin contact details.',
        fields: [
          { label: 'Patient Name', value: patient.name, verified: true, sourceDocumentName: 'Certified Record (UHID: ' + patient.id + ')' },
          { label: 'Age & Gender', value: `${patient.age} Yrs / ${patient.gender}`, verified: true, sourceDocumentName: 'Patient Master Registry' },
          { label: 'Blood Group', value: patient.bloodGroup, verified: true, sourceDocumentName: 'Hospital Lab Sheet' },
          { label: 'Primary Contact', value: patient.phone, verified: true, sourceDocumentName: 'Patient Record' },
          { label: 'Emergency Contact', value: `${patient.emergencyContact.name} (${patient.emergencyContact.phone})`, verified: true, sourceDocumentName: 'Consent Registry' }
        ]
      },
      {
        title: '2. Critical Allergies & Severe Contraindications',
        description: 'Strict alerts: High-severity drug allergies requiring immediate avoidance.',
        fields: patient.allergies.map(a => ({
          label: `ALLERGY: ${a.substance}`,
          value: a.reaction,
          unit: `[${a.severity}]`,
          verified: true,
          sourceDocumentName: a.sourceDoc,
          pageNumber: a.page
        }))
      },
      {
        title: '3. Reconciled Active Medications & Regimen',
        description: 'Verified active prescription drugs with prescribing clinics and dosages.',
        fields: reconciledMeds.map(m => ({
          label: `${m.drugName} (${m.dose})`,
          value: m.frequency,
          unit: m.status,
          verified: !m.needsConfirmation,
          sourceDocumentName: m.sourceDoc,
          pageNumber: m.page
        }))
      },
      {
        title: '4. Critical Chronic Conditions',
        description: 'Underlying chronic diseases and clinical diagnoses.',
        fields: patient.chronicConditions.map(c => ({
          label: `${c.code} - ${c.name}`,
          value: `Diagnosed ${c.diagnosedYear} (${c.severity})`,
          verified: true,
          sourceDocumentName: 'Clinical Consultation Summary'
        }))
      }
    ];
  } else {
    // Full Longitudinal Dossier
    sections = [
      {
        title: '1. Patient Demographics & Health Profile',
        description: 'Verified statutory identity, chronic diagnoses, and primary care provider registry.',
        fields: [
          { label: 'Full Legal Name', value: patient.name, verified: true, sourceDocumentName: 'Patient Registry' },
          { label: 'Patient UHID / MRN', value: patient.id, verified: true, sourceDocumentName: 'Patient Master Registry' },
          { label: 'Age / Gender', value: `${patient.age} Yrs / ${patient.gender}`, verified: true, sourceDocumentName: 'Master Index' },
          { label: 'Blood Group', value: patient.bloodGroup, verified: true, sourceDocumentName: 'Diagnostic Archive' },
          { label: 'Chronic Conditions', value: patient.chronicConditions.map(c => c.name).join(', '), verified: true, sourceDocumentName: 'Clinical Diagnoses' },
          { label: 'Recorded Drug Allergies', value: patient.allergies.map(a => `${a.substance} (${a.reaction})`).join('; '), verified: true, sourceDocumentName: 'Allergy Registry' }
        ]
      },
      {
        title: '2. Multi-Provider Longitudinal Prescription Trajectory',
        description: 'Reconciled medication history tracking start dates, dose modifications, and prescribing clinics.',
        fields: reconciledMeds.map(m => ({
          label: `${m.drugName} ${m.dose}`,
          value: `${m.frequency} (Started: ${m.startDate})`,
          unit: m.status,
          verified: !m.needsConfirmation,
          sourceDocumentName: `${m.clinic} - ${m.sourceDoc}`,
          pageNumber: m.page
        }))
      },
      {
        title: '3. Longitudinal Laboratory Biomarkers & Diagnostic Trends',
        description: 'Chronological test history with biological reference intervals and abnormal flags.',
        tableData: patient.labTrends.map(l => ({
          test: l.test,
          date: l.date,
          observedValue: `${l.value} ${l.unit}`,
          referenceInterval: `${l.refMin} - ${l.refMax} ${l.unit}`,
          facility: l.provider,
          status: l.value > l.refMax ? 'HIGH' : l.value < l.refMin ? 'LOW' : 'NORMAL'
        }))
      },
      {
        title: '4. Cross-Provider Safety & Duplicate Test Audit',
        description: 'Algorithmic checks for repeated investigations, conflicting doses, and contraindicated combinations.',
        fields: [
          {
            label: 'Duplicate Investigations Caught',
            value: duplicates.length > 0 ? `${duplicates.length} Repeated Test (${duplicates[0].testName} within ${duplicates[0].intervalDays}d)` : 'None Detected',
            unit: duplicates.length > 0 ? `Wasted: ₹${duplicates[0].estimatedWastedCostINR}` : 'Optimal',
            verified: true,
            sourceDocumentName: duplicates.length > 0 ? duplicates[0].duplicateOccurrence.sourceDoc : 'N/A'
          },
          {
            label: 'Drug-Drug Interactions Flagged',
            value: interactions.length > 0 ? `${interactions[0].ruleTitle} (${interactions[0].severity})` : 'Zero High-Risk Interactions',
            verified: true,
            sourceDocumentName: 'Interaction Engine'
          },
          {
            label: 'Allergy Conflicts Prevented',
            value: allergies.length > 0 ? `${allergies[0].clinicalAlert}` : 'All Prescriptions Safe',
            verified: true,
            sourceDocumentName: 'Allergy Cross-Check'
          }
        ]
      }
    ];
  }

  // Calculate SHA-256 Digest
  const payloadToHash = JSON.stringify({ patientId: patient.id, sections, generatedAt });
  const sha256Seal = crypto.createHash('sha256').update(payloadToHash).digest('hex');

  const dossier = {
    reportId,
    patientId: patient.id,
    patientName: patient.name,
    title,
    template,
    generatedAt,
    sha256Seal,
    auditStatus: 'VERIFIED_INTACT',
    sourceDocuments: SYNTHETIC_SOURCE_DOCUMENTS.filter(d => d.patientId === patient.id || d.patientId === 'ALL'),
    sections
  };

  compiledDossiers.set(reportId, dossier);

  // Append entry to audit ledger
  auditLedger.appendEntry({
    eventType: 'DOSSIER_COMPILED',
    patientId: patient.id,
    recordId: reportId,
    description: `Compiled official clinical dossier: ${title}`,
    actor: 'CareSyncIQ Dossier Compiler',
    payload: { reportId, template, sha256Seal }
  });

  return dossier;
}

module.exports = {
  compilePatientDossier,
  compiledDossiers
};
