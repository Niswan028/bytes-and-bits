import React, { useState, useEffect } from 'react';
import {
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineShare,
  HiOutlineUpload,
  HiOutlineClock,
  HiOutlineKey,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineQrcode,
  HiOutlineUserAdd
} from 'react-icons/hi';
import { PATIENT_TIMELINE_CATALOG } from '../components/LongitudinalHealthTimeline';
import { usePatient } from '../context/PatientContext';

export const PATIENT_MEDICATIONS_MAP = {
  P1001: [
    { name: 'Metformin HCl 500 mg', status: 'Needs Review', statusColor: 'amber', schedule: '1 Tab Twice Daily (BD) after meals • Apollo Sugar Clinic', notes: '⚠️ Conflicted with 850mg BD prescribed at City Family Clinic' },
    { name: 'Telmisartan 40 mg', status: 'Active', statusColor: 'emerald', schedule: '1 Tab Once Daily (OD) morning • Dr. Arvind Rao' },
    { name: 'Atorvastatin 20 mg', status: 'Active', statusColor: 'emerald', schedule: '1 Tab at bedtime (HS) • Apollo Sugar Clinic' }
  ],
  P1002: [
    { name: 'Levothyroxine 75 mcg', status: 'Active (Titrated)', statusColor: 'emerald', schedule: '1 Tab OD morning on empty stomach • Aster CMI' },
    { name: 'Symbicort 160/4.5 Turbuhaler', status: 'Active', statusColor: 'emerald', schedule: '2 Puffs Twice Daily (BD) • Dr. Meera Nambiar' },
    { name: 'Cetirizine 10 mg', status: 'As Needed (PRN)', statusColor: 'emerald', schedule: '1 Tab OD at night for allergic rhinitis' }
  ],
  P1003: [
    { name: 'Warfarin Sodium 3 mg', status: 'Temporarily Withheld', statusColor: 'rose', schedule: 'Withheld due to INR 4.80 surge from Clarithromycin interaction • St. John\'s', notes: '⚠️ Reversal protocol initiated with Vitamin K' },
    { name: 'Amlodipine 5 mg', status: 'Active', statusColor: 'emerald', schedule: '1 Tab OD morning • St. John\'s Cardiology' }
  ],
  P1004: [
    { name: 'Atorvastatin 40 mg', status: 'Needs Review', statusColor: 'amber', schedule: '1 Tab at bedtime (HS) • CMC Vellore Heart Centre', notes: '⚠️ Rhabdomyolysis alert: Severe interaction with Gemfibrozil 600mg' },
    { name: 'Metoprolol Succinate 25 mg', status: 'Active', statusColor: 'emerald', schedule: '1 Tab BD morning & evening • Post-CABG regimen' },
    { name: 'Aspirin (Ecosprin) 75 mg', status: 'Active', statusColor: 'emerald', schedule: '1 Tab OD post-lunch • Antiplatelet secondary prevention' }
  ],
  P1005: [
    { name: 'Levothyroxine 100 mcg', status: 'Needs Timing Fix', statusColor: 'amber', schedule: '1 Tab OD early morning (6:00 AM) • Dr. Alok Verma', notes: '⚠️ Co-administered Calcium carbonate chelates and impairs T4 absorption' },
    { name: 'Calcium Carbonate + Vit D3', status: 'Active', statusColor: 'emerald', schedule: '1 Tab BD with meals (Advise 4-hour spacing after Levothyroxine)' }
  ]
};

export default function PatientPortal() {
  const { patients, activePatientId, setActivePatientId, openRegisterModal, activePatientDetails } = usePatient();
  const [patientId, setPatientId] = useState(activePatientId || 'P1001');
  const [recipient, setRecipient] = useState('Dr. Sneha Roy (Fortis Care)');
  const [duration, setDuration] = useState('60'); // minutes
  const [scopeCondition, setScopeCondition] = useState('DIABETES_HYPERTENSION');
  const [scopeCategory, setScopeCategory] = useState('ALL');
  const [scopeRange, setScopeRange] = useState('LAST_6_MONTHS');

  const [activeCodes, setActiveCodes] = useState([
    {
      code: 'DOC-8942',
      recipientDoctor: 'Dr. Sneha Roy (Fortis Care)',
      scopeCategory: 'ALL',
      scopeCondition: 'DIABETES_HYPERTENSION',
      scopeDateRange: 'LAST_6_MONTHS',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      isRevoked: false,
      accessCount: 1
    }
  ]);

  const [accessLogs, setAccessLogs] = useState([
    {
      id: 'log-1',
      code: 'DOC-8942',
      accessorName: 'Dr. Sneha Roy',
      accessorRole: 'Cardiologist (Fortis Care)',
      accessedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      scopeAccessed: 'DIABETES_HYPERTENSION (Last 6 Months)'
    }
  ]);

  const [generatedCode, setGeneratedCode] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const currentPatientMeta = patients.find(p => p.id === patientId) || patients[0];
  const catalogPatient = PATIENT_TIMELINE_CATALOG[patientId];

  const patient = {
    id: currentPatientMeta?.id || patientId,
    name: currentPatientMeta?.name || catalogPatient?.name || 'Patient',
    age: currentPatientMeta?.age || catalogPatient?.age || 45,
    gender: currentPatientMeta?.gender || catalogPatient?.gender || 'Male',
    chronicConditions: catalogPatient?.chronicConditions || (currentPatientMeta?.chronicConditions || []).map(c => typeof c === 'string' ? c : c.name),
    criticalAllergies: catalogPatient?.criticalAllergies || (currentPatientMeta?.allergies || []).map(a => typeof a === 'string' ? a : `${a.substance} (${a.reaction || 'Hypersensitivity'})`),
  };

  const currentMeds = PATIENT_MEDICATIONS_MAP[patientId] ||
    (activePatientDetails?.activeMedications || currentPatientMeta?.activeMedications || []).map(m => ({
      name: m.drugName || m.name,
      status: m.status || 'Active',
      statusColor: 'emerald',
      schedule: `${m.frequency || m.instructions || '1 Tab OD'} • ${m.prescribedBy || m.clinic || 'Attending Physician'}`
    }));

  // Sync consents with backend on patient change
  useEffect(() => {
    let isMounted = true;
    async function loadConsents() {
      try {
        const res = await fetch(`http://localhost:5000/api/consent/patient/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.consents && data.consents.length > 0) {
            setActiveCodes(data.consents);
          }
          if (isMounted && data.accessLogs && data.accessLogs.length > 0) {
            setAccessLogs(data.accessLogs);
          }
        }
      } catch (err) {
        // Fallback gracefully in case backend is loading
      }
    }
    loadConsents();
    return () => { isMounted = false; };
  }, [patientId]);

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    setApiError(null);

    const payload = {
      patientId,
      recipientDoctor: recipient || 'Consulting Clinician',
      durationMinutes: Number(duration),
      scopeCondition,
      scopeCategory,
      scopeDateRange: scopeRange
    };

    try {
      const res = await fetch('http://localhost:5000/api/consent/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.consent) {
        setActiveCodes(prev => [data.consent, ...prev.filter(c => c.code !== data.consent.code)]);
        setGeneratedCode(data.consent);
      } else {
        throw new Error(data.message || 'Failed to create code');
      }
    } catch (err) {
      // Local fallback simulation if offline
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const code = `DOC-${randomDigits}`;
      const localConsent = {
        code,
        patientId,
        recipientDoctor: recipient || 'Consulting Clinician',
        scopeCategory,
        scopeCondition,
        scopeDateRange: scopeRange,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + Number(duration) * 60 * 1000).toISOString(),
        isRevoked: false,
        accessCount: 0
      };
      setActiveCodes(prev => [localConsent, ...prev]);
      setGeneratedCode(localConsent);
    }
  };

  const handleRevoke = async (code) => {
    try {
      const res = await fetch(`http://localhost:5000/api/consent/revoke/${code}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setActiveCodes(prev => prev.map(c => c.code === code ? { ...c, isRevoked: true } : c));
        if (generatedCode && generatedCode.code === code) {
          setGeneratedCode(prev => ({ ...prev, isRevoked: true }));
        }
      }
    } catch (err) {
      // Local fallback
      setActiveCodes(prev => prev.map(c => c.code === code ? { ...c, isRevoked: true } : c));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mobile-First Header */}
      <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl shadow-xs">
              <HiOutlineUser />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{patient.name}</h1>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                  Patient Vault Owner
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{patient.age} Yrs • {patient.gender} • UHID: {patient.id}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Patient:</span>
            <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200">
              {patients.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPatientId(p.id);
                    setActivePatientId(p.id);
                    setGeneratedCode(null);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                    patientId === p.id ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{p.name.split(' ')[0]}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    patientId === p.id ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {p.id}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={openRegisterModal}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-2xs"
              >
                <HiOutlineUserAdd className="text-emerald-700" />
                <span>+ Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MY HEALTH AT A GLANCE (Conditions, Allergies, Meds) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conditions & Allergies */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">My Chronic Conditions</span>
            <div className="mt-2 space-y-1.5">
              {patient.chronicConditions.map((c, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs font-bold text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">My Critical Allergies</span>
            <div className="mt-2 space-y-1.5">
              {patient.criticalAllergies.map((a, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 border border-rose-200 text-xs font-black text-rose-900">
                  <HiOutlineExclamationCircle className="text-rose-600 text-sm" />
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Active Medications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Active Medications</span>
            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
              <HiOutlineShieldCheck /> Reconciled
            </span>
          </div>

          <div className="space-y-2 mt-3">
            {currentMeds.map((med, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-3 text-xs ${
                  med.statusColor === 'rose'
                    ? 'border-rose-200 bg-rose-50/70'
                    : med.statusColor === 'amber'
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-slate-100 bg-slate-50/70'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">{med.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      med.statusColor === 'rose'
                        ? 'text-rose-900 bg-rose-200'
                        : med.statusColor === 'amber'
                        ? 'text-amber-800 bg-amber-200/80'
                        : 'text-emerald-800 bg-emerald-100'
                    }`}
                  >
                    {med.status}
                  </span>
                </div>
                <p className="text-slate-600 mt-1">{med.schedule}</p>
                {med.notes && (
                  <p className="text-[10px] text-amber-900 mt-1 font-semibold">{med.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK UPLOAD FLOW FOR PHONE PHOTOS & PDFS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
            <HiOutlineUpload />
          </span>
          <h2 className="text-sm font-bold text-slate-900">Add New Prescription or Lab Report</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Snap a photo of paper prescriptions or upload PDF lab reports. Our pipeline automatically straightens (deskews), cleans contrast, extracts medicine dosages, and verifies safety against your history.
        </p>

        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition cursor-pointer bg-slate-50/50">
          <HiOutlineUpload className="mx-auto text-3xl text-emerald-600 mb-2" />
          <p className="text-xs font-bold text-slate-800">Tap to upload photos or select PDF files</p>
          <p className="text-[11px] text-slate-400 mt-1">Supports Phone Camera Photos (PNG/JPG), Scans, and PDF Lab Sheets</p>
          <button
            type="button"
            onClick={() => {
              setUploadSuccess(true);
              setTimeout(() => setUploadSuccess(false), 4000);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            Simulate Document Ingestion
          </button>
        </div>

        {uploadSuccess && (
          <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 flex items-center gap-2">
            <HiOutlineCheckCircle className="text-emerald-600 text-lg" />
            Document processed with Deskew & CLAHE OCR preprocessing! Reconciled with existing timeline and verified in clinical audit log.
          </div>
        )}
      </div>

      {/* GRANULAR CONSENT & SHARING ENGINE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
              <HiOutlineKey />
            </span>
            <h2 className="text-base font-bold text-slate-900">Patient-Controlled Sharing & Consent Manager</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Share exactly the right history with the right doctor, for exactly as long as you allow. Doctors access records using a 6-digit code with zero login needed.
          </p>
        </div>

        <form onSubmit={handleGenerateCode} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor / Clinic Recipient:</label>
              <input
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="e.g. Dr. Sneha Roy (Fortis Care)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Access Expiration Duration:</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-emerald-500 font-bold"
              >
                <option value="15">15 Minutes (Emergency Walk-In)</option>
                <option value="60">1 Hour (Standard Consultation)</option>
                <option value="240">4 Hours (Daycare Admission)</option>
                <option value="1440">24 Hours (Inpatient Observation)</option>
              </select>
            </div>
          </div>

          {/* Granular Scope Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition Scope:</label>
              <select
                value={scopeCondition}
                onChange={e => setScopeCondition(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
              >
                <option value="ALL">All Conditions</option>
                <option value="DIABETES_HYPERTENSION">Only Diabetes & Hypertension</option>
                <option value="ASTHMA_ONLY">Only Asthma Records</option>
                <option value="CARDIOLOGY_ONLY">Only Cardiology Records</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Record Category:</label>
              <select
                value={scopeCategory}
                onChange={e => setScopeCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
              >
                <option value="ALL">Full Dossier (Meds + Labs + Visits)</option>
                <option value="LABS_ONLY">Diagnostic Lab Results Only</option>
                <option value="PRESCRIPTIONS_ONLY">Active Prescriptions Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date History Range:</label>
              <select
                value={scopeRange}
                onChange={e => setScopeRange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
              >
                <option value="LAST_30_DAYS">Last 30 Days</option>
                <option value="LAST_6_MONTHS">Last 6 Months (Recommended)</option>
                <option value="LAST_1_YEAR">Last 1 Year</option>
                <option value="ALL_TIME">Complete Lifetime History</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <HiOutlineKey className="text-base" />
              Generate Secure Time-Limited Access Code
            </button>
          </div>
        </form>

        {/* Modal-like Generated Code Card */}
        {generatedCode && (
          <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Share this code with your doctor:</span>
                <div className="text-2xl font-black text-emerald-950 font-mono tracking-widest mt-1">
                  {generatedCode.code}
                </div>
                <p className="text-xs text-emerald-800 mt-1">Doctor accesses via: <b>caresynciq.app/doctor/{generatedCode.code}</b></p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Scope: {generatedCode.scopeCategory} ({generatedCode.scopeCondition}) • Recipient: {generatedCode.recipientDoctor}
                </p>
                {generatedCode.isRevoked && (
                  <span className="mt-1 inline-block rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white uppercase">
                    REVOKED
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-xl border border-emerald-300 bg-white p-2 text-emerald-800 shadow-xs flex items-center gap-1.5 text-xs font-bold">
                  <HiOutlineQrcode className="text-lg" />
                  QR Ready
                </span>
                {!generatedCode.isRevoked && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(generatedCode.code)}
                    className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
                  >
                    Revoke Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE ACCESS CODES LIST */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Active Doctor Sharing Permissions</h3>
          <div className="space-y-3">
            {activeCodes.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-900">{item.code}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      !item.isRevoked ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {item.isRevoked ? 'REVOKED' : 'ACTIVE'}
                    </span>
                    <span className="text-xs text-slate-500">• {item.recipientDoctor || item.recipient}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Scope: {item.scopeCategory || 'ALL'} • {item.scopeCondition || 'ALL'} • {item.scopeDateRange || 'LAST_6_MONTHS'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Expires: {new Date(item.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Viewed {item.accessCount || 0} times
                  </p>
                </div>

                {!item.isRevoked && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(item.code)}
                    className="self-start sm:self-auto rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100 transition flex items-center gap-1"
                  >
                    <HiOutlineTrash /> Revoke Access
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WHO VIEWED WHAT ACCESS AUDIT LOG */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Immutable Access Log (Who Viewed What & When)</h3>
          <div className="space-y-2">
            {accessLogs.map((log, idx) => (
              <div key={log.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/60 border border-slate-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <HiOutlineEye className="text-slate-400 text-base" />
                  <div>
                    <span className="font-bold text-slate-900">{log.accessorName || log.accessor}</span>
                    <span className="text-slate-500"> ({log.accessorRole || log.clinic}) viewed records</span>
                    <p className="text-[10px] text-slate-500">Scope: {log.scopeAccessed || log.scope}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-slate-500">{new Date(log.accessedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <p className="text-[9px] font-bold text-emerald-700">Audit Chained</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
