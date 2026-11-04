import React, { useState } from 'react';
import {
  HiOutlineClipboardCheck,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineArrowNarrowRight,
  HiOutlineFilter,
  HiOutlineXCircle
} from 'react-icons/hi';
import { useForensic } from '../context/ForensicContext';
import { Link } from 'react-router-dom';

export default function VerificationQueue() {
  const { cases, activeCaseId, setActiveCaseId, recordTriageDecision } = useForensic();
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [modalCase, setModalCase] = useState(null);
  const [triageDecision, setTriageDecision] = useState('CONFIRMED_FRAUD');
  const [triageNotes, setTriageNotes] = useState('');
  const [triageSuccess, setTriageSuccess] = useState(false);

  const filteredCases = cases.filter(c => {
    if (filterSeverity === 'ALL') return true;
    return c.severity === filterSeverity;
  });

  const handleSignOff = () => {
    if (!modalCase) return;
    recordTriageDecision(triageDecision, triageNotes);
    setTriageSuccess(true);
    setTimeout(() => {
      setTriageSuccess(false);
      setModalCase(null);
      setTriageNotes('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-cyan-950 border border-cyan-800 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400 uppercase">
                SOC / DFIR Tier-2 Triage
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Human-in-the-Loop Adjudication Console
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Investigator Verification & Triage Queue
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Review algorithmic anomaly flags, verify Error Level Analysis hotspots, and apply cryptographic examiner signatures to affirm or clear document packets.
            </p>
          </div>

          {/* Severity Filter Controls */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs">
            {['ALL', 'CRITICAL', 'HIGH'].map(sev => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterSeverity === sev
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Queue Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Pending Case Queue ({filteredCases.length} Active Records)
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            NIST SP 800-86 Compliant Ledger
          </span>
        </div>

        <div className="space-y-3">
          {filteredCases.map(c => {
            const isCritical = c.severity === 'CRITICAL';
            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-cyan-400">{c.caseNumber}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {c.severity} &bull; Score: {c.riskScore}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {c.documents.length} Docs &bull; {c.crossDocCorrelations.length} Conflicts
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{c.title}</h3>
                  <p className="text-xs text-slate-400">
                    Subject: <span className="text-slate-200 font-medium">{c.targetEntity}</span> &bull; {c.sector}
                  </p>
                  <p className="text-xs text-slate-300 pt-1 line-clamp-1 border-l-2 border-rose-500 pl-2">
                    {c.verdictSummary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/dashboard"
                    onClick={() => setActiveCaseId(c.id)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
                  >
                    Inspect Canvas
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCaseId(c.id);
                      setModalCase(c);
                    }}
                    className="rounded-xl border border-cyan-400 bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shadow-md"
                  >
                    Adjudicate & Sign
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjudication Modal */}
      {modalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{modalCase.caseNumber}</span>
                <h3 className="text-base font-black text-white mt-0.5">{modalCase.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCase(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="text-slate-400 font-bold block">Select Final Adjudication Decision:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'CONFIRMED_FRAUD', label: 'Confirmed Forgery (Decline)', color: 'border-rose-500 text-rose-300 bg-rose-950/40' },
                  { id: 'QUARANTINE_REVIEW', label: 'Quarantine Level-3', color: 'border-amber-500 text-amber-300 bg-amber-950/40' },
                  { id: 'CLEARED_PASS', label: 'Cleared Legitimate', color: 'border-emerald-500 text-emerald-300 bg-emerald-950/40' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTriageDecision(opt.id)}
                    className={`p-2.5 rounded-xl border font-bold text-center transition ${
                      triageDecision === opt.id ? opt.color + ' shadow-lg' : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Investigator Formal Remarks:</label>
                <textarea
                  value={triageNotes}
                  onChange={(e) => setTriageNotes(e.target.value)}
                  placeholder="Record formal reasons for the finding (referenced in tribunal/court dossier)..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Signatory Examiner:</span>
                  <span className="text-slate-200 font-bold">Inspector K. Ramanathan</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard:</span>
                  <span className="text-cyan-400 font-mono">ISO/IEC 27037 Tamper-Proof Stamp</span>
                </div>
              </div>

              {triageSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-base text-emerald-400" />
                  <span>Adjudication sealed with cryptographic SHA-256 signature!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalCase(null)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSignOff}
                  className="rounded-xl border border-cyan-400 bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-md"
                >
                  Confirm & Apply Digital Seal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
