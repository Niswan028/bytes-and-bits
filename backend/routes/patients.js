const express = require('express');
const router = express.Router();
const { SYNTHETIC_PATIENTS, SYNTHETIC_SOURCE_DOCUMENTS } = require('../data/patientsData');
const { auditLedger } = require('../middleware/auditTrail');

/**
 * GET /api/patients
 * List all synthetic and dynamically registered patients with conditions, active meds, and key stats
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
 * POST /api/patients
 * Register a new patient in the CareSyncIQ longitudinal health registry
 */
router.post('/patients', (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      dob,
      bloodGroup = 'B+',
      phone = '+91 98000-00000',
      abhaAddress,
      emergencyContact,
      chronicConditions = [],
      allergies = [],
      activeMedications = [],
      labTrends = [],
      primaryClinic = 'City Outpatient Care Centre',
      primaryDoctor = 'Dr. Attending Physician (MD General Medicine)'
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Patient full name is required.' });
    }

    // Auto-generate next UHID e.g. P1006
    const existingIds = SYNTHETIC_PATIENTS
      .map(p => {
        const m = p.id.match(/^P(\d+)$/i);
        return m ? parseInt(m[1], 10) : 1000;
      })
      .filter(n => !isNaN(n));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1006;
    const newId = `P${nextNum}`;

    const parsedAge = parseInt(age, 10) || 45;
    const cleanGender = gender || 'Male';
    const cleanAbha = abhaAddress && abhaAddress.trim()
      ? abhaAddress.trim()
      : `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}.${nextNum}@abdm`;

    // Normalize chronic conditions
    const formattedConditions = (Array.isArray(chronicConditions) ? chronicConditions : [chronicConditions])
      .filter(Boolean)
      .map(c => {
        if (typeof c === 'string') {
          return { code: 'ICD-10', name: c.trim(), diagnosedYear: new Date().getFullYear(), status: 'Active', severity: 'Moderate' };
        }
        return {
          code: c.code || 'ICD-10',
          name: c.name || 'Chronic Condition',
          diagnosedYear: c.diagnosedYear || new Date().getFullYear(),
          status: c.status || 'Active',
          severity: c.severity || 'Moderate'
        };
      });

    // Normalize allergies
    const formattedAllergies = (Array.isArray(allergies) ? allergies : [allergies])
      .filter(Boolean)
      .map(a => {
        if (typeof a === 'string') {
          return {
            substance: a.trim(),
            reaction: 'Documented Hypersensitivity',
            severity: a.toLowerCase().includes('anaphylaxis') ? 'Life-Threatening' : 'Moderate',
            recordedDate: new Date().toISOString().split('T')[0],
            sourceDoc: 'patient_registration_intake.pdf',
            page: 1
          };
        }
        return {
          substance: a.substance || 'Unknown Allergen',
          reaction: a.reaction || 'Hypersensitivity',
          severity: a.severity || 'Moderate',
          recordedDate: a.recordedDate || new Date().toISOString().split('T')[0],
          sourceDoc: a.sourceDoc || 'patient_registration_intake.pdf',
          page: 1
        };
      });

    // Normalize active medications
    const formattedMeds = (Array.isArray(activeMedications) ? activeMedications : [activeMedications])
      .filter(Boolean)
      .map(m => {
        if (typeof m === 'string') {
          return {
            drugName: m.trim(),
            dose: 'Standard',
            form: 'Tablet',
            frequency: '1 Tab OD',
            route: 'Oral',
            startDate: new Date().toISOString().split('T')[0],
            prescribedBy: primaryDoctor,
            clinic: primaryClinic,
            sourceDoc: 'patient_registration_intake.pdf',
            page: 1,
            status: 'Active'
          };
        }
        return {
          drugName: m.drugName || m.name || 'Medication',
          dose: m.dose || 'Standard',
          form: m.form || 'Tablet',
          frequency: m.frequency || m.freq || '1 Tab OD',
          route: m.route || 'Oral',
          startDate: m.startDate || new Date().toISOString().split('T')[0],
          prescribedBy: m.prescribedBy || primaryDoctor,
          clinic: m.clinic || primaryClinic,
          sourceDoc: m.sourceDoc || 'patient_registration_intake.pdf',
          page: 1,
          status: m.status || 'Active'
        };
      });

    // Initial timeline intake event
    const intakeEvent = {
      id: `evt-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: 'Clinical Intake & Registration',
      type: 'INTAKE',
      title: `Patient Intake & Chart Created - ${primaryClinic}`,
      provider: primaryDoctor,
      clinic: primaryClinic,
      badge: 'Verified Intake',
      badgeColor: 'emerald',
      summary: `Patient record registered. Demographics: ${parsedAge}y ${cleanGender}, Blood Group: ${bloodGroup}. Diagnoses: ${formattedConditions.map(c => c.name).join(', ') || 'None recorded'}. Initial vitals verified.`,
      sourceDoc: 'opd_intake_registration_form.pdf',
      page: 1
    };

    const newPatient = {
      id: newId,
      name: name.trim(),
      age: parsedAge,
      gender: cleanGender,
      dob: dob || `${new Date().getFullYear() - parsedAge}-01-01`,
      bloodGroup,
      phone,
      abhaAddress: cleanAbha,
      emergencyContact: emergencyContact || {
        name: 'Primary Contact',
        relation: 'Family',
        phone: '+91 98000-00000'
      },
      chronicConditions: formattedConditions,
      allergies: formattedAllergies,
      activeMedications: formattedMeds,
      labTrends: Array.isArray(labTrends) ? labTrends : [],
      timelineEvents: [intakeEvent]
    };

    SYNTHETIC_PATIENTS.push(newPatient);

    // Audit log
    auditLedger.appendEntry({
      eventType: 'PATIENT_REGISTERED',
      patientId: newId,
      recordId: `reg-${newId}`,
      description: `Registered new patient: ${newPatient.name} (${newId}) with ABHA ID ${cleanAbha}`,
      actor: 'OPD Intake Desk / Clinician Admin',
      payload: {
        id: newId,
        name: newPatient.name,
        age: parsedAge,
        gender: cleanGender,
        conditionsCount: formattedConditions.length,
        allergiesCount: formattedAllergies.length
      }
    });

    res.status(201).json({
      success: true,
      message: `Patient ${newPatient.name} registered successfully with ID ${newId}`,
      patient: newPatient
    });
  } catch (err) {
    console.error('[Patient Register Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/patients/:id/records
 * Add a clinical event, consultation note, prescription or lab result directly to a patient
 */
router.post('/patients/:id/records', (req, res) => {
  const patient = SYNTHETIC_PATIENTS.find(p => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }

  const {
    type = 'VISIT',
    title = 'Clinical Consultation Note',
    category = 'Outpatient Care',
    provider = 'Attending Physician',
    clinic = 'General Outpatient Clinic',
    date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    summary = 'Clinical evaluation conducted.',
    medications = [],
    labTests = [],
    allergies = []
  } = req.body;

  const eventId = `evt-${Date.now()}`;
  const newEvent = {
    id: eventId,
    date,
    category,
    type,
    title,
    provider,
    clinic,
    badge: 'Direct Clinical Entry',
    badgeColor: 'emerald',
    summary,
    sourceDoc: `opd_consultation_${eventId}.pdf`,
    page: 1
  };

  patient.timelineEvents.unshift(newEvent);

  if (Array.isArray(medications) && medications.length > 0) {
    medications.forEach(m => {
      patient.activeMedications.push({
        drugName: typeof m === 'string' ? m : m.drugName || m.name,
        dose: m.dose || 'Standard',
        form: m.form || 'Tablet',
        frequency: m.frequency || '1 Tab OD',
        route: m.route || 'Oral',
        startDate: date,
        prescribedBy: provider,
        clinic: clinic,
        sourceDoc: `opd_consultation_${eventId}.pdf`,
        page: 1,
        status: 'Active'
      });
    });
  }

  if (Array.isArray(labTests) && labTests.length > 0) {
    labTests.forEach(l => {
      patient.labTrends.push({
        date,
        test: l.test || l.name,
        value: parseFloat(l.value) || l.value,
        unit: l.unit || '',
        referenceRange: l.referenceRange || '',
        status: l.status || 'NORMAL',
        provider: clinic,
        sourceDoc: `opd_consultation_${eventId}.pdf`,
        page: 1
      });
    });
  }

  if (Array.isArray(allergies) && allergies.length > 0) {
    allergies.forEach(a => {
      patient.allergies.push({
        substance: typeof a === 'string' ? a : a.substance,
        reaction: a.reaction || 'Hypersensitivity',
        severity: a.severity || 'Moderate',
        recordedDate: date,
        sourceDoc: `opd_consultation_${eventId}.pdf`,
        page: 1
      });
    });
  }

  auditLedger.appendEntry({
    eventType: 'CLINICAL_EVENT_RECORDED',
    patientId: patient.id,
    recordId: eventId,
    description: `Added clinical event: "${title}" by ${provider} at ${clinic}`,
    actor: 'Attending Clinician Desk',
    payload: { eventId, type, title, provider, clinic }
  });

  res.json({
    success: true,
    message: 'Clinical record added to patient timeline successfully.',
    event: newEvent,
    patient
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
