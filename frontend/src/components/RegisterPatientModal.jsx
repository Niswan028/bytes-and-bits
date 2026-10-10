import React, { useState } from 'react';
import {
  HiOutlineUserAdd,
  HiOutlineX,
  HiOutlineIdentification,
  HiOutlineHeart,
  HiOutlineExclamationCircle,
  HiOutlineDocumentText,
  HiOutlineOfficeBuilding,
  HiOutlineCheck,
  HiOutlineSparkles
} from 'react-icons/hi';
import { usePatient } from '../context/PatientContext';

const COMMON_CONDITIONS = [
  'Type 2 Diabetes Mellitus',
  'Essential Hypertension',
  'Bronchial Asthma',
  'Primary Hypothyroidism',
  'Chronic Kidney Disease (CKD)',
  'Coronary Artery Disease (CAD)',
  'Chronic Obstructive Pulmonary Disease (COPD)',
  'Atrial Fibrillation',
  'Osteopenia / Osteoporosis'
];

const COMMON_ALLERGIES = [
  { substance: 'Penicillin / Amoxicillin', reaction: 'Severe Anaphylaxis / Angioedema', severity: 'Life-Threatening' },
  { substance: 'Aspirin / NSAIDs', reaction: 'Severe Acute Bronchospasm (AERD)', severity: 'Critical' },
  { substance: 'Sulfa Drugs (Sulfamethoxazole)', reaction: 'Stevens-Johnson / Severe Rash', severity: 'High' },
  { substance: 'Radiocontrast Media', reaction: 'Anaphylactoid Shock', severity: 'Life-Threatening' },
  { substance: 'Fluoroquinolones (Ciprofloxacin)', reaction: 'Acute Tendinitis & Angioedema', severity: 'Critical' }
];

const PRESET_SAMPLE_PATIENT = {
  name: 'Ramesh Patel',
  age: 64,
  gender: 'Male',
  dob: '1962-05-14',
  bloodGroup: 'O+',
  phone: '+91 98452-91024',
  abhaAddress: 'ramesh.patel.64@abdm',
  emergencyContactName: 'Kavita Patel (Daughter)',
  emergencyContactPhone: '+91 98452-91025',
  chronicConditions: ['Chronic Obstructive Pulmonary Disease (COPD)', 'Essential Hypertension'],
  allergies: [
    { substance: 'Penicillin / Amoxicillin', reaction: 'Severe Anaphylaxis / Angioedema', severity: 'Life-Threatening' }
  ],
  medications: [
    { drugName: 'Formoterol Fumarate', dose: '12 mcg', frequency: '1 Inhalation BD', doctor: 'Dr. S. K. Nair' },
    { drugName: 'Amlodipine Besylate', dose: '5 mg', frequency: '1 Tab OD morning', doctor: 'Dr. S. K. Nair' }
  ],
  primaryClinic: 'City Multi-Specialty Hospital',
  primaryDoctor: 'Dr. S. K. Nair (Senior Pulmonologist)'
};

export default function RegisterPatientModal() {
  const { isRegisterModalOpen, closeRegisterModal, registerPatient } = usePatient();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'B+',
    phone: '',
    abhaAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    chronicConditions: [],
    customCondition: '',
    allergies: [],
    medications: [
      { drugName: '', dose: '', frequency: '1 Tab OD', doctor: '' }
    ],
    primaryClinic: 'City Multi-Specialty Clinic',
    primaryDoctor: 'Dr. Attending Physician (MD)'
  });

  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  if (!isRegisterModalOpen) return null;

  const handleToggleCondition = (cond) => {
    setFormData(prev => {
      const exists = prev.chronicConditions.includes(cond);
      return {
        ...prev,
        chronicConditions: exists
          ? prev.chronicConditions.filter(c => c !== cond)
          : [...prev.chronicConditions, cond]
      };
    });
  };

  const handleAddCustomCondition = () => {
    if (!formData.customCondition.trim()) return;
    if (!formData.chronicConditions.includes(formData.customCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, prev.customCondition.trim()],
        customCondition: ''
      }));
    }
  };

  const handleToggleAllergy = (allergyItem) => {
    setFormData(prev => {
      const exists = prev.allergies.some(a => a.substance === allergyItem.substance);
      return {
        ...prev,
        allergies: exists
          ? prev.allergies.filter(a => a.substance !== allergyItem.substance)
          : [...prev.allergies, allergyItem]
      };
    });
  };

  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.medications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, medications: updated };
    });
  };

  const handleAddMedicationRow = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { drugName: '', dose: '', frequency: '1 Tab OD', doctor: '' }]
    }));
  };

  const handleRemoveMedicationRow = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleLoadSample = () => {
    setFormData({
      ...PRESET_SAMPLE_PATIENT,
      customCondition: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        age: parseInt(formData.age, 10) || 45,
        gender: formData.gender,
        dob: formData.dob || undefined,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone || '+91 98000-00000',
        abhaAddress: formData.abhaAddress || undefined,
        emergencyContact: {
          name: formData.emergencyContactName || 'Emergency Family Contact',
          relation: 'Next of Kin',
          phone: formData.emergencyContactPhone || formData.phone || '+91 98000-00000'
        },
        chronicConditions: formData.chronicConditions,
        allergies: formData.allergies,
        activeMedications: formData.medications.filter(m => m.drugName.trim()),
        primaryClinic: formData.primaryClinic,
        primaryDoctor: formData.primaryDoctor
      };

      const newPatient = await registerPatient(payload);
      setSuccessNotice(`Patient ${newPatient.name} registered with UHID ${newPatient.id}! Opening chart...`);

      setTimeout(() => {
        setSuccessNotice(null);
        closeRegisterModal();
      }, 1200);
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <HiOutlineUserAdd className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  Register New Patient Chart
                </h2>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300">
                  OPD & Clinic Intake
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate a unified longitudinal health record with ABDM ABHA identifier and automated safety tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-xs"
              title="Auto-fill realistic clinical scenario for instant testing"
            >
              <HiOutlineSparkles className="text-amber-600" />
              <span>1-Click Sample Intake</span>
            </button>

            <button
              type="button"
              onClick={closeRegisterModal}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label="Close modal"
            >
              <HiOutlineX className="text-xl" />
            </button>
          </div>
        </div>

        {successNotice && (
          <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-bounce">
            <HiOutlineCheck className="text-emerald-700 text-base" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section 1: Demographics */}
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
              <HiOutlineIdentification className="text-emerald-700 text-base" />
              <span>1. Patient Demographics & ABHA Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="e.g. 64"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98450-XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ABHA Address / Health ID (Optional - auto-generated if left blank)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ramesh.patel@abdm"
                  value={formData.abhaAddress}
                  onChange={(e) => setFormData({ ...formData, abhaAddress: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Chronic Conditions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                <HiOutlineHeart className="text-emerald-700 text-base" />
                <span>2. Chronic Diagnoses & Clinical Conditions</span>
              </div>
              <span className="text-[10px] text-slate-400">Click to select conditions</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {COMMON_CONDITIONS.map(cond => {
                const active = formData.chronicConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleToggleCondition(cond)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold transition flex items-center gap-1.5 ${
                      active
                        ? 'border border-emerald-400 bg-emerald-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {active && <HiOutlineCheck className="text-xs" />}
                    <span>{cond}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add other custom chronic diagnosis..."
                value={formData.customCondition}
                onChange={(e) => setFormData({ ...formData, customCondition: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCondition(); } }}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomCondition}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Section 3: Critical Allergies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                <HiOutlineExclamationCircle className="text-rose-600 text-base" />
                <span>3. Critical Drug Hypersensitivities & Allergies</span>
              </div>
              <span className="text-[10px] text-rose-500 font-bold">Cross-checked by Safety Engine</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {COMMON_ALLERGIES.map(allg => {
                const active = formData.allergies.some(a => a.substance === allg.substance);
                return (
                  <button
                    key={allg.substance}
                    type="button"
                    onClick={() => handleToggleAllergy(allg)}
                    className={`text-left rounded-xl p-2.5 text-xs font-bold transition border ${
                      active
                        ? 'border-rose-400 bg-rose-50 text-rose-950 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">{allg.substance}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                        active ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {allg.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">{allg.reaction}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Current Medications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                <HiOutlineDocumentText className="text-emerald-700 text-base" />
                <span>4. Baseline Active Medications</span>
              </div>
              <button
                type="button"
                onClick={handleAddMedicationRow}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                + Add Medication
              </button>
            </div>

            <div className="space-y-2">
              {formData.medications.map((med, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
                  <input
                    type="text"
                    placeholder="Drug Name (e.g. Metformin)"
                    value={med.drugName}
                    onChange={(e) => handleMedicationChange(idx, 'drugName', e.target.value)}
                    className="flex-2 min-w-[140px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Dose (e.g. 500 mg)"
                    value={med.dose}
                    onChange={(e) => handleMedicationChange(idx, 'dose', e.target.value)}
                    className="flex-1 min-w-[90px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g. 1 Tab BD)"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(idx, 'frequency', e.target.value)}
                    className="flex-1 min-w-[100px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                  />
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicationRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      aria-label="Remove medication"
                    >
                      <HiOutlineX className="text-base" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Primary Facility & Attending Physician */}
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              <HiOutlineOfficeBuilding className="text-emerald-700 text-base" />
              <span>5. Primary Care Facility & Doctor</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Primary Clinic / Hospital
                </label>
                <input
                  type="text"
                  value={formData.primaryClinic}
                  onChange={(e) => setFormData({ ...formData, primaryClinic: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Attending Physician
                </label>
                <input
                  type="text"
                  value={formData.primaryDoctor}
                  onChange={(e) => setFormData({ ...formData, primaryDoctor: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={closeRegisterModal}
              disabled={submitting}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !formData.name.trim()}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400 bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Registering Chart...</span>
                </>
              ) : (
                <>
                  <HiOutlineCheck className="text-base" />
                  <span>Register & Open Patient Chart</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
