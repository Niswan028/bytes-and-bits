/**
 * CareSyncIQ - HL7 FHIR R4 Bundle Exporter & Schema Validator
 * Exports structured patient records into a valid FHIR R4 Bundle
 * containing Patient, Condition, MedicationStatement, Observation, and AllergyIntolerance resources.
 */

const { SYNTHETIC_PATIENTS } = require('../data/patientsData');

/**
 * Generate a complete, compliant FHIR R4 Bundle for a patient.
 */
function generateFhirR4Bundle(patientId = 'P1001') {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === patientId.toLowerCase()) || SYNTHETIC_PATIENTS[0];

  const nameParts = (patient.name || 'Unknown Patient').split(' ');
  const firstName = nameParts[0] || 'Unknown';
  const lastName = nameParts.slice(1).join(' ') || 'Patient';

  const entries = [];

  // 1. Patient Resource
  const patientResource = {
    fullUrl: `urn:uuid:patient-${patient.id.toLowerCase()}`,
    resource: {
      resourceType: 'Patient',
      id: patient.id.toLowerCase(),
      identifier: [
        {
          system: 'urn:oid:caresynciq:mrn',
          value: patient.id
        }
      ],
      active: true,
      name: [
        {
          use: 'official',
          family: lastName,
          given: [firstName]
        }
      ],
      gender: patient.gender.toLowerCase() === 'female' ? 'female' : 'male',
      birthDate: patient.dob || '1970-01-01',
      telecom: [
        {
          system: 'phone',
          value: patient.phone,
          use: 'mobile'
        }
      ]
    }
  };
  entries.push(patientResource);

  // 2. Condition Resources
  (patient.chronicConditions || []).forEach((cond, idx) => {
    entries.push({
      fullUrl: `urn:uuid:condition-${patient.id.toLowerCase()}-${idx + 1}`,
      resource: {
        resourceType: 'Condition',
        id: `cond-${patient.id.toLowerCase()}-${idx + 1}`,
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
              display: 'Active'
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'confirmed',
              display: 'Confirmed'
            }
          ]
        },
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/icd-10',
              code: cond.code || 'R69',
              display: cond.name
            }
          ],
          text: cond.name
        },
        subject: {
          reference: `Patient/${patient.id.toLowerCase()}`,
          display: patient.name
        },
        recordedDate: `${cond.diagnosedYear || 2022}-01-01`
      }
    });
  });

  // 3. AllergyIntolerance Resources
  (patient.allergies || []).forEach((allg, idx) => {
    entries.push({
      fullUrl: `urn:uuid:allergy-${patient.id.toLowerCase()}-${idx + 1}`,
      resource: {
        resourceType: 'AllergyIntolerance',
        id: `allg-${patient.id.toLowerCase()}-${idx + 1}`,
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
              display: 'Active'
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
              display: 'Confirmed'
            }
          ]
        },
        type: 'allergy',
        category: ['medication'],
        criticality: allg.severity.toLowerCase().includes('life') ? 'high' : 'medium',
        code: {
          text: allg.substance
        },
        patient: {
          reference: `Patient/${patient.id.toLowerCase()}`,
          display: patient.name
        },
        reaction: [
          {
            manifestation: [
              {
                text: allg.reaction
              }
            ],
            severity: allg.severity.toLowerCase().includes('life') ? 'severe' : 'moderate'
          }
        ],
        recordedDate: allg.recordedDate || '2022-03-10'
      }
    });
  });

  // 4. MedicationStatement Resources
  (patient.activeMedications || []).forEach((med, idx) => {
    entries.push({
      fullUrl: `urn:uuid:medication-${patient.id.toLowerCase()}-${idx + 1}`,
      resource: {
        resourceType: 'MedicationStatement',
        id: `med-${patient.id.toLowerCase()}-${idx + 1}`,
        status: med.status.toLowerCase().includes('active') ? 'active' : 'intended',
        medicationCodeableConcept: {
          text: `${med.drugName} ${med.dose} (${med.form})`
        },
        subject: {
          reference: `Patient/${patient.id.toLowerCase()}`,
          display: patient.name
        },
        effectiveDateTime: med.startDate || '2026-01-10',
        dosage: [
          {
            text: med.frequency,
            route: { text: med.route }
          }
        ],
        note: [
          {
            text: `Prescribed by: ${med.prescribedBy} at ${med.clinic}. Source document: ${med.sourceDoc}`
          }
        ]
      }
    });
  });

  // 5. Observation Resources (Laboratory Tests)
  (patient.labTrends || []).forEach((lab, idx) => {
    entries.push({
      fullUrl: `urn:uuid:observation-${patient.id.toLowerCase()}-${idx + 1}`,
      resource: {
        resourceType: 'Observation',
        id: `obs-${patient.id.toLowerCase()}-${idx + 1}`,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'laboratory',
                display: 'Laboratory'
              }
            ]
          }
        ],
        code: {
          text: lab.test
        },
        subject: {
          reference: `Patient/${patient.id.toLowerCase()}`,
          display: patient.name
        },
        effectiveDateTime: lab.date,
        valueQuantity: {
          value: lab.value,
          unit: lab.unit,
          system: 'http://unitsofmeasure.org'
        },
        referenceRange: [
          {
            low: { value: lab.refMin, unit: lab.unit },
            high: { value: lab.refMax, unit: lab.unit }
          }
        ]
      }
    });
  });

  const bundle = {
    resourceType: 'Bundle',
    id: `caresynciq-bundle-${patient.id.toLowerCase()}`,
    meta: {
      lastUpdated: new Date().toISOString(),
      profile: ['http://hl7.org/fhir/StructureDefinition/Bundle']
    },
    type: 'collection',
    timestamp: new Date().toISOString(),
    total: entries.length,
    entry: entries
  };

  return bundle;
}

/**
 * Validate generated FHIR R4 Bundle against official FHIR structural constraints.
 */
function validateFhirBundleSchema(bundle) {
  const errors = [];
  const warnings = [];

  if (!bundle || bundle.resourceType !== 'Bundle') {
    errors.push('Top-level resource must have resourceType: "Bundle"');
    return { isValid: false, errors, warnings };
  }

  if (bundle.type !== 'collection') {
    errors.push('Bundle.type must be "collection" for health record dossiers');
  }

  if (!Array.isArray(bundle.entry) || bundle.entry.length === 0) {
    errors.push('Bundle must contain at least one valid entry resource');
  } else {
    bundle.entry.forEach((item, index) => {
      const res = item.resource;
      if (!res || !res.resourceType) {
        errors.push(`Entry #${index} lacks a valid FHIR resource definition.`);
        return;
      }

      if (!res.id) {
        errors.push(`Entry #${index} (${res.resourceType}) is missing mandatory logical "id".`);
      }

      // Check specific resource types
      if (res.resourceType === 'Patient') {
        if (!res.name || !res.name[0] || !res.name[0].family) {
          warnings.push(`Patient resource is missing family name.`);
        }
      } else if (res.resourceType === 'Condition') {
        if (!res.clinicalStatus || !res.subject) {
          errors.push(`Condition #${res.id} missing clinicalStatus or subject reference.`);
        }
      } else if (res.resourceType === 'MedicationStatement') {
        if (!res.status || !res.subject) {
          errors.push(`MedicationStatement #${res.id} missing status or subject.`);
        }
      } else if (res.resourceType === 'Observation') {
        if (!res.status || !res.code || !res.subject) {
          errors.push(`Observation #${res.id} missing status, code, or subject reference.`);
        }
      } else if (res.resourceType === 'AllergyIntolerance') {
        if (!res.clinicalStatus || !res.patient) {
          errors.push(`AllergyIntolerance #${res.id} missing clinicalStatus or patient reference.`);
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalEntriesValidated: bundle.entry ? bundle.entry.length : 0,
      resourceTypesIncluded: [...new Set((bundle.entry || []).map(e => e.resource?.resourceType))]
    }
  };
}

module.exports = {
  generateFhirR4Bundle,
  validateFhirBundleSchema
};
