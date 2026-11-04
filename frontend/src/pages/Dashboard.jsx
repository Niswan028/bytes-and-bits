import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineShieldCheck,
  HiOutlineExclamation,
  HiOutlineDocumentSearch,
  HiOutlineSwitchHorizontal,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineArrowRight
} from 'react-icons/hi';
import { useForensic } from '../context/ForensicContext';
import VisualForensicCanvas from '../components/VisualForensicCanvas';

export default function Dashboard() {
  const { activeCase, activeDoc, setActiveDocId, recordTriageDecision } = useForensic();
  const [triageStatus, setTriageStatus] = useState('');
  const [triageNotes, setTriageNotes] = useState('');
  const [triageSuccess, setTriageSuccess] = useState(false);

  const handleTriageSubmit = (decision) => {
    recordTriageDecision(decision, triageNotes);
    setTriageStatus(decision);
    setTriageSuccess(true);
    setTimeout(() => setTriageSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Case Overview */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-md bg-cyan-950 border border-cyan-800 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400 uppercase">
                {activeCase.caseNumber}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeCase.sector}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <HiOutlineCheckCircle className="text-xs" /> Chain of Custody Sealed
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeCase.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Target Subject: <span className="text-slate-200 font-bold">{activeCase.targetEntity}</span> &bull; Assigned Lead: <span className="text-slate-200">{activeCase.assignedInvestigator}</span>
            </p>
          </div>

          {/* Risk Score Radial Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`p-4 rounded-2xl border text-center ${
              activeCase.riskScore > 80
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-400'
            }`}>
              <div className="text-[10px] uppercase font-bold tracking-wider">Composite DFIR Risk</div>
              <div className="text-3xl font-black font-mono tracking-tight my-0.5">
                {activeCase.riskScore}<span className="text-xs text-slate-400">/100</span>
              </div>
              <div className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30">
                {activeCase.severity}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Verdict Strip */}
        <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
          <HiOutlineExclamation className="text-rose-400 text-xl shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-rose-300">Automated Adjudication Verdict: </span>
            <span className="text-slate-300 leading-relaxed font-medium">
              {activeCase.verdictSummary}
            </span>
          </div>
        </div>
      </div>

      {/* Forensic KPI Counters (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <HiOutlineDocumentSearch className="text-2xl" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Ingested Documents</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">{activeCase.documents.length} Files</div>
            <div className="text-[10px] text-blue-400">OCR + Layout Analyzed</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <HiOutlineExclamation className="text-2xl" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Visual Forgeries</div>
            <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
              {activeCase.documents.reduce((acc, d) => acc + (d.visualFindings?.length || 0), 0)} Detected
            </div>
            <div className="text-[10px] text-rose-400">ELA & Font Alterations</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <HiOutlineSwitchHorizontal className="text-2xl" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Cross-Doc Conflicts</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
              {activeCase.crossDocCorrelations.length} Irreconcilable
            </div>
            <div className="text-[10px] text-amber-400">Triangulation Delta</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <HiOutlineShieldCheck className="text-2xl" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Evidence Chain</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {activeCase.chainOfCustody.length} Events
            </div>
            <div className="text-[10px] text-emerald-400">ISO/IEC 27037 Stamp</div>
          </div>
        </div>
      </div>

      {/* Document Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider mr-2">
          Evidence Items:
        </span>
        {activeCase.documents.map((doc) => {
          const isSelected = activeDoc?.id === doc.id;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => setActiveDocId(doc.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{doc.displayName}</span>
              {doc.tamperingDetected && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                  isSelected ? 'bg-rose-950 text-rose-300' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  Flagged ({doc.visualFindings?.length || 1})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Visual Forensics Canvas */}
      <VisualForensicCanvas
        caseData={activeCase}
        activeDoc={activeDoc}
      />

      {/* Cross-Document Correlation Teaser Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HiOutlineSwitchHorizontal className="text-cyan-400 text-base" />
              <span>Cross-Document Correlation Highlights (Section 6)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated multi-document triangulation between asserted claims, banking credits, and tax records.
            </p>
          </div>
          <Link
            to="/cross-doc"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Open Correlation Hub</span>
            <HiOutlineArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="space-y-3">
          {activeCase.crossDocCorrelations.map((cdc) => (
            <div
              key={cdc.id}
              className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="font-bold text-xs text-slate-200">{cdc.title}</span>
                <span className="font-mono text-xs font-extrabold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50 self-start sm:self-auto">
                  {cdc.discrepancyDelta}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cdc.analysisGrounded}
              </p>
              <div className="mt-2 text-[11px] text-cyan-400/90 font-medium">
                Action Recommendation: {cdc.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investigator Triage Action Console */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <HiOutlineCheckCircle className="text-cyan-400 text-base" />
          <span>Investigator Triage & Digital Evidence Adjudication</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Record your definitive DFIR finding. This decision will append an immutable SHA-256 seal to the ISO/IEC 27037 chain of custody ledger.
        </p>

        <div className="space-y-3">
          <textarea
            value={triageNotes}
            onChange={(e) => setTriageNotes(e.target.value)}
            placeholder="Enter investigator triage remarks (e.g. 'Confirmed ELA quantization anomaly on salary slip. Bank statement confirms ₹45,000 credit. Escalating for loan denial.')"
            rows={2}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTriageSubmit('CONFIRMED_FRAUD')}
                className="rounded-xl border border-rose-500/60 bg-rose-600/20 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition shadow-xs"
              >
                Mark as Confirmed Forgery (Decline)
              </button>
              <button
                type="button"
                onClick={() => handleTriageSubmit('QUARANTINED_MANUAL_REVIEW')}
                className="rounded-xl border border-amber-500/60 bg-amber-600/20 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition shadow-xs"
              >
                Quarantine for Level-3 Review
              </button>
              <button
                type="button"
                onClick={() => handleTriageSubmit('CLEARED_LEGITIMATE')}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
              >
                Clear Document Packet
              </button>
            </div>

            <Link
              to="/dossier"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition"
            >
              <HiOutlineDocumentText className="text-sm" />
              <span>Generate ISO 27037 PDF Dossier</span>
            </Link>
          </div>

          {triageSuccess && (
            <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <HiOutlineCheckCircle className="text-emerald-400 text-base" />
              <span>Triage decision successfully signed and appended to immutable Chain of Custody ledger!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
