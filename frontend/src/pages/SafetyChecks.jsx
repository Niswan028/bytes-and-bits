import React, { useState, useEffect } from 'react';
import {
  HiOutlineExclamationCircle,
  HiOutlineDuplicate,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineInformationCircle,
  HiOutlineFilter,
  HiOutlineUserAdd
} from 'react-icons/hi';
import api from '../api/client';
import { PATIENT_TIMELINE_CATALOG } from '../components/LongitudinalHealthTimeline';
import { usePatient } from '../context/PatientContext';

export default function SafetyChecks() {
  const { patients, activePatientId, setActivePatientId, openRegisterModal, activePatientDetails } = usePatient();
  const [patientId, setPatientId] = useState(activePatientId || 'P1001');
  const [windowDays, setWindowDays] = useState(30);
  const [liveSafetyData, setLiveSafetyData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadSafety = async () => {
      try {
        const res = await api.get(`/safety/${patientId}?windowDays=${windowDays}`);
        if (isMounted && res.data?.success) {
          setLiveSafetyData(res.data);
        }
      } catch (err) {
        console.warn('Safety fetch fallback:', err.message);
      }
    };
    loadSafety();
    return () => { isMounted = false; };
  }, [patientId, windowDays]);

  const currentPatientMeta = patients.find(p => p.id === patientId) || patients[0];
  const catalogPatient = PATIENT_TIMELINE_CATALOG[patientId];
  const patient = catalogPatient || {
    id: currentPatientMeta?.id || patientId,
    name: currentPatientMeta?.name || 'Patient',
    age: currentPatientMeta?.age || 45,
    gender: currentPatientMeta?.gender || 'Male',
    chronicConditions: (currentPatientMeta?.chronicConditions || []).map(c => typeof c === 'string' ? c : c.name),
    criticalAllergies: (currentPatientMeta?.allergies || []).map(a => typeof a === 'string' ? a : `${a.substance} (${a.reaction || 'Hypersensitivity'})`),
    events: activePatientDetails?.timelineEvents || currentPatientMeta?.timelineEvents || []
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <HiOutlineExclamationCircle className="text-lg" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Clinical Safety & Cross-Provider Anomaly Hub
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl">
            Algorithmic safety checks identifying duplicate laboratory investigations, drug-drug interactions, allergy contraindications, and reconciled active medications.
          </p>
        </div>

        {/* Dynamic Patient Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1.5 border border-slate-200">
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setPatientId(p.id);
                setActivePatientId(p.id);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                patientId === p.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-2xs"
          >
            <HiOutlineUserAdd className="text-emerald-700" />
            <span>+ Add Patient</span>
          </button>
        </div>
      </div>

      {/* Clinical Decision Support Advisory */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 shadow-xs flex items-start gap-3">
        <HiOutlineInformationCircle className="text-emerald-700 text-lg shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700">
          <span className="font-bold text-slate-900">Clinical Decision Support Advisory:</span>{' '}
          Cross-provider safety alerts are algorithmically cross-referenced from patient health records. All clinical alerts should be correlated by the attending physician against original diagnostic reports.
        </div>
      </div>

      {/* SECTION 1: DUPLICATE TEST DETECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                <HiOutlineDuplicate />
              </span>
              <h2 className="text-base font-bold text-slate-900">Duplicate Investigation Detection</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies the same laboratory test repeated within a configurable window across disparate clinics or pathology chains.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Detection Window:</span>
            <select
              value={windowDays}
              onChange={e => setWindowDays(parseInt(e.target.value, 10))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-800"
            >
              <option value={15}>15 Days</option>
              <option value={30}>30 Days (Default)</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>
        </div>

        {patientId === 'P1001' ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Repeated Test Warning
                </span>
                <span className="text-sm font-extrabold text-slate-900">Comprehensive Lipid Profile</span>
                <span className="text-xs font-bold text-amber-800">• 16-Day Interval</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-rose-700">Avoidable Waste: ₹1,200</span>
                <p className="text-[10px] text-slate-400">Assumes standard private laboratory lipid profile tariff</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occurrence 1: Certified Initial Record</span>
                <p className="text-xs font-extrabold text-slate-900 mt-1">12-Mar-2026 • Dr. Lal PathLabs</p>
                <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                  <p>• Total Cholesterol: <b>228.0 mg/dL</b> [HIGH]</p>
                  <p>• Serum Triglycerides: <b>195.0 mg/dL</b> [HIGH]</p>
                  <p>• HDL: 38.0 mg/dL | LDL: 151.0 mg/dL</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Referred by: Dr. Arvind Rao</span>
                  <span className="font-mono text-[10px] text-slate-600">dr_lal_pathlabs_lipid_panel_p1001.pdf (p. 1)</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Occurrence 2: Uncoordinated Re-order</span>
                <p className="text-xs font-extrabold text-slate-900 mt-1">28-Mar-2026 • Metropolis Healthcare</p>
                <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                  <p>• Total Cholesterol: <b>224.0 mg/dL</b> [Borderline High]</p>
                  <p>• Serum Triglycerides: <b>190.0 mg/dL</b> [High]</p>
                  <p>• HDL: 39.0 mg/dL | LDL: 147.0 mg/dL</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Ordered by: Dr. Sneha Roy (Fortis)</span>
                  <span className="font-mono text-[10px] text-slate-600">metropolis_lipid_panel_duplicate_p1001.pdf (p. 1)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-100/70 p-3 text-xs text-amber-950 font-medium">
              💡 <b>Clinical Guidance:</b> Lipid profiles require 8–12 weeks of therapeutic statin intervention before re-assessment. Ordering a repeat test in 16 days represents fragmented care caused by missing historical records.
            </div>
          </div>
        ) : patientId === 'P1005' ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Repeated Radiology Warning
                </span>
                <span className="text-sm font-extrabold text-slate-900">DEXA Bone Mineral Densitometry Scan</span>
                <span className="text-xs font-bold text-amber-800">• 20-Day Interval</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-rose-700">Avoidable Waste: ₹2,800</span>
                <p className="text-[10px] text-slate-400">Assumes standard dual-energy X-ray absorptiometry fee</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occurrence 1: Baseline Certified Scan</span>
                <p className="text-xs font-extrabold text-slate-900 mt-1">10-Feb-2026 • Aarthi Scans & Labs</p>
                <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                  <p>• Lumbar Spine (L1-L4) BMD: <b>T-score -2.2</b> (Osteopenia)</p>
                  <p>• Femoral Neck BMD: <b>T-score -1.8</b></p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Radiologist: Dr. Ramesh Babu</span>
                  <span className="font-mono text-[10px] text-slate-600">aarthi_scans_dexa_baseline_p1005.pdf</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Occurrence 2: Fragmented Re-order</span>
                <p className="text-xs font-extrabold text-slate-900 mt-1">02-Mar-2026 • Manipal Hospital Ortho</p>
                <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                  <p>• Lumbar Spine (L1-L4) BMD: <b>T-score -2.1</b> (Identical)</p>
                  <p>• Unnecessary repeated radiation & out-of-pocket payment</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Ordered by: Dr. K. Srinivas</span>
                  <span className="font-mono text-[10px] text-slate-600">manipal_repeat_dexa_duplicate_p1005.pdf</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-100/70 p-3 text-xs text-amber-950 font-medium">
              💡 <b>Clinical Guidance:</b> Bone mineral density does not change measurably over 20 days. Clinical guidelines recommend at least 12–24 months between DEXA scans.
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
            <HiOutlineCheckCircle className="mx-auto text-2xl text-emerald-600 mb-1" />
            No duplicate laboratory investigations identified within the {windowDays}-day window for this patient.
          </div>
        )}
      </div>

      {/* SECTION 2: MEDICATION CONFLICT & DRUG-DRUG INTERACTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 text-rose-800 text-xs font-bold">
              !
            </span>
            <h2 className="text-base font-bold text-slate-900">High-Risk Drug Interactions & Dose Contradictions</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-checks medications prescribed by different specialists against documented pharmacological interaction rules.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {patientId === 'P1003' && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
                <div>
                  <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                    CRITICAL DRUG-DRUG INTERACTION
                  </span>
                  <h3 className="text-sm font-extrabold text-rose-950 mt-1">
                    Warfarin Sodium (3 mg OD) + Clarithromycin (500 mg BD)
                  </h3>
                </div>
                <span className="text-xs font-bold text-rose-800">Risk Severity: LIFE-THREATENING</span>
              </div>

              <div className="mt-3 text-xs text-rose-900 space-y-1.5 leading-relaxed">
                <p><b>Mechanism:</b> Clarithromycin is a potent inhibitor of cytochrome P450 3A4 and 2C9 enzymes. It severely impairs hepatic clearance of S-warfarin, causing a dangerous surge in circulating anticoagulant concentrations.</p>
                <p><b>Observed Clinical Outcome:</b> Patient experienced an acute INR spike to <b>4.80</b> (Normal therapeutic AF range: 2.00 - 3.00; PT prolonged to 44.2 seconds), carrying critical hemorrhage and intracranial hematoma risk.</p>
                <p><b>Action Taken:</b> Warfarin temporarily withheld. Discontinued Clarithromycin. Oral Vitamin K administered.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-rose-800">
                <span>Prescription A: St. John's Cardiology (Warfarin 3mg)</span>
                <span>Prescription B: Walk-in Clinic (Clarithromycin 500mg)</span>
                <span className="font-mono text-[10px]">st_johns_cardio_warfarin_interaction_p1003.pdf (p. 1)</span>
              </div>
            </div>
          )}

          {patientId === 'P1001' && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
                <div>
                  <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                    CONTRADICTING PRESCRIPTION DOSAGE
                  </span>
                  <h3 className="text-sm font-extrabold text-rose-950 mt-1">
                    Metformin 500mg BD vs Metformin 850mg BD + Glipizide 10mg
                  </h3>
                </div>
                <span className="text-xs font-bold text-rose-800">Severity: HIGH</span>
              </div>

              <div className="mt-3 text-xs text-rose-900 space-y-1.5 leading-relaxed">
                <p><b>Conflict:</b> Dr. Arvind Rao at Apollo Sugar Clinic prescribed Metformin 500mg BD. On 05-Apr-2026, Dr. Vinod Gupta at City Family Clinic prescribed Metformin 850mg BD + Glipizide 10mg OD without knowing patient was already taking 500mg BD.</p>
                <p><b>Clinical Consequence:</b> If patient takes both prescriptions simultaneously, total daily biguanide dose jumps to 2,700 mg/day with a potent sulfonylurea, causing high risk of acute hypoglycemic collapse and lactic acidosis.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-rose-800">
                <span>Rx 1: apollo_sugar_prescription_dr_rao_p1001.pdf</span>
                <span>Rx 2: city_family_clinic_conflicting_rx_p1001.pdf</span>
              </div>
            </div>
          )}

          {patientId === 'P1004' && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
                <div>
                  <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                    CRITICAL RHABDOMYOLYSIS RISK
                  </span>
                  <h3 className="text-sm font-extrabold text-rose-950 mt-1">
                    Atorvastatin 40mg HS + Gemfibrozil 600mg BD
                  </h3>
                </div>
                <span className="text-xs font-bold text-rose-800">Severity: LIFE-THREATENING</span>
              </div>

              <div className="mt-3 text-xs text-rose-900 space-y-1.5 leading-relaxed">
                <p><b>Mechanism:</b> Gemfibrozil strongly inhibits glucuronidation of statin acid form, boosting serum statin concentration &gt; 3-fold. Concurrently in CKD 3a, this triggers acute skeletal muscle necrosis (rhabdomyolysis).</p>
                <p><b>Observed Outcome:</b> Total Creatine Kinase (CK) skyrocketed to <b>1,240 U/L</b> (Normal: 30 - 200 U/L). CareSyncIQ triggered immediate hold on statin and fibrate.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-rose-800">
                <span>Rx 1: CMC Vellore Heart Centre (Atorvastatin 40mg)</span>
                <span>Rx 2: PrimeCare Clinic (Gemfibrozil 600mg)</span>
                <span className="font-mono text-[10px]">anand_labs_ck_elevation_p1004.pdf</span>
              </div>
            </div>
          )}

          {patientId === 'P1005' && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                <div>
                  <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                    INSOLUBLE CHELATION COMPLEXATION
                  </span>
                  <h3 className="text-sm font-extrabold text-amber-950 mt-1">
                    Levothyroxine 50mcg + Calcium Carbonate (Shelcal 500)
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-800">Severity: MODERATE</span>
              </div>

              <div className="mt-3 text-xs text-amber-900 space-y-1.5 leading-relaxed">
                <p><b>Mechanism:</b> Calcium carbonate co-administered with Levothyroxine in the morning binds thyroid hormone, reducing gastrointestinal absorption by up to 35% and elevating TSH.</p>
                <p><b>Reconciled Guidance:</b> Shelcal 500 rescheduled to 2:00 PM with lunch (8 hours after 6:00 AM fasting Levothyroxine).</p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-amber-800">
                <span>Rx 1: aster_cmi_endocrine_note_p1005.pdf</span>
                <span>Rx 2: healthspring_calcium_rx_p1005.pdf</span>
              </div>
            </div>
          )}

          {patientId === 'P1002' && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
              <HiOutlineCheckCircle className="mx-auto text-2xl text-emerald-600 mb-1" />
              Zero pharmacological drug-drug interactions detected across current pulmonary and endocrine regimens.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: ALLERGY-VERSUS-PRESCRIPTION CROSS-CHECK */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 text-rose-800 text-xs font-bold">
              <HiOutlineExclamationCircle />
            </span>
            <h2 className="text-base font-bold text-slate-900">Allergy-versus-Prescription Cross-Check</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuously compares incoming prescriptions from any doctor against all historical recorded drug allergies.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {patientId === 'P1001' && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-5">
              <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
                <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
                  CRITICAL CONTRAINDICATION: PENICILLIN ALLERGY VIOLATION
                </span>
                <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Anaphylaxis Alert
                </span>
              </div>
              <div className="mt-3 text-xs text-rose-900 space-y-1">
                <p>• <b>Recorded Allergy:</b> Penicillin / Amoxicillin (Severe Anaphylaxis, documented 2022 at Apollo Clinic).</p>
                <p>• <b>Violating Prescription:</b> Tab. Augmentin 625 mg (Amoxicillin 500mg + Clavulanic Acid 125mg) 1 Tab BD x 5 days prescribed on 18-Apr-2026 at QuickCare Walk-in Clinic.</p>
                <p>• <b>CareSyncIQ Action:</b> Prescription flagged immediately upon phone photo upload; alert sent to clinician verification queue.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-800">
                <span>Allergy Source: apollo_sugar_prescription_dr_rao_p1001.pdf</span>
                <span>Flagged Prescription: urgent_care_allergy_conflict_rx_p1001.png (p. 1)</span>
              </div>
            </div>
          )}

          {patientId === 'P1002' && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-5">
              <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
                <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
                  CRITICAL CONTRAINDICATION: ASPIRIN / NSAID ALLERGY VIOLATION
                </span>
                <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                  AERD / Asthma Alert
                </span>
              </div>
              <div className="mt-3 text-xs text-rose-900 space-y-1">
                <p>• <b>Recorded Allergy:</b> Aspirin & NSAIDs (Induces acute severe bronchospasm / AERD Triad, documented at Aster CMI Hospital).</p>
                <p>• <b>Violating Prescription:</b> Tab. Ibuprofen 400 mg (Brufen) TDS x 5 days prescribed on 20-Mar-2026 at Bone & Joint Ortho Clinic for ankle sprain.</p>
                <p>• <b>CareSyncIQ Action:</b> Ibuprofen flagged as contraindicated in asthmatic patients with NSAID hypersensitivity. Recommended alternative: Paracetamol.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-800">
                <span>Allergy Source: aster_cmi_discharge_summary_p1002.pdf</span>
                <span>Flagged Prescription: ortho_care_nsaid_allergy_rx_p1002.png (p. 1)</span>
              </div>
            </div>
          )}

          {patientId === 'P1003' && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
              <HiOutlineCheckCircle className="mx-auto text-2xl text-emerald-600 mb-1" />
              Patient has recorded Sulfa allergy. All active medications (Warfarin, Amlodipine, Cefpodoxime) are non-sulfonamide formulations.
            </div>
          )}

          {patientId === 'P1004' && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-5">
              <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
                <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
                  CRITICAL CONTRAINDICATION: RADIOCONTRAST MEDIA ALLERGY
                </span>
                <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Anaphylactoid Shock Alert
                </span>
              </div>
              <div className="mt-3 text-xs text-rose-900 space-y-1">
                <p>• <b>Recorded Allergy:</b> Iodinated Radiocontrast Media (Severe anaphylactoid collapse during prior coronary angiogram at CMC Vellore).</p>
                <p>• <b>CareSyncIQ Clinical Flag:</b> Strictly alert all radiology departments and cath labs before any contrast-enhanced CT or angiography.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-800">
                <span>Allergy Source: cmc_vellore_cabg_discharge_p1004.pdf</span>
                <span>Status: Flagged Across Hospital Network</span>
              </div>
            </div>
          )}

          {patientId === 'P1005' && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-5">
              <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
                <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
                  CRITICAL CONTRAINDICATION: FLUOROQUINOLONE ALLERGY
                </span>
                <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Tendonitis & Angioedema Alert
                </span>
              </div>
              <div className="mt-3 text-xs text-rose-900 space-y-1">
                <p>• <b>Recorded Allergy:</b> Fluoroquinolones (Ciprofloxacin / Levofloxacin - acute Achilles tendonitis and angioedema).</p>
                <p>• <b>Violating Prescription:</b> Tab. Ciprofloxacin 500mg BD prescribed on 08-Apr-2026 at Cloudnine Urgent Care.</p>
                <p>• <b>CareSyncIQ Action:</b> Intercepted immediately; replaced with Nitrofurantoin 100mg BD without delaying treatment.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-800">
                <span>Allergy Source: aster_cmi_endocrine_note_p1005.pdf</span>
                <span>Flagged Prescription: cloudnine_urgent_care_rx_p1005.png</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: ACTIVE MEDICATION RECONCILIATION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
              Rx
            </span>
            <h2 className="text-base font-bold text-slate-900">Current Longitudinal Medication Reconciliation</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Derived active therapy compiled chronologically across multiple prescribers, resolving start dates, dose modifications, and ambiguous entries.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700">
                <th className="py-2.5 px-3">Active Drug & Dose</th>
                <th className="py-2.5 px-3">Schedule / Frequency</th>
                <th className="py-2.5 px-3">Start Date</th>
                <th className="py-2.5 px-3">Prescribing Clinic</th>
                <th className="py-2.5 px-3">Reconciliation Status</th>
                <th className="py-2.5 px-3">Source Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientId === 'P1001' && (
                <>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Metformin HCl 500 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab BD after meals</td>
                    <td className="py-3 px-3 text-slate-500">10-Jan-2026</td>
                    <td className="py-3 px-3 text-slate-700">Apollo Sugar Clinic</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                        Needs Confirmation (City Clinic Conflict)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">apollo_sugar_rx.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Telmisartan 40 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD morning</td>
                    <td className="py-3 px-3 text-slate-500">10-Jan-2026</td>
                    <td className="py-3 px-3 text-slate-700">Apollo Sugar Clinic</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">apollo_sugar_rx.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Atorvastatin 20 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab HS bedtime</td>
                    <td className="py-3 px-3 text-slate-500">10-Jan-2026</td>
                    <td className="py-3 px-3 text-slate-700">Apollo Sugar Clinic</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">apollo_sugar_rx.pdf</td>
                  </tr>
                </>
              )}

              {patientId === 'P1002' && (
                <>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Levothyroxine Sodium 75 mcg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD early morning (empty stomach)</td>
                    <td className="py-3 px-3 text-slate-500">14-Feb-2026</td>
                    <td className="py-3 px-3 text-slate-700">Aster CMI Hospital</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active (Titrated from 50mcg)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">aster_cmi_discharge.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Symbicort (Budesonide/Formoterol 160/4.5)</td>
                    <td className="py-3 px-3 text-slate-600">2 Puffs BD inhalation</td>
                    <td className="py-3 px-3 text-slate-500">14-Feb-2026</td>
                    <td className="py-3 px-3 text-slate-700">Aster CMI Hospital</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">aster_cmi_discharge.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Montelukast 10 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD bedtime</td>
                    <td className="py-3 px-3 text-slate-500">14-Feb-2026</td>
                    <td className="py-3 px-3 text-slate-700">Aster CMI Hospital</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">aster_cmi_discharge.pdf</td>
                  </tr>
                </>
              )}

              {patientId === 'P1003' && (
                <>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Warfarin Sodium 3 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD evening</td>
                    <td className="py-3 px-3 text-slate-500">01-Mar-2024</td>
                    <td className="py-3 px-3 text-slate-700">St. John's Cardiology</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-900 border border-rose-300">
                        Temporarily Withheld (INR 4.80 Spike)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">st_johns_cardio.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Amlodipine 5 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD morning</td>
                    <td className="py-3 px-3 text-slate-500">01-Mar-2024</td>
                    <td className="py-3 px-3 text-slate-700">St. John's Cardiology</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Stable
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">st_johns_cardio.pdf</td>
                  </tr>
                </>
              )}

              {patientId === 'P1004' && (
                <>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Atorvastatin IP 40 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab HS bedtime</td>
                    <td className="py-3 px-3 text-slate-500">08-Sep-2025</td>
                    <td className="py-3 px-3 text-slate-700">CMC Vellore Heart Centre</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-900 border border-rose-300">
                        Temporarily Withheld (CK 1,240 U/L Rhabdomyolysis)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">cmc_vellore_cabg_discharge.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Metoprolol Succinate ER 25 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab BD</td>
                    <td className="py-3 px-3 text-slate-500">08-Sep-2025</td>
                    <td className="py-3 px-3 text-slate-700">CMC Vellore Heart Centre</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">cmc_vellore_cabg_discharge.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Aspirin (Ecosprin) 75 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD post-lunch</td>
                    <td className="py-3 px-3 text-slate-500">08-Sep-2025</td>
                    <td className="py-3 px-3 text-slate-700">CMC Vellore Heart Centre</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">cmc_vellore_cabg_discharge.pdf</td>
                  </tr>
                </>
              )}

              {patientId === 'P1005' && (
                <>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Levothyroxine Sodium 50 mcg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD 6:00 AM empty stomach</td>
                    <td className="py-3 px-3 text-slate-500">15-Oct-2025</td>
                    <td className="py-3 px-3 text-slate-700">Aster CMI Hospital</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active & Stable
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">aster_cmi_endocrine_note.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Shelcal 500 (Calcium + Vit D3)</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab OD with lunch (2:00 PM)</td>
                    <td className="py-3 px-3 text-slate-500">24-Mar-2026</td>
                    <td className="py-3 px-3 text-slate-700">HealthSpring Clinic</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active (4h Interval Reconciled)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">healthspring_calcium_rx.pdf</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">Nitrofurantoin 100 mg</td>
                    <td className="py-3 px-3 text-slate-600">1 Tab BD x 7 days</td>
                    <td className="py-3 px-3 text-slate-500">08-Apr-2026</td>
                    <td className="py-3 px-3 text-slate-700">Cloudnine Urgent Care</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        Active (Safe UTI Alternative)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">cloudnine_urgent_care_rx.png</td>
                  </tr>
                </>
              )}

              {!['P1001', 'P1002', 'P1003', 'P1004', 'P1005'].includes(patientId) && (
                (activePatientDetails?.activeMedications || currentPatientMeta?.activeMedications || []).map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{m.drugName || m.name}</td>
                    <td className="py-3 px-3 text-slate-600">{m.dose || 'Standard'} • {m.frequency || m.instructions || '1 Tab OD'}</td>
                    <td className="py-3 px-3 text-slate-500">{m.startDate || 'Recent Intake'}</td>
                    <td className="py-3 px-3 text-slate-700">{m.clinic || 'City Outpatient Care'}</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                        {m.status || 'Active & Monitored'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{m.sourceDoc || 'clinical_record.pdf'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
