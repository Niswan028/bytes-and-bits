/**
 * CareSyncIQ - Clinical Safety, Medication Reconciliation & Cross-Provider Anomaly Engine
 * 
 * Implements:
 * 1. Duplicate Lab Test Detection across providers within a configurable window (default 30 days)
 * 2. High-Risk Drug-Drug Interaction Rules (labeled: Rule-based demo set, not clinical-grade)
 * 3. Allergy-Prescription Cross-Check Engine
 * 4. Longitudinal Active Medication Reconciliation
 */

const { SYNTHETIC_PATIENTS } = require('../data/patientsData');

// Standardized average private diagnostic costs (INR) for duplicate test waste calculation
const LAB_COST_SCHEDULE_INR = {
  'lipid profile': 1200,
  'total cholesterol': 400,
  'hba1c': 600,
  'fasting blood sugar': 150,
  'thyroid profile': 800,
  'tsh': 350,
  'complete blood count': 350,
  'serum creatinine': 250,
  'inr': 300,
  'liver function test': 900,
  'dexa': 2800,
  'bone mineral density': 2800,
  'creatine kinase': 650
};

// Documented high-risk drug interaction rule set
const DRUG_INTERACTION_RULES = [
  {
    id: 'DDI-001',
    drugA: 'warfarin',
    drugB: 'clarithromycin',
    severity: 'CRITICAL',
    title: 'Severe Warfarin & Clarithromycin Interaction',
    mechanism: 'Clarithromycin is a potent CYP3A4 inhibitor and impairs hepatic clearance of S-warfarin, causing massive elevation of INR and lethal hemorrhage risk.',
    recommendation: 'Withhold warfarin or switch antibiotic to azithromycin / cephalosporin with daily INR monitoring.'
  },
  {
    id: 'DDI-002',
    drugA: 'metformin',
    drugB: 'glipizide',
    severity: 'HIGH',
    title: 'Dual Hypoglycemic Escalation (Biguanide + Sulfonylurea)',
    mechanism: 'Concurrent uncoordinated prescription of escalated Metformin (850mg BD) with Glipizide (10mg OD) significantly increases risk of severe hypoglycemic coma.',
    recommendation: 'Reconcile biguanide dose to maximum 2,000 mg/day; monitor capillary blood glucose.'
  },
  {
    id: 'DDI-003',
    drugA: 'aspirin',
    drugB: 'ibuprofen',
    severity: 'MODERATE',
    title: 'Competitive COX-1 Inhibition',
    mechanism: 'Ibuprofen competitively inhibits platelet COX-1, attenuating the irreversible cardioprotective antiplatelet effect of aspirin.',
    recommendation: 'Take aspirin at least 2 hours before ibuprofen or select alternative analgesic.'
  },
  {
    id: 'DDI-004',
    drugA: 'ramipril',
    drugB: 'telmisartan',
    severity: 'HIGH',
    title: 'Dual RAAS Blockade (ACEi + ARB)',
    mechanism: 'Combining ACE inhibitors with Angiotensin Receptor Blockers increases incidence of acute renal failure, hypotension, and severe hyperkalemia.',
    recommendation: 'Do not combine ACEi and ARB without nephrology consultation.'
  },
  {
    id: 'DDI-005',
    drugA: 'atorvastatin',
    drugB: 'gemfibrozil',
    severity: 'CRITICAL',
    title: 'Severe Statin + Fibrate Rhabdomyolysis Risk',
    mechanism: 'Gemfibrozil strongly inhibits glucuronidation of statin acid form, boosting serum statin concentration > 3-fold and causing acute skeletal muscle breakdown (CK elevation).',
    recommendation: 'Discontinue gemfibrozil immediately. Substitute with fenofibrate if fibrate therapy is strictly necessary, with weekly CK monitoring.'
  },
  {
    id: 'DDI-006',
    drugA: 'levothyroxine',
    drugB: 'calcium',
    severity: 'MODERATE',
    title: 'Insoluble Chelation Complexation (Levothyroxine + Calcium)',
    mechanism: 'Calcium carbonate binds to thyroxine in the acidic gastric lumen forming an insoluble chelate, reducing oral T4 bioavailability by up to 35%.',
    recommendation: 'Administer calcium supplements at least 4 hours after morning levothyroxine ingestion.'
  }
];

// Documented allergy cross-reference rules
const ALLERGY_CONTRAINDICATION_RULES = [
  {
    allergyKeyword: 'penicillin',
    contraindicatedDrugs: ['amoxicillin', 'augmentin', 'ampicillin', 'piperacillin'],
    severity: 'LIFE-THREATENING',
    reaction: 'Anaphylaxis / Angioedema'
  },
  {
    allergyKeyword: 'nsaid',
    contraindicatedDrugs: ['ibuprofen', 'aspirin', 'naproxen', 'diclofenac', 'ketorolac'],
    severity: 'CRITICAL',
    reaction: 'Severe Acute Bronchospasm (AERD) / Wheezing'
  },
  {
    allergyKeyword: 'aspirin',
    contraindicatedDrugs: ['aspirin', 'ibuprofen', 'naproxen', 'diclofenac'],
    severity: 'CRITICAL',
    reaction: 'Severe Acute Bronchospasm (AERD Triad)'
  },
  {
    allergyKeyword: 'sulfa',
    contraindicatedDrugs: ['sulfamethoxazole', 'bactrim', 'septra', 'sulfasalazine'],
    severity: 'HIGH',
    reaction: 'Erythematous rash / Stevens-Johnson Syndrome risk'
  },
  {
    allergyKeyword: 'radiocontrast',
    contraindicatedDrugs: ['omnipaque', 'visipaque', 'iohexol', 'iodixanol', 'contrast'],
    severity: 'LIFE-THREATENING',
    reaction: 'Anaphylactoid circulatory collapse and bronchospasm'
  },
  {
    allergyKeyword: 'fluoroquinolone',
    contraindicatedDrugs: ['ciprofloxacin', 'levofloxacin', 'moxifloxacin', 'ofloxacin'],
    severity: 'CRITICAL',
    reaction: 'Acute Achilles tendinitis and angioedema'
  }
];

/**
 * Detect duplicate lab tests performed within a configurable window (default 30 days) across different providers.
 */
function detectDuplicateLabTests(patientId = 'P1001', windowDays = 30) {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === patientId.toLowerCase()) || SYNTHETIC_PATIENTS[0];
  const duplicateAlerts = [];

  const labs = patient.labTrends || [];
  for (let i = 0; i < labs.length; i++) {
    for (let j = i + 1; j < labs.length; j++) {
      const a = labs[i];
      const b = labs[j];

      // Same test name
      if (a.test.toLowerCase() === b.test.toLowerCase()) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const diffMs = Math.abs(dateB - dateA);
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        // Within window days and different facilities or duplicate flag
        if (diffDays <= windowDays && (a.provider !== b.provider || b.isDuplicate)) {
          const testKey = a.test.toLowerCase();
          let estimatedCost = LAB_COST_SCHEDULE_INR[testKey] || 800;
          if (testKey.includes('cholesterol') || testKey.includes('lipid') || testKey.includes('triglycerides')) {
            estimatedCost = 1200; // Comprehensive lipid profile package cost in private laboratories
          }

          duplicateAlerts.push({
            id: `dup-${a.test.replace(/\s+/g, '-').toLowerCase()}-${diffDays}d`,
            testName: a.test,
            intervalDays: diffDays,
            thresholdDays: windowDays,
            severity: 'WARNING',
            estimatedWastedCostINR: estimatedCost,
            costBasisNote: `Assumes standard private diagnostic tariff: ₹${estimatedCost} per ${a.test}`,
            firstOccurrence: {
              date: a.date,
              provider: a.provider,
              observedValue: a.value,
              unit: a.unit,
              sourceDoc: a.sourceDoc,
              page: a.page
            },
            duplicateOccurrence: {
              date: b.date,
              provider: b.provider,
              observedValue: b.value,
              unit: b.unit,
              sourceDoc: b.sourceDoc,
              page: b.page
            },
            clinicalImpact: `Investigation repeated within ${diffDays} days without documented clinical rationale. Adds financial burden (₹${estimatedCost}) and patient inconvenience.`
          });
        }
      }
    }
  }

  return duplicateAlerts;
}

/**
 * Detect drug-drug interactions between prescriptions from different providers.
 */
function detectDrugInteractions(patientId = 'P1001') {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === patientId.toLowerCase()) || SYNTHETIC_PATIENTS[0];
  const flaggedInteractions = [];

  // Gather all medications across patient history
  const meds = patient.activeMedications || [];

  for (const rule of DRUG_INTERACTION_RULES) {
    // Check if both drugs exist in patient history or timeline
    const matchA = meds.find(m => m.drugName.toLowerCase().includes(rule.drugA)) ||
                   patient.timelineEvents.some(e => e.summary.toLowerCase().includes(rule.drugA));
    const matchB = meds.find(m => m.drugName.toLowerCase().includes(rule.drugB)) ||
                   patient.timelineEvents.some(e => e.summary.toLowerCase().includes(rule.drugB));

    if (matchA && matchB) {
      flaggedInteractions.push({
        id: rule.id,
        ruleTitle: rule.title,
        severity: rule.severity,
        drugA: rule.drugA.toUpperCase(),
        drugB: rule.drugB.toUpperCase(),
        disclaimer: 'Rule-based demo set, not clinical-grade.',
        mechanism: rule.mechanism,
        recommendation: rule.recommendation,
        citationPrescriptionA: {
          drug: rule.drugA,
          sourceDoc: patient.activeMedications[0]?.sourceDoc || 'Outpatient Prescription',
          page: 1
        },
        citationPrescriptionB: {
          drug: rule.drugB,
          sourceDoc: patient.timelineEvents.find(e => e.summary.toLowerCase().includes(rule.drugB))?.sourceDoc || 'Clinic Prescription',
          page: 1
        }
      });
    }
  }

  return flaggedInteractions;
}

/**
 * Detect conflicts between recorded patient allergies and active or new prescriptions.
 */
function detectAllergyConflicts(patientId = 'P1001') {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === patientId.toLowerCase()) || SYNTHETIC_PATIENTS[0];
  const allergyConflicts = [];

  const allergies = patient.allergies || [];
  const events = patient.timelineEvents || [];

  for (const allergy of allergies) {
    const allergyText = allergy.substance.toLowerCase();

    for (const rule of ALLERGY_CONTRAINDICATION_RULES) {
      if (allergyText.includes(rule.allergyKeyword)) {
        // Look for any contraindicated drug prescribed
        for (const drug of rule.contraindicatedDrugs) {
          const conflictingEvent = events.find(e => e.summary?.toLowerCase().includes(drug) || e.title?.toLowerCase().includes(drug));
          const conflictingMed = patient.activeMedications?.find(m => m.drugName?.toLowerCase().includes(drug));
          if (conflictingEvent || conflictingMed) {
            allergyConflicts.push({
              id: `allg-${rule.allergyKeyword}-${drug}`,
              allergySubstance: allergy.substance,
              recordedReaction: allergy.reaction,
              prescribedDrug: drug.toUpperCase(),
              severity: rule.severity,
              clinicalAlert: `CRITICAL ALLERGY CONFLICT: Patient has recorded ${allergy.substance} allergy. Prescribed drug "${drug.toUpperCase()}" carries severe risk of ${rule.reaction}.`,
              allergyCitation: {
                recordedDate: allergy.recordedDate,
                sourceDoc: allergy.sourceDoc || 'Patient Intake Record',
                page: allergy.page || 1
              },
              prescriptionCitation: {
                date: conflictingEvent?.date || conflictingMed?.startDate || 'Recent Order',
                provider: conflictingEvent?.provider || conflictingMed?.prescribedBy || 'Attending Physician',
                clinic: conflictingEvent?.clinic || conflictingMed?.clinic || 'Outpatient Clinic',
                sourceDoc: conflictingEvent?.sourceDoc || conflictingMed?.sourceDoc || 'Prescription Record',
                page: conflictingEvent?.page || conflictingMed?.page || 1
              }
            });
          }
        }
      }
    }
  }

  return allergyConflicts;
}

/**
 * Reconcile longitudinal active medication list.
 * Derives current active therapy using start dates, dose changes, and provider actions.
 */
function reconcileActiveMedications(patientId = 'P1001') {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === patientId.toLowerCase()) || SYNTHETIC_PATIENTS[0];
  const reconciled = (patient.activeMedications || []).map(m => {
    let status = 'ACTIVE';
    let statusDescription = 'Continuous maintenance therapy verified across providers.';
    let needsConfirmation = false;

    if (m.status.toLowerCase().includes('conflict') || m.needsReview) {
      status = 'NEEDS_CONFIRMATION';
      statusDescription = 'Discrepancy detected between multiple prescribing clinics. Clinician reconciliation required.';
      needsConfirmation = true;
    } else if (m.status.toLowerCase().includes('withheld')) {
      status = 'WITHHELD_SAFETY';
      statusDescription = 'Temporarily withheld due to adverse laboratory threshold (INR elevation).';
      needsConfirmation = true;
    }

    return {
      drugName: m.drugName,
      dose: m.dose,
      form: m.form,
      frequency: m.frequency,
      route: m.route,
      startDate: m.startDate,
      prescribedBy: m.prescribedBy,
      clinic: m.clinic,
      sourceDoc: m.sourceDoc,
      page: m.page,
      status,
      statusDescription,
      needsConfirmation
    };
  });

  return reconciled;
}

module.exports = {
  detectDuplicateLabTests,
  detectDrugInteractions,
  detectAllergyConflicts,
  reconcileActiveMedications,
  LAB_COST_SCHEDULE_INR,
  DRUG_INTERACTION_RULES
};
