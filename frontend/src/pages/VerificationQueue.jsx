import React, { useState } from 'react';
import {
  HiOutlineClipboardCheck,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlinePencilAlt
} from 'react-icons/hi';

const INITIAL_QUEUE = [
  {
    id: 'vq-001',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentName: 'urgent_care_allergy_conflict_rx_p1001.png',
    pageNumber: 1,
    fieldLabel: 'Prescribed Antibiotic Formulation',
    extractedValue: 'Tab. Augmentin 625 mg (Amoxicillin 500mg + Clavulanic Acid 125mg)',
    ocrConfidence: 0.72,
    detectionReason: 'Phone camera capture with tilt & handwritten script. Direct conflict with recorded penicillin allergy.',
    status: 'NEEDS_REVIEW',
    verifiedBy: null,
    registrationNo: null,
    verifiedAt: null
  },
  {
    id: 'vq-002',
    patientId: 'P1002',
    patientName: 'Priya Venkat',
    documentName: 'ortho_care_nsaid_allergy_rx_p1002.png',
    pageNumber: 1,
    fieldLabel: 'Analgesic Prescription & Dosage',
    extractedValue: 'Tab. Ibuprofen 400 mg TDS',
    ocrConfidence: 0.68,
    detectionReason: 'Handwritten script with low stroke contrast. Contradicts asthma allergy profile.',
    status: 'NEEDS_REVIEW',
    verifiedBy: null,
    registrationNo: null,
    verifiedAt: null
  },
  {
    id: 'vq-003',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentName: 'city_family_clinic_conflicting_rx_p1001.pdf',
    pageNumber: 1,
    fieldLabel: 'Second-Line Oral Hypoglycemic Dose',
    extractedValue: 'Tab. Metformin Extended Release 850 mg BD',
    ocrConfidence: 0.88,
    detectionReason: 'Biguanide dose escalation contradiction against Apollo Sugar Clinic record.',
    status: 'VERIFIED',
    verifiedBy: 'Dr. Arvind Rao',
    registrationNo: 'KMC-38192',
    verifiedAt: '2026-04-06 10:30'
  }
];

export default function VerificationQueue() {
  const [items, setItems] = useState(INITIAL_QUEUE);
  const [selectedItem, setSelectedItem] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Arvind Rao');
  const [regNo, setRegNo] = useState('KMC-38192');
  const [correction, setCorrection] = useState('');

  const handleSignOff = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setItems(items.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          status: 'VERIFIED',
          verifiedBy: doctorName,
          registrationNo: regNo,
          verifiedAt: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN'),
          extractedValue: correction || item.extractedValue
        };
      }
      return item;
    }));

    setSelectedItem(null);
    setCorrection('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 text-2xl font-bold">
            <HiOutlineClipboardCheck />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Clinician Verification & Human-in-the-Loop Sign-off Queue
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tesseract OCR is inherently weaker on doctor handwriting. Any low-confidence extraction (&lt; 85%) or phone camera scan is routed here for licensed clinician verification. Never silently guess a value.
            </p>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {items.map(item => {
          const isNeedsReview = item.status === 'NEEDS_REVIEW';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition shadow-xs ${
                isNeedsReview ? 'border-amber-300 bg-amber-50/40' : 'border-emerald-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">{item.patientName}</span>
                  <span className="text-xs text-slate-400">({item.patientId})</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-[11px] text-slate-600">{item.documentName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-bold">
                    OCR Confidence: <span className={item.ocrConfidence < 0.75 ? 'text-amber-800' : 'text-emerald-700'}>{(item.ocrConfidence * 100).toFixed(0)}%</span>
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                    isNeedsReview
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                  }`}>
                    {item.status === 'NEEDS_REVIEW' ? 'Needs Review' : 'Verified'}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Extracted Clinical Field</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{item.fieldLabel}</p>
                  <p className="text-xs font-mono text-slate-900 mt-1 bg-white p-2.5 rounded-xl border border-slate-200">
                    {item.extractedValue}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Detection Trigger</span>
                  <p className="text-xs text-amber-950 mt-1 leading-relaxed bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
                    {item.detectionReason}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {item.verifiedBy ? (
                  <div className="text-emerald-800 flex items-center gap-1.5 font-bold">
                    <HiOutlineCheckCircle className="text-emerald-600 text-base" />
                    Verified by {item.verifiedBy} ({item.registrationNo}) on {item.verifiedAt}
                  </div>
                ) : (
                  <span className="text-amber-800 font-semibold flex items-center gap-1">
                    <HiOutlineExclamationCircle /> Pending Statutory Review
                  </span>
                )}

                {isNeedsReview && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItem(item);
                      setCorrection(item.extractedValue);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                  >
                    <HiOutlinePencilAlt /> Verify & Sign Off
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sign-off Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Clinician Sign-off & Statutory Attestation
            </h3>
            <p className="text-xs text-slate-500">
              Review and confirm the extracted values from <b>{selectedItem.documentName}</b>. Your statutory sign-off will be recorded in the clinical audit trail.
            </p>

            <form onSubmit={handleSignOff} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinician Name:</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Registration Number:</label>
                <input
                  type="text"
                  value={regNo}
                  onChange={e => setRegNo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Verified Clinical Text:</label>
                <textarea
                  rows={3}
                  value={correction}
                  onChange={e => setCorrection(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                >
                  Confirm Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
