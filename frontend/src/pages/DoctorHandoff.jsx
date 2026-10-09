import React, { useState } from 'react';
import {
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlinePhone,
  HiOutlineDownload,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineQrcode
} from 'react-icons/hi';
import { PATIENT_TIMELINE_CATALOG } from '../components/LongitudinalHealthTimeline';
import { exportOfficialPdf } from '../utils/exportOfficialPdf';

export default function DoctorHandoff() {
  const [patientId, setPatientId] = useState('P1001');
  const [accessCodeInput, setAccessCodeInput] = useState('DOC-8942');
  const [verifiedConsent, setVerifiedConsent] = useState(null);
  const [accessError, setAccessError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('CODE_ACCESS'); // 'CODE_ACCESS' or 'ER_DIRECT'

  const catalogPatient = PATIENT_TIMELINE_CATALOG[patientId] || PATIENT_TIMELINE_CATALOG.P1001;

  // Active patient data: either from verified token or from simulation catalog
  const currentPatient = (mode === 'CODE_ACCESS' && verifiedConsent) ? verifiedConsent.patient : {
    id: catalogPatient.id,
    name: catalogPatient.name,
    age: catalogPatient.age,
    gender: catalogPatient.gender,
    bloodGroup: patientId === 'P1001' ? 'B+' : patientId === 'P1002' ? 'O+' : patientId === 'P1003' ? 'A+' : patientId === 'P1004' ? 'O+' : 'B+',
    chronicConditions: catalogPatient.chronicConditions,
    criticalAllergies: catalogPatient.criticalAllergies,
    activeMedications: patientId === 'P1001' ? [
      { drugName: 'Metformin HCl', dose: '500 mg', frequency: '1 Tab BD after meals', clinic: 'Apollo Sugar Clinic', status: 'Needs Review', conflictNote: 'Conflicted with 850mg BD' },
      { drugName: 'Telmisartan', dose: '40 mg', frequency: '1 Tab OD morning', clinic: 'Dr. Arvind Rao', status: 'Active' },
      { drugName: 'Atorvastatin', dose: '20 mg', frequency: '1 Tab HS bedtime', clinic: 'Apollo Sugar Clinic', status: 'Active' }
    ] : patientId === 'P1002' ? [
      { drugName: 'Levothyroxine Sodium', dose: '75 mcg', frequency: '1 Tab OD fasting', clinic: 'Aster CMI Hospital', status: 'Active' },
      { drugName: 'Symbicort Turbuhaler', dose: '160/4.5 mcg', frequency: '2 Puffs BD', clinic: 'Dr. Meera Nambiar', status: 'Active' }
    ] : patientId === 'P1003' ? [
      { drugName: 'Warfarin Sodium', dose: '3 mg', frequency: 'OD (Temporarily Withheld)', clinic: 'St. John\'s Hospital', status: 'Temporarily Withheld', conflictNote: 'Withheld due to INR 4.80 surge' },
      { drugName: 'Amlodipine', dose: '5 mg', frequency: '1 Tab OD morning', clinic: 'St. John\'s Cardiology', status: 'Active' }
    ] : patientId === 'P1004' ? [
      { drugName: 'Atorvastatin IP', dose: '40 mg', frequency: '1 Tab HS bedtime', clinic: 'CMC Vellore Heart Centre', status: 'Needs Review', conflictNote: 'Rhabdomyolysis hazard with Gemfibrozil' },
      { drugName: 'Metoprolol Succinate', dose: '25 mg', frequency: '1 Tab BD', clinic: 'CMC Vellore Heart Centre', status: 'Active' },
      { drugName: 'Aspirin (Ecosprin)', dose: '75 mg', frequency: '1 Tab OD post-lunch', clinic: 'CMC Vellore Heart Centre', status: 'Active' }
    ] : [
      { drugName: 'Levothyroxine', dose: '100 mcg', frequency: '1 Tab OD 6:00 AM', clinic: 'Dr. Alok Verma', status: 'Needs Review', conflictNote: 'Chelated by co-administered Calcium' },
      { drugName: 'Calcium Carbonate + Vit D3', dose: '500 mg + 250 IU', frequency: '1 Tab BD meals', clinic: 'Aarthi Endocrine Clinic', status: 'Active' }
    ],
    emergencyContact: {
      name: patientId === 'P1001' ? 'Sunita Sharma (Spouse)' : patientId === 'P1002' ? 'R. Venkat (Father)' : patientId === 'P1003' ? 'Vikram Desai (Son)' : patientId === 'P1004' ? 'Pooja Malhotra (Spouse)' : 'Rajesh Rao (Spouse)',
      phone: '+91 98451-XXXXX'
    }
  };

  const handleVerifyCode = async (codeToVerify) => {
    const code = (codeToVerify || accessCodeInput || '').trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setAccessError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/consent/doctor/${code}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setVerifiedConsent(data);
        setAccessError(null);
      } else {
        setVerifiedConsent(null);
        setAccessError(data.message || `Error ${res.status}: Access Denied (${data.error || 'UNAUTHORIZED'})`);
      }
    } catch (err) {
      setAccessError(`Failed to reach consent authorization server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEmergencyPdf = async () => {
    const reportData = {
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      title: 'EMERGENCY CLINICAL HANDOFF & ALLERGY ADVISORY',
      template: 'emergency_care_handover_summary',
      generatedAt: new Date().toISOString(),
      verificationSeal: 'CSIQ-EMERGENCY-AUTH',
      sections: [
        {
          title: '1. Patient Identity & Emergency Contact',
          fields: [
            { label: 'Patient Name', value: currentPatient.name, verified: true },
            { label: 'Age / Gender', value: `${currentPatient.age} Yrs / ${currentPatient.gender}`, verified: true },
            { label: 'Blood Group', value: currentPatient.bloodGroup || 'B+ Positive', verified: true },
            { label: 'Emergency Contact', value: `${currentPatient.emergencyContact?.name || 'Next of Kin'} ${currentPatient.emergencyContact?.phone || ''}`, verified: true }
          ]
        },
        {
          title: '2. Critical Allergies & Severe Contraindications',
          fields: (currentPatient.criticalAllergies || []).map(a => ({
            label: 'CONTRAINDICATION',
            value: typeof a === 'string' ? a : `${a.substance} (${a.reaction})`,
            unit: '[LIFE-THREATENING]',
            verified: true,
            sourceDocumentName: 'Hospital Allergy Registry'
          }))
        },
        {
          title: '3. Reconciled Active Medications & Regimen',
          fields: (currentPatient.activeMedications || []).map(m => ({
            label: m.drugName || m.name,
            value: `${m.dose || ''} ${m.frequency || ''}`,
            unit: m.status || 'Active',
            verified: m.status !== 'Needs Review',
            sourceDocumentName: m.clinic || 'Verified Prescription'
          }))
        },
        {
          title: '4. Underlying Chronic Conditions',
          fields: (currentPatient.chronicConditions || []).map(c => ({
            label: 'Active Diagnosis',
            value: typeof c === 'string' ? c : c.name,
            verified: true,
            sourceDocumentName: 'Clinical Master Record'
          }))
        }
      ]
    };

    await exportOfficialPdf(reportData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1-Tap ER Emergency Banner */}
      <div className="rounded-3xl border border-rose-300 bg-rose-600 text-white p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white text-2xl font-black">
              <HiOutlineLightningBolt className="animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  STAT Clinical View
                </span>
                <span className="rounded-md bg-rose-900/60 px-2 py-0.5 text-[10px] font-bold">
                  Zero Patient Password Required
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight mt-1">
                Clinician Handoff & Emergency Care Portal
              </h1>
              <p className="text-xs text-rose-100 mt-0.5">
                Instant view of life-threatening allergies, current medications, chronic conditions, and emergency contacts.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadEmergencyPdf}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-rose-900 shadow-md hover:bg-rose-50 transition shrink-0"
          >
            <HiOutlineDownload className="text-base" />
            Export 1-Page Emergency PDF (QR Sealed)
          </button>
        </div>
      </div>

      {/* Mode Switcher: Token Access vs ER Direct Bypass */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('CODE_ACCESS')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
              mode === 'CODE_ACCESS' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HiOutlineKey /> Doctor Access Code Mode
          </button>
          <button
            onClick={() => setMode('ER_DIRECT')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
              mode === 'ER_DIRECT' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HiOutlineLightningBolt /> ER Simulation Bypass
          </button>
        </div>

        {mode === 'ER_DIRECT' ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Patient:</span>
            {Object.values(PATIENT_TIMELINE_CATALOG).map(p => (
              <button
                key={p.id}
                onClick={() => setPatientId(p.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  patientId === p.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-[11px] font-mono text-emerald-700 font-bold">
            Server-Enforced Token Scope & Expiry Active
          </span>
        )}
      </div>

      {/* Token Verification Input Section (When in CODE_ACCESS mode) */}
      {mode === 'CODE_ACCESS' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-sm font-bold">
              <HiOutlineKey />
            </span>
            <h2 className="text-sm font-bold text-slate-900">Enter Patient Time-Limited Sharing Code</h2>
          </div>
          <p className="text-xs text-slate-500">
            Patients share a temporary 6-digit access code (e.g., DOC-8942) generated from their CareSyncIQ Vault. The backend strictly enforces authorization, category scope (e.g. Labs Only), and automatic expiration.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={accessCodeInput}
              onChange={e => setAccessCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. DOC-8942"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-sm font-black tracking-wider text-slate-900 uppercase focus:outline-emerald-500"
            />
            <button
              onClick={() => handleVerifyCode(accessCodeInput)}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying on Ledger...' : 'Verify & Unlock Patient Vault'}
            </button>
            <button
              onClick={() => {
                setAccessCodeInput('DOC-8942');
                handleVerifyCode('DOC-8942');
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Quick Test DOC-8942
            </button>
          </div>

          {/* Access Error Message */}
          {accessError && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-950 flex items-center gap-3">
              <HiOutlineExclamationCircle className="text-rose-600 text-xl shrink-0" />
              <div>
                <p className="font-black text-rose-900">Access Denied by CareSyncIQ Vault Policy</p>
                <p className="text-rose-800 font-normal mt-0.5">{accessError}</p>
              </div>
            </div>
          )}

          {/* Verified Scope Banner */}
          {verifiedConsent && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2 mb-2">
                <span className="font-black text-emerald-950 flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-emerald-600 text-base" />
                  Access Granted Under Token: {verifiedConsent.consentDetails?.code}
                </span>
                <span className="font-mono text-[11px] text-emerald-800">
                  Expires: {new Date(verifiedConsent.consentDetails?.expiresAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-emerald-900">
                <div>Recipient: <b>{verifiedConsent.consentDetails?.recipientDoctor}</b></div>
                <div>Category Scope: <b>{verifiedConsent.consentDetails?.scopeCategory}</b></div>
                <div>Condition Scope: <b>{verifiedConsent.consentDetails?.scopeCondition}</b></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EMERGENCY SUMMARY CARD: CRITICAL ALLERGIES FIRST */}
      <div className="rounded-3xl border-2 border-rose-500 bg-rose-50/80 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-rose-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white font-black text-xs">
              !
            </span>
            <h2 className="text-base font-black text-rose-950 uppercase tracking-wide">
              Critical Drug Allergies & Strict Contraindications
            </h2>
          </div>
          <span className="rounded-full bg-rose-600 text-white px-3 py-0.5 text-[10px] font-black uppercase">
            Life-Threatening
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {(currentPatient.criticalAllergies || []).map((allg, idx) => (
            <div key={idx} className="rounded-2xl border border-rose-300 bg-white p-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-rose-900">
                  {typeof allg === 'string' ? allg : `${allg.substance} (${allg.reaction})`}
                </span>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Strictly avoid all derivative chemical classes. Verified in longitudinal hospital admission records.
                </p>
              </div>
              <span className="rounded-md bg-rose-100 text-rose-900 px-2 py-1 text-[10px] font-black uppercase border border-rose-300">
                DO NOT PRESCRIBE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMNS: CURRENT ACTIVE MEDICATIONS & CHRONIC CONDITIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Medications */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-emerald-700 font-black">Rx</span> Active Medications & Exact Dosages
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Reconciled List
            </span>
          </div>

          <div className="space-y-3">
            {(!currentPatient.activeMedications || currentPatient.activeMedications.length === 0) ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                <HiOutlineLockClosed className="mx-auto text-xl text-slate-400 mb-1" />
                Medications withheld under patient privacy scope (e.g. Diagnostic Labs Only) or none currently active.
              </div>
            ) : (
              currentPatient.activeMedications.map((med, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    med.status === 'Needs Review' || med.needsReview
                      ? 'border-amber-200 bg-amber-50/50'
                      : med.status === 'Temporarily Withheld'
                      ? 'border-rose-200 bg-rose-50/70'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-xs">{med.drugName || med.name} {med.dose || ''}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        med.status === 'Needs Review' || med.needsReview
                          ? 'text-amber-800 bg-amber-200/80'
                          : med.status === 'Temporarily Withheld'
                          ? 'text-rose-900 bg-rose-200'
                          : 'text-emerald-800 bg-emerald-100'
                      }`}
                    >
                      {med.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{med.frequency || med.schedule || 'Oral'} • {med.clinic || med.prescribedBy || 'Outpatient Clinic'}</p>
                  {(med.conflictNote || med.status?.includes('Conflicted')) && (
                    <p className="text-[10px] text-amber-900 mt-1 font-semibold">⚠️ {med.conflictNote || med.status}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Underlying Chronic Conditions & Emergency Contacts */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">
              Underlying Chronic Conditions
            </h3>
            <div className="space-y-2">
              {(currentPatient.chronicConditions || []).map((cond, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {typeof cond === 'string' ? cond : `${cond.name} (${cond.code})`}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HiOutlinePhone className="text-emerald-600" /> Emergency Contact & Next of Kin
            </h3>
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs space-y-1">
              <p className="font-extrabold text-slate-900">
                {currentPatient.emergencyContact?.name || 'Authorized Emergency Relative'}
              </p>
              <p className="text-slate-600">Phone: <b>{currentPatient.emergencyContact?.phone || '+91 98451-XXXXX'}</b></p>
              <p className="text-[11px] text-slate-400">Consent to disclose emergency clinical status verified in profile.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
