import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const INITIAL_BASE_PATIENTS = [
  {
    id: 'P1001',
    name: 'Rajesh Sharma',
    age: 58,
    gender: 'Male',
    dob: '1968-04-15',
    bloodGroup: 'B+',
    abhaAddress: 'rajesh.sharma@abdm',
    chronicConditions: [
      { code: 'E11.9', name: 'Type 2 Diabetes Mellitus', status: 'Active' },
      { code: 'I10', name: 'Essential Hypertension', status: 'Active' }
    ],
    allergiesCount: 1,
    activeMedicationsCount: 3,
    timelineEventsCount: 6,
    hasSafetyAlerts: true
  },
  {
    id: 'P1002',
    name: 'Priya Venkat',
    age: 34,
    gender: 'Female',
    dob: '1992-09-22',
    bloodGroup: 'O+',
    abhaAddress: 'priya.venkat@abdm',
    chronicConditions: [
      { code: 'J45.9', name: 'Severe Persistent Bronchial Asthma', status: 'Active' },
      { code: 'E03.9', name: 'Primary Hypothyroidism', status: 'Active' }
    ],
    allergiesCount: 1,
    activeMedicationsCount: 3,
    timelineEventsCount: 5,
    hasSafetyAlerts: true
  },
  {
    id: 'P1003',
    name: 'Anita Desai',
    age: 62,
    gender: 'Female',
    dob: '1964-11-05',
    bloodGroup: 'A+',
    abhaAddress: 'anita.desai@abdm',
    chronicConditions: [
      { code: 'I48.9', name: 'Non-valvular Atrial Fibrillation', status: 'Active' },
      { code: 'I82.9', name: 'Deep Vein Thrombosis', status: 'Active' }
    ],
    allergiesCount: 1,
    activeMedicationsCount: 2,
    timelineEventsCount: 4,
    hasSafetyAlerts: true
  },
  {
    id: 'P1004',
    name: 'Vikram Malhotra',
    age: 46,
    gender: 'Male',
    dob: '1980-02-18',
    bloodGroup: 'AB+',
    abhaAddress: 'vikram.malhotra@abdm',
    chronicConditions: [
      { code: 'Z95.1', name: 'Post-CABG (Triple Bypass)', status: 'Active' },
      { code: 'N18.3', name: 'CKD Stage 3a', status: 'Active' }
    ],
    allergiesCount: 1,
    activeMedicationsCount: 3,
    timelineEventsCount: 5,
    hasSafetyAlerts: true
  },
  {
    id: 'P1005',
    name: 'Sunita Rao',
    age: 52,
    gender: 'Female',
    dob: '1974-07-30',
    bloodGroup: 'B-',
    abhaAddress: 'sunita.rao@abdm',
    chronicConditions: [
      { code: 'E06.3', name: 'Hashimoto Autoimmune Thyroiditis', status: 'Active' },
      { code: 'M85.8', name: 'Osteopenia / Fracture Risk', status: 'Active' }
    ],
    allergiesCount: 1,
    activeMedicationsCount: 2,
    timelineEventsCount: 4,
    hasSafetyAlerts: true
  }
];

const PatientContext = createContext();

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('caresynciq_cached_patients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          const unique = [];
          const seenIds = new Set();
          const seenNames = new Set();
          parsed.forEach(p => {
            const norm = p.name ? p.name.trim().toLowerCase() : '';
            if (!seenIds.has(p.id) && !seenNames.has(norm)) {
              seenIds.add(p.id);
              if (norm) seenNames.add(norm);
              unique.push(p);
            }
          });
          return unique;
        }
      }
    } catch {}
    return INITIAL_BASE_PATIENTS;
  });

  const [activePatientId, setActivePatientId] = useState(() => {
    try {
      return localStorage.getItem('caresynciq_active_patient_id') || 'P1001';
    } catch {
      return 'P1001';
    }
  });

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePatientDetails, setActivePatientDetails] = useState(null);

  // Sync active patient ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('caresynciq_active_patient_id', activePatientId);
    } catch {}
  }, [activePatientId]);

  // Fetch full patient list from backend on mount and sync
  const refreshPatients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/patients');
      if (res.data?.success && Array.isArray(res.data.patients)) {
        let customPatients = [];
        try {
          const stored = localStorage.getItem('caresynciq_custom_patients');
          if (stored) customPatients = JSON.parse(stored);
        } catch {}

        const uniqueList = [];
        const seenIds = new Set();
        const seenNames = new Set();

        [...res.data.patients, ...customPatients].forEach(p => {
          const normName = p.name ? p.name.trim().toLowerCase() : '';
          if (!seenIds.has(p.id) && !seenNames.has(normName)) {
            seenIds.add(p.id);
            if (normName) seenNames.add(normName);
            uniqueList.push(p);
          }
        });

        setPatients(uniqueList);
        try {
          localStorage.setItem('caresynciq_cached_patients', JSON.stringify(uniqueList));
        } catch {}
      }
    } catch (err) {
      console.warn('[PatientContext] Fallback to cached/local patients:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPatients();
  }, []);

  // Fetch full details for the currently active patient
  useEffect(() => {
    let isMounted = true;
    const fetchPatientDetails = async () => {
      try {
        const res = await api.get(`/patients/${activePatientId}`);
        if (isMounted && res.data?.success && res.data.patient) {
          setActivePatientDetails(res.data.patient);
        }
      } catch (err) {
        // Find in local array if backend call fails
        const local = patients.find(p => p.id === activePatientId);
        if (isMounted && local) {
          setActivePatientDetails(local);
        }
      }
    };

    fetchPatientDetails();
    return () => { isMounted = false; };
  }, [activePatientId, patients]);

  // Register a new patient
  const registerPatient = async (patientData) => {
    try {
      setIsLoading(true);
      let registered = null;

      try {
        const res = await api.post('/patients', patientData);
        if (res.data?.success && res.data.patient) {
          registered = res.data.patient;
        }
      } catch (apiErr) {
        console.warn('[PatientContext] Backend offline or errored, registering locally:', apiErr.message);
      }

      // If backend failed or offline, generate local object
      if (!registered) {
        const nextNum = 1000 + patients.length + 1;
        const newId = `P${nextNum}`;
        registered = {
          id: newId,
          name: patientData.name,
          age: parseInt(patientData.age, 10) || 45,
          gender: patientData.gender || 'Male',
          dob: patientData.dob || `${new Date().getFullYear() - (parseInt(patientData.age, 10) || 45)}-01-01`,
          bloodGroup: patientData.bloodGroup || 'B+',
          phone: patientData.phone || '+91 98000-00000',
          abhaAddress: patientData.abhaAddress || `${patientData.name.toLowerCase().replace(/\s+/g, '.')}.${nextNum}@abdm`,
          emergencyContact: patientData.emergencyContact || { name: 'Emergency Contact', relation: 'Family', phone: '+91 98000-00000' },
          chronicConditions: (patientData.chronicConditions || []).map(c => typeof c === 'string' ? { code: 'ICD-10', name: c, status: 'Active' } : c),
          allergies: (patientData.allergies || []).map(a => typeof a === 'string' ? { substance: a, reaction: 'Hypersensitivity', severity: 'Moderate' } : a),
          activeMedications: (patientData.activeMedications || []).map(m => typeof m === 'string' ? { drugName: m, dose: 'Standard', frequency: '1 Tab OD', status: 'Active' } : m),
          labTrends: patientData.labTrends || [],
          timelineEvents: [
            {
              id: `evt-${Date.now()}`,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              category: 'Clinical Intake & Registration',
              type: 'INTAKE',
              title: `Patient Intake & Chart Created - ${patientData.primaryClinic || 'OPD Intake'}`,
              provider: patientData.primaryDoctor || 'Attending Physician',
              clinic: patientData.primaryClinic || 'Outpatient Department',
              badge: 'Verified Intake',
              badgeColor: 'emerald',
              summary: `Patient record registered for ${patientData.name}. Initial clinical chart initiated.`,
              sourceDoc: 'opd_intake_registration_form.pdf',
              page: 1
            }
          ]
        };
      }

      // Update state
      const updatedList = [...patients, registered];
      setPatients(updatedList);
      setActivePatientId(registered.id);
      setActivePatientDetails(registered);

      // Persist custom patients to localStorage
      try {
        let custom = [];
        const savedCustom = localStorage.getItem('caresynciq_custom_patients');
        if (savedCustom) custom = JSON.parse(savedCustom);
        custom.push(registered);
        localStorage.setItem('caresynciq_custom_patients', JSON.stringify(custom));
        localStorage.setItem('caresynciq_cached_patients', JSON.stringify(updatedList));
      } catch {}

      return registered;
    } finally {
      setIsLoading(false);
    }
  };

  // Add clinical entry to a patient
  const addPatientRecord = async (patientId, recordData) => {
    try {
      const res = await api.post(`/patients/${patientId}/records`, recordData);
      if (res.data?.success) {
        // Refresh patient details
        const refreshed = await api.get(`/patients/${patientId}`);
        if (refreshed.data?.patient) {
          setActivePatientDetails(refreshed.data.patient);
        }
        return res.data;
      }
    } catch (err) {
      console.warn('[PatientContext] Error adding record:', err.message);
      throw err;
    }
  };

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0] || INITIAL_BASE_PATIENTS[0];

  const value = {
    patients,
    activePatientId,
    setActivePatientId,
    activePatient,
    activePatientDetails,
    registerPatient,
    addPatientRecord,
    refreshPatients,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    openRegisterModal: () => setIsRegisterModalOpen(true),
    closeRegisterModal: () => setIsRegisterModalOpen(false),
    isLoading
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
