import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineLightningBolt,
  HiOutlineDuplicate,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineUpload,
  HiOutlineShare,
  HiOutlineCode,
  HiOutlineOfficeBuilding,
  HiOutlineCurrencyRupee,
  HiOutlineAdjustments,
  HiOutlineQrcode
} from 'react-icons/hi';
import { PATIENT_TIMELINE_CATALOG } from '../components/LongitudinalHealthTimeline';

// Extended clinical metadata tailored per patient
const PATIENT_CLINICAL_PROFILES = {
  P1001: {
    abhaAddress: 'rajesh.sharma@abdm',
    primaryDiagnosis: 'Type 2 Diabetes Mellitus • Essential Hypertension',
    vitals: [
      { label: 'Blood Pressure', value: '142/88', unit: 'mmHg', status: 'BORDERLINE', note: 'Target < 130/80' },
      { label: 'Heart Rate', value: '76', unit: 'bpm', status: 'NORMAL', note: 'Regular sinus' },
      { label: 'SpO2', value: '98%', unit: 'Room Air', status: 'NORMAL', note: 'Stable' },
      { label: 'Fasting Glucose', value: '148', unit: 'mg/dL', status: 'HIGH', note: 'HbA1c 7.8%' },
      { label: 'eGFR (CKD-EPI)', value: '74', unit: 'mL/min', status: 'NORMAL', note: 'Normal renal' },
      { label: 'BMI', value: '27.8', unit: 'kg/m²', status: 'ELEVATED', note: 'Overweight' }
    ],
    activeMedications: [
      { name: 'Metformin HCl', dose: '500 mg', freq: '1 Tab BD after meals', facility: 'Apollo Sugar Clinic', doctor: 'Dr. Arvind Rao', status: 'CONTESTED', alert: 'Conflict with City Clinic 850mg Rx' },
      { name: 'Telmisartan', dose: '40 mg', freq: '1 Tab OD morning', facility: 'Apollo Sugar Clinic', doctor: 'Dr. Arvind Rao', status: 'ACTIVE', alert: 'Reconciled BP regimen' },
      { name: 'Atorvastatin', dose: '20 mg', freq: '1 Tab HS bedtime', facility: 'Apollo Sugar Clinic', doctor: 'Dr. Arvind Rao', status: 'ACTIVE', alert: 'Lipid lowering' }
    ],
    careTeam: [
      { name: 'Dr. Arvind Rao', role: 'Endocrinologist', clinic: 'Apollo Sugar Clinic, Jayanagar' },
      { name: 'Dr. K. Radhakrishnan', role: 'Chief Pathologist', clinic: 'Dr. Lal PathLabs, Indiranagar' },
      { name: 'Dr. Sneha Roy', role: 'Consultant Cardiologist', clinic: 'Fortis Hospital, Bannerghatta' },
      { name: 'Dr. Vinod Gupta', role: 'Family Physician', clinic: 'City Family Clinic, HSR Layout' }
    ],
    safetySummary: {
      alertCount: 3,
      alertBadge: '3 Cross-Provider Violations',
      wasteINR: 1200,
      wasteReason: '16-Day Duplicate Comprehensive Lipid Panel',
      criticalPoints: [
        'Duplicate Investigation: Comprehensive Lipid Profile repeated at Metropolis just 16 days after Dr. Lal PathLabs certified test. Avoidable waste: ₹1,200.',
        'Prescription Contradiction: City Family Clinic escalated Metformin to 850mg BD + Glipizide 10mg without seeing Apollo Sugar 500mg BD regimen.',
        'Life-Threatening Allergy Conflict: QuickCare walk-in prescribed Augmentin 625mg (Amoxicillin) despite recorded severe Penicillin anaphylaxis.'
      ]
    }
  },
  P1002: {
    abhaAddress: 'priya.venkat@abdm',
    primaryDiagnosis: 'Severe Persistent Bronchial Asthma • Primary Hypothyroidism',
    vitals: [
      { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', status: 'NORMAL', note: 'Normotensive' },
      { label: 'Heart Rate', value: '82', unit: 'bpm', status: 'NORMAL', note: 'Tachycardia post-inhaler' },
      { label: 'SpO2', value: '96%', unit: 'Room Air', status: 'BORDERLINE', note: 'Mild wheeze' },
      { label: 'Serum TSH', value: '7.82', unit: 'mIU/L', status: 'HIGH', note: 'Elevated (Target < 4.2)' },
      { label: 'AEC', value: '620', unit: 'cells/mcL', status: 'HIGH', note: 'Eosinophilia' },
      { label: 'Peak Flow', value: '320', unit: 'L/min', status: 'BORDERLINE', note: '72% Predicted' }
    ],
    activeMedications: [
      { name: 'Thyronorm (Levothyroxine)', dose: '75 mcg', freq: '1 Tab OD fasting', facility: 'Aster CMI Hospital', doctor: 'Dr. Meera Nambiar', status: 'ACTIVE', alert: 'Titrated up from 50mcg' },
      { name: 'Symbicort Turbuhaler', dose: '160/4.5 mcg', freq: '2 Puffs BD', facility: 'Manipal Hospital', doctor: 'Dr. Ramesh Iyengar', status: 'ACTIVE', alert: 'Daily asthma controller' },
      { name: 'Montair (Montelukast)', dose: '10 mg', freq: '1 Tab HS bedtime', facility: 'Apollo Pharmacy Koramangala', doctor: 'Verified Refill', status: 'ACTIVE', alert: 'Leukotriene receptor blocker' }
    ],
    careTeam: [
      { name: 'Dr. Ramesh Iyengar', role: 'Consultant Pulmonologist', clinic: 'Manipal Hospital, Whitefield' },
      { name: 'Dr. Meera Nambiar', role: 'Inpatient Pulmonology Lead', clinic: 'Aster CMI Multispecialty Hospital' },
      { name: 'Dr. Alok Verma', role: 'Endocrinologist', clinic: 'ThyroCare Diagnostic Hub' },
      { name: 'Apollo Pharmacy', role: 'Dispensing Pharmacist', clinic: 'Branch #4012 Koramangala' }
    ],
    safetySummary: {
      alertCount: 2,
      alertBadge: '2 Safety Interceptions',
      wasteINR: 0,
      wasteReason: 'Prevented Fatal Bronchospasm',
      criticalPoints: [
        'Aspirin/NSAID Allergy Violation: Orthopaedic clinic prescribed Tab. Ibuprofen 400mg TDS for sprain, directly contravening recorded Aspirin-Exacerbated Respiratory Disease (AERD).',
        'Endocrine Titration Notice: Inpatient TSH of 7.82 mIU/L prompted Levothyroxine adjustment from 50 to 75 mcg with verified pharmacy refill.'
      ]
    }
  },
  P1003: {
    abhaAddress: 'anita.desai@abdm',
    primaryDiagnosis: 'Non-valvular Atrial Fibrillation • History of DVT • Hypertension',
    vitals: [
      { label: 'Blood Pressure', value: '136/82', unit: 'mmHg', status: 'BORDERLINE', note: 'Target < 130/80' },
      { label: 'Heart Rate', value: '88', unit: 'bpm', status: 'IRREGULAR', note: 'Atrial fibrillation' },
      { label: 'SpO2', value: '97%', unit: 'Room Air', status: 'NORMAL', note: 'Adequate' },
      { label: 'PT / INR', value: '4.80', unit: 'Ratio', status: 'CRITICAL', note: 'Toxic Elevation (Target 2-3)' },
      { label: 'Platelet Count', value: '210,000', unit: '/mcL', status: 'NORMAL', note: 'Adequate' },
      { label: 'eGFR (CKD-EPI)', value: '68', unit: 'mL/min', status: 'NORMAL', note: 'Age-appropriate' }
    ],
    activeMedications: [
      { name: 'Warfarin Sodium', dose: '3 mg', freq: '1 Tab OD at 6:00 PM', facility: 'St. John\'s Hospital', doctor: 'Dr. George Thomas', status: 'WITHHELD', alert: 'Withheld due to INR surge 4.80' },
      { name: 'Amlodipine Besylate', dose: '5 mg', freq: '1 Tab OD morning', facility: 'St. John\'s Cardiology', doctor: 'Dr. George Thomas', status: 'ACTIVE', alert: 'Antihypertensive' },
      { name: 'Cefpodoxime Proxetil', dose: '200 mg', freq: '1 Tab BD x 5 days', facility: 'St. John\'s Emergency Triage', doctor: 'Dr. Priya Mathew', status: 'ACTIVE', alert: 'Safe alternative for bronchitis' }
    ],
    careTeam: [
      { name: 'Dr. George Thomas', role: 'Chief Cardiologist', clinic: 'St. John\'s Medical College Hospital' },
      { name: 'Dr. Priya Mathew', role: 'Emergency Department Lead', clinic: 'St. John\'s Emergency Care' },
      { name: 'Dr. Sheila Mathew', role: 'Consultant Pathologist', clinic: 'St. John\'s Diagnostic Central Lab' },
      { name: 'Dr. R. K. Singhal', role: 'Chest Physician', clinic: 'Lakeside Chest & Allergy Clinic' }
    ],
    safetySummary: {
      alertCount: 2,
      alertBadge: 'Critical CYP3A4 Interaction',
      wasteINR: 0,
      wasteReason: 'Prevented Major Hemorrhagic Stroke',
      criticalPoints: [
        'Lethal Drug-Drug Interaction: Secondary clinic prescribed Clarithromycin 500mg BD for bronchitis without knowing ongoing Warfarin therapy. Potent CYP3A4/CYP2C9 enzyme inhibition spiked INR to 4.80.',
        'Sulfa Drug Allergy Guard: Pre-checked against recorded Sulfamethoxazole angioedema before acute antibiotic selection.'
      ]
    }
  },
  P1004: {
    abhaAddress: 'vikram.malhotra@abdm',
    primaryDiagnosis: 'Post-CABG (Triple Bypass) • Dyslipidemia • CKD Stage 3a',
    vitals: [
      { label: 'Blood Pressure', value: '124/78', unit: 'mmHg', status: 'NORMAL', note: 'Well-controlled' },
      { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'NORMAL', note: 'Beta-blocked' },
      { label: 'SpO2', value: '99%', unit: 'Room Air', status: 'NORMAL', note: 'Optimal' },
      { label: 'Creatine Kinase', value: '1,240', unit: 'U/L', status: 'CRITICAL', note: 'Severe Myopathy (Ref 30-200)' },
      { label: 'Serum Creatinine', value: '1.35', unit: 'mg/dL', status: 'HIGH', note: 'CKD 3a (eGFR 58)' },
      { label: 'LDL Cholesterol', value: '94', unit: 'mg/dL', status: 'NORMAL', note: 'Target < 70 post-CABG' }
    ],
    activeMedications: [
      { name: 'Atorvastatin IP', dose: '40 mg', freq: '1 Tab HS bedtime', facility: 'CMC Vellore Heart Centre', doctor: 'Dr. Vinay Kumar', status: 'WITHHELD', alert: 'Withheld due to toxic CK 1,240 U/L' },
      { name: 'Metoprolol Succinate ER', dose: '25 mg', freq: '1 Tab BD', facility: 'CMC Vellore Heart Centre', doctor: 'Dr. Vinay Kumar', status: 'ACTIVE', alert: 'Cardioprotective' },
      { name: 'Aspirin (Ecosprin)', dose: '75 mg', freq: '1 Tab OD post-lunch', facility: 'CMC Vellore Heart Centre', doctor: 'Dr. Vinay Kumar', status: 'ACTIVE', alert: 'Antiplatelet graft protection' }
    ],
    careTeam: [
      { name: 'Dr. Vinay Kumar', role: 'Cardiothoracic Surgeon', clinic: 'CMC Vellore Heart Centre' },
      { name: 'Dr. Sneha Roy', role: 'Consultant Cardiologist', clinic: 'Fortis Hospital, Bannerghatta' },
      { name: 'Dr. R. K. Anand', role: 'Biochemist', clinic: 'Anand Diagnostic Laboratory' },
      { name: 'MedPlus Pharmacy', role: 'Refill Pharmacist', clinic: 'Branch #108 Koramangala' }
    ],
    safetySummary: {
      alertCount: 2,
      alertBadge: 'Critical Statin-Fibrate Conflict',
      wasteINR: 0,
      wasteReason: 'Prevented Acute Renal Shutdown',
      criticalPoints: [
        'Severe Statin-Fibrate Interaction: Outside walk-in clinic prescribed Gemfibrozil 600mg BD for hypertriglyceridemia without seeing CMC Vellore Atorvastatin 40mg record. Glucuronidation block caused 300% statin elevation and toxic CK surge (1,240 U/L).',
        'Radiocontrast Anaphylaxis Alert: Severe iodinated contrast allergy documented during angiogram flagged across all care facilities.'
      ]
    }
  },
  P1005: {
    abhaAddress: 'sunita.rao@abdm',
    primaryDiagnosis: 'Hashimoto Autoimmune Thyroiditis • Osteopenia / Fracture Risk',
    vitals: [
      { label: 'Blood Pressure', value: '122/80', unit: 'mmHg', status: 'NORMAL', note: 'Stable' },
      { label: 'Heart Rate', value: '74', unit: 'bpm', status: 'NORMAL', note: 'Regular sinus' },
      { label: 'SpO2', value: '99%', unit: 'Room Air', status: 'NORMAL', note: 'Optimal' },
      { label: 'Serum TSH', value: '6.40', unit: 'mIU/L', status: 'HIGH', note: 'Target < 4.20' },
      { label: 'DEXA T-score', value: '-2.2', unit: 'L1-L4', status: 'BORDERLINE', note: 'Osteopenia (-1.0 to -2.5)' },
      { label: 'Serum Calcium', value: '9.1', unit: 'mg/dL', status: 'NORMAL', note: 'Normal range' }
    ],
    activeMedications: [
      { name: 'Levothyroxine Sodium', dose: '50 mcg', freq: '1 Tab OD 6:00 AM fasting', facility: 'Aster CMI Hospital', doctor: 'Dr. Alok Verma', status: 'ACTIVE', alert: 'Thyroid replacement' },
      { name: 'Shelcal 500 (Calcium + D3)', dose: '500 mg', freq: '1 Tab OD with lunch (2 PM)', facility: 'HealthSpring Clinic', doctor: 'Dr. Preeti Hegde', status: 'ACTIVE', alert: 'Reconciled 4h spacing after T4' },
      { name: 'Nitrofurantoin', dose: '100 mg', freq: '1 Tab BD x 7 days', facility: 'Cloudnine Urgent Care', doctor: 'Dr. S. Mohan', status: 'ACTIVE', alert: 'Safe UTI antibiotic' }
    ],
    careTeam: [
      { name: 'Dr. Alok Verma', role: 'Consultant Endocrinologist', clinic: 'Aster CMI Hospital, Hebbal' },
      { name: 'Dr. Ramesh Babu', role: 'Chief Radiologist', clinic: 'Aarthi Scans & Labs, Jayanagar' },
      { name: 'Dr. K. Srinivas', role: 'Orthopaedic Surgeon', clinic: 'Manipal Hospital Orthopaedics' },
      { name: 'Dr. Preeti Hegde', role: 'Internal Medicine Lead', clinic: 'HealthSpring Clinic, Indiranagar' }
    ],
    safetySummary: {
      alertCount: 3,
      alertBadge: 'Duplicate DEXA + Chelation Guard',
      wasteINR: 2800,
      wasteReason: '20-Day Repeated DEXA Bone Mineral Density Scan',
      criticalPoints: [
        'Unnecessary Duplicate Radiology: Manipal Hospital re-ordered DEXA Bone Mineral Density scan just 20 days after certified baseline scan at Aarthi Scans due to unshared imaging records. Avoidable waste: ₹2,800.',
        'Chelation Absorption Block: Shelcal 500 prescribed morning simultaneously with Levothyroxine. Chelation binding impairs T4 absorption. Reconciled to 4-hour interval with lunch.',
        'Fluoroquinolone Anaphylaxis Intercept: Urgent care prescribed Ciprofloxacin 500mg; intercepted by CareSyncIQ due to recorded Achilles tendinitis & angioedema allergy.'
      ]
    }
  }
};

export default function Dashboard() {
  const [activePatientId, setActivePatientId] = useState('P1001');
  const [adaptTab, setAdaptTab] = useState('architecture');
  const [monthlyOpdVolume, setMonthlyOpdVolume] = useState(2500);
  const [simulationStatus, setSimulationStatus] = useState(null);

  const patient = PATIENT_TIMELINE_CATALOG[activePatientId] || PATIENT_TIMELINE_CATALOG.P1001;
  const profile = PATIENT_CLINICAL_PROFILES[activePatientId] || PATIENT_CLINICAL_PROFILES.P1001;

  // Real-time hospital ROI calculations based on monthly OPD volume
  const duplicateTestsAvoidedMonthly = Math.round(monthlyOpdVolume * 0.055); // 5.5% repeat rate
  const duplicateSavingsINR = duplicateTestsAvoidedMonthly * 1200;
  const adesPreventedMonthly = Math.round(monthlyOpdVolume * 0.008); // 0.8% high-risk DDI/Allergy rate
  const adeSavingsINR = adesPreventedMonthly * 42000; // Average avoided emergency/ICU stay
  const doctorHoursSavedMonthly = Math.round((monthlyOpdVolume * 4.5) / 60); // 4.5 minutes saved per consultation
  const totalMonthlySavingsLakhs = ((duplicateSavingsINR + adeSavingsINR) / 100000).toFixed(2);

  const handleSimulateIngestion = (sourceType) => {
    setSimulationStatus({ loading: true, message: `Connecting to ${sourceType}...` });
    setTimeout(() => {
      setSimulationStatus({
        loading: false,
        success: true,
        source: sourceType,
        recordsProcessed: 1,
        validation: 'HL7 FHIR R4 Bundle Validated',
        latencyMs: 14,
        dedupStatus: 'Zero Duplicate Redundancies Detected'
      });
      setTimeout(() => setSimulationStatus(null), 5000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Patient Switcher */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-6 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
              CareSyncIQ v2.0
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
              SYNTHETIC DEMO DATA
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <HiOutlineShieldCheck /> ABDM M1/M2/M3 COMPLIANT
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
            Patient Health Command Center
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl">
            Unified longitudinal medical records synthesized across disparate hospitals, outpatient clinics, pathology networks, and retail pharmacies.
          </p>
        </div>

        {/* 5-Patient Switcher */}
        <div className="flex flex-col lg:items-end gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Clinical Persona:</span>
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-xs">
            {Object.values(PATIENT_TIMELINE_CATALOG).map(p => (
              <button
                key={p.id}
                onClick={() => setActivePatientId(p.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  activePatientId === p.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{p.name.split(' ')[0]}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  activePatientId === p.id ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {p.id}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Vitals Strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Clinical Vitals & Biomarkers</span>
            <span className="text-[10px] text-slate-400 font-mono">({profile.abhaAddress})</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">Cross-Referenced from Certified Lab Feeds</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {profile.vitals.map((v, idx) => (
            <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 truncate">{v.label}</span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                  v.status === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    : v.status === 'HIGH' || v.status === 'BORDERLINE' || v.status === 'ELEVATED'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {v.status}
                </span>
              </div>
              <div className="mt-1 text-base font-black text-slate-900">
                {v.value} <span className="text-[10px] font-medium text-slate-500">{v.unit}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">{v.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Patient Identity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Patient</span>
            <span className="rounded-full bg-slate-100 p-1.5 text-slate-600">
              <HiOutlineUser className="text-base" />
            </span>
          </div>
          <div className="mt-3 text-lg font-black text-slate-900">{patient.name}</div>
          <p className="text-xs text-slate-600 mt-0.5">{patient.age} Yrs • {patient.gender} • UHID: {patient.id}</p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">ABHA Address</span>
            <span className="font-mono font-bold text-emerald-800">{profile.abhaAddress}</span>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chronic Conditions</span>
            <span className="rounded-full bg-emerald-50 p-1.5 text-emerald-700">
              <HiOutlineTrendingUp className="text-base" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{patient.chronicConditions.length} Diagnoses</div>
          <p className="text-xs text-slate-600 mt-0.5 truncate">{patient.chronicConditions[0].split('(')[0]}</p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Continuity Status</span>
            <span className="font-bold text-slate-700">Unified Care Plan</span>
          </div>
        </div>

        {/* Critical Allergies */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Critical Allergies</span>
            <span className="rounded-full bg-rose-100 p-1.5 text-rose-700">
              <HiOutlineExclamationCircle className="text-base" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-900">{patient.criticalAllergies.length} Flagged</div>
          <p className="text-xs font-bold text-rose-800 mt-0.5 truncate">{patient.criticalAllergies[0].split('(')[0]}</p>
          <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
            <span className="text-rose-700">Severity</span>
            <span className="font-black text-rose-900 uppercase">Life-Threatening</span>
          </div>
        </div>

        {/* Safety & Duplicate Alerts */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Uncoordinated Care Alerts</span>
            <span className="rounded-full bg-amber-100 p-1.5 text-amber-700">
              <HiOutlineDuplicate className="text-base" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-950">{profile.safetySummary.alertCount} Interceptions</div>
          <p className="text-xs text-amber-800 mt-0.5 truncate">{profile.safetySummary.wasteReason}</p>
          <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
            <span className="text-amber-700">Avoidable Waste</span>
            <span className="font-black text-amber-950">
              {profile.safetySummary.wasteINR > 0 ? `₹${profile.safetySummary.wasteINR} Saved` : 'Patient Safety Alert'}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Alert Warning Banner */}
      <div className="rounded-2xl border border-rose-300 bg-rose-50/90 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white font-black text-xs">
            !
          </span>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="text-sm font-extrabold text-rose-950">
                Cross-Provider Safety Violations Identified for {patient.name}
              </h3>
              <span className="self-start sm:self-auto rounded-md bg-rose-200 px-2 py-0.5 text-[10px] font-black text-rose-950 uppercase">
                {profile.safetySummary.alertBadge}
              </span>
            </div>
            <div className="mt-2 text-xs text-rose-900 space-y-1">
              {profile.safetySummary.criticalPoints.map((pt, idx) => (
                <p key={idx}>• {pt}</p>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Link
                to="/safety"
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
              >
                Review All Safety Alerts
              </Link>
              <Link
                to="/timeline"
                className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-900 hover:bg-rose-100 transition"
              >
                View Timeline Sequence
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reconciled Active Medications Regimen Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reconciled Active Medication Regimen</h3>
            <p className="text-xs text-slate-500">Continuous reconciliation preventing overlapping doses and drug-drug interactions.</p>
          </div>
          <Link to="/safety" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            Open Medication Reconciler →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Medication & Strength</th>
                <th className="py-2.5 px-3">Dosage & Frequency</th>
                <th className="py-2.5 px-3">Prescribing Clinician & Hospital</th>
                <th className="py-2.5 px-3">Clinical Status</th>
                <th className="py-2.5 px-3">Reconciliation Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profile.activeMedications.map((med, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {med.name} <span className="font-normal text-slate-500">({med.dose})</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">{med.freq}</td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="font-semibold text-slate-800">{med.doctor}</span>
                    <span className="block text-[10px] text-slate-400">{med.facility}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                      med.status === 'WITHHELD'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : med.status === 'CONTESTED'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">{med.alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Provider Care Team Network */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Disparate Multi-Provider Care Team</h3>
            <p className="text-xs text-slate-500">Clinicians treating this patient across different institutional silos.</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {profile.careTeam.length} Unconnected Facilities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {profile.careTeam.map((dr, idx) => (
            <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                  MD
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">{dr.name}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold truncate">{dr.role}</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 truncate flex items-center gap-1">
                <HiOutlineOfficeBuilding className="shrink-0" /> {dr.clinic}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ENTERPRISE ADAPTATION & HOSPITAL INTEGRATION HUB */}
      <div className="rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
                <HiOutlineAdjustments />
              </span>
              <h2 className="text-base font-black text-slate-900">
                Enterprise Hospital Adaptability & Integration Hub
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              How existing hospital systems (Epic, Cerner, OpenMRS, Bahmni, ABDM) adapt CareSyncIQ without replacing their software.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs">
            <button
              onClick={() => setAdaptTab('architecture')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                adaptTab === 'architecture' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Adaptation Architecture
            </button>
            <button
              onClick={() => setAdaptTab('roi')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                adaptTab === 'roi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hospital ROI Calculator
            </button>
            <button
              onClick={() => setAdaptTab('simulator')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                adaptTab === 'simulator' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live EMR Simulator
            </button>
          </div>
        </div>

        {/* TAB 1: HOW HOSPITALS ADAPT CARESYNCIQ */}
        {adaptTab === 'architecture' && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 font-black">1</span>
                ABDM National Gateway
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">M1 / M2 / M3 Compliant</h4>
              <p className="text-xs text-slate-600 mt-1">
                Zero custom hardware. Connects via ABHA ID. Implements Health Information Provider (HIP) FHIR bundle push and Health Information User (HIU) consent manager.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <HiOutlineCheckCircle /> Ready for National Rollout
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 font-black">2</span>
                Zero-Software Doctor Bridge
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">1-Tap ER / Clinic Access</h4>
              <p className="text-xs text-slate-600 mt-1">
                Visiting doctors and ER triage nurses install NO software. Scan patient's dynamic QR code or type 6-digit emergency OTP in any mobile browser to see allergies & active meds in 5 seconds.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <HiOutlineCheckCircle /> Works on Any Phone or Tablet
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 font-black">3</span>
                Legacy EMR REST Webhook
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">OpenMRS / Epic / Cerner</h4>
              <p className="text-xs text-slate-600 mt-1">
                Hospitals keep their existing HMIS software. Our lightweight REST webhook (<span className="font-mono text-[10px]">POST /api/fhir/encounter</span>) ingests discharge summaries and LIS lab reports automatically in the background.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <HiOutlineCheckCircle /> 30-Minute IT Integration
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 font-black">4</span>
                Paper & WhatsApp Intake
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Offline Clinic OCR Bridge</h4>
              <p className="text-xs text-slate-600 mt-1">
                For clinics without digital EMRs: photograph handwritten prescriptions or paper slips. Sovereign OCR + Indic post-corrector digitizes them into FHIR with clinician sign-off.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <HiOutlineCheckCircle /> Solves Ground-Reality OPDs
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOSPITAL ROI & CLINICAL WASTE CALCULATOR */}
        {adaptTab === 'roi' && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Adjust Hospital Monthly OPD Patient Volume:
                </label>
                <p className="text-xs text-slate-500">Slide to see projected clinical savings and reclaimed clinician hours.</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={monthlyOpdVolume}
                  onChange={e => setMonthlyOpdVolume(parseInt(e.target.value, 10))}
                  className="w-48 accent-emerald-600 cursor-pointer"
                />
                <span className="rounded-lg bg-emerald-100 px-3 py-1 font-mono text-xs font-black text-emerald-900">
                  {monthlyOpdVolume.toLocaleString('en-IN')} Patients / Mo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Avoided Duplicate Tests</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {duplicateTestsAvoidedMonthly.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">tests/mo</span>
                </div>
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  ₹{(duplicateSavingsINR / 100000).toFixed(2)} Lakhs Direct Patient Savings
                </p>
                <span className="text-[10px] text-slate-400 block mt-2">@ ₹1,200 avg private lab tariff</span>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Prevented Drug-Drug Conflicts</div>
                <div className="text-2xl font-black text-rose-900 mt-1">
                  {adesPreventedMonthly} <span className="text-xs font-semibold text-rose-700">high-risk ADEs</span>
                </div>
                <p className="text-xs text-rose-700 font-bold mt-1">
                  ₹{(adeSavingsINR / 100000).toFixed(2)} Lakhs Avoided ICU / Liability
                </p>
                <span className="text-[10px] text-slate-400 block mt-2">@ ₹42,000 avg adverse event cost</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Reclaimed Consultation Time</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {doctorHoursSavedMonthly} <span className="text-xs font-semibold text-slate-500">doctor hours</span>
                </div>
                <p className="text-xs text-slate-600 font-bold mt-1">
                  4.5 Minutes Saved per OPD Intake
                </p>
                <span className="text-[10px] text-slate-400 block mt-2">Eliminates physical chart retrieval</span>
              </div>

              <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-600 text-white p-4 shadow-2xs">
                <div className="text-[10px] font-bold text-emerald-200 uppercase">Total Monthly Value Created</div>
                <div className="text-2xl font-black mt-1">
                  ₹{totalMonthlySavingsLakhs} <span className="text-xs font-semibold text-emerald-200">Lakhs</span>
                </div>
                <p className="text-xs text-emerald-100 font-bold mt-1">
                  ₹{((parseFloat(totalMonthlySavingsLakhs) * 12) / 100).toFixed(2)} Crores Annualized
                </p>
                <span className="text-[10px] text-emerald-200 block mt-2">Direct ROI for Health System</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE EMR SIMULATOR */}
        {adaptTab === 'simulator' && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-sm font-bold text-slate-900">
                Interactive Hospital Ingestion Test Harness
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Simulate how hospital EMRs push clinical summaries or diagnostic results via our standardized FHIR R4 API.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleSimulateIngestion('Epic / OpenMRS Discharge Summary')}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  Simulate Epic / OpenMRS Inpatient Push
                </button>
                <button
                  onClick={() => handleSimulateIngestion('Dr. Lal PathLabs LIS Result Feed')}
                  className="rounded-xl border border-emerald-400 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100 transition"
                >
                  Simulate Diagnostic Lab LIS Push
                </button>
                <button
                  onClick={() => handleSimulateIngestion('Apollo Pharmacy Dispensing Webhook')}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  Simulate Pharmacy Dispense Feed
                </button>
              </div>

              {simulationStatus && (
                <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 animate-in fade-in">
                  {simulationStatus.loading ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                      {simulationStatus.message}
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs text-emerald-950">
                      <div className="flex items-center gap-2 font-black">
                        <HiOutlineCheckCircle className="text-emerald-700 text-base" />
                        Successfully Ingested & Verified from {simulationStatus.source}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-emerald-200/60 font-mono text-[11px]">
                        <div>Validation: <span className="font-bold text-emerald-900">{simulationStatus.validation}</span></div>
                        <div>Latency: <span className="font-bold text-emerald-900">{simulationStatus.latencyMs} ms</span></div>
                        <div>Records: <span className="font-bold text-emerald-900">{simulationStatus.recordsProcessed} Encounter</span></div>
                        <div>Deduplication: <span className="font-bold text-emerald-900">{simulationStatus.dedupStatus}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/timeline"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition">
            <HiOutlineTrendingUp className="text-xl" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Health Timeline</h3>
          <p className="text-xs text-slate-500 mt-1">Interactive multi-year biomarker trends with normal reference bands.</p>
        </Link>

        <Link
          to="/patient"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition">
            <HiOutlineShare className="text-xl" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Consent & Sharing</h3>
          <p className="text-xs text-slate-500 mt-1">Generate time-limited doctor access codes and revoke anytime.</p>
        </Link>

        <Link
          to="/safety"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition">
            <HiOutlineExclamationCircle className="text-xl" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Safety Reconciler</h3>
          <p className="text-xs text-slate-500 mt-1">Duplicate test detector, drug interaction rules, and active meds.</p>
        </Link>

        <Link
          to="/handoff"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-rose-300 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800 group-hover:bg-rose-600 group-hover:text-white transition">
            <HiOutlineLightningBolt className="text-xl" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">1-Tap ER Handoff</h3>
          <p className="text-xs text-slate-500 mt-1">Emergency clinical summary with red allergies and active meds.</p>
        </Link>
      </div>

      {/* Recent Chronological Events Stream (All 5 encounters) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Longitudinal Clinical Encounters & Diagnostic Records ({patient.events.length} Events)
            </h3>
            <p className="text-xs text-slate-500">Cross-referenced across clinics, pathology labs, and pharmacies.</p>
          </div>
          <Link
            to="/timeline"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            View Interactive Timeline →
          </Link>
        </div>

        <div className="space-y-3">
          {patient.events.map(evt => (
            <div key={evt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition">
              <div className="flex items-start gap-3">
                <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  evt.type === 'DUPLICATE'
                    ? 'bg-amber-100 text-amber-800'
                    : evt.type === 'CONFLICT' || evt.type === 'ALLERGY_ALERT'
                    ? 'bg-rose-100 text-rose-800'
                    : evt.type === 'LAB'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {evt.type === 'DUPLICATE' ? 'Dup' : evt.type === 'CONFLICT' ? 'DDI' : evt.type === 'ALLERGY_ALERT' ? 'Allg' : evt.type === 'LAB' ? 'Lab' : 'Rx'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {evt.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{evt.summary}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{evt.clinic} • {evt.provider}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 border border-slate-200">
                  {evt.sourceDoc} (p. {evt.page})
                </span>
                <span className={`text-[10px] font-bold flex items-center gap-1 ${
                  evt.badgeColor === 'rose'
                    ? 'text-rose-700'
                    : evt.badgeColor === 'amber'
                    ? 'text-amber-800'
                    : 'text-emerald-700'
                }`}>
                  <HiOutlineCheckCircle /> {evt.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
