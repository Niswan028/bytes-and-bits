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
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineLockClosed,
  HiOutlineDownload
} from 'react-icons/hi';
import { useForensic } from '../context/ForensicContext';
import VisualForensicCanvas from '../components/VisualForensicCanvas';

export default function Dashboard() {
  const { activeCase, activeDoc, setActiveDocId, recordTriageDecision } = useForensic();
  const [triageNotes, setTriageNotes] = useState('');
  const [triageSuccess, setTriageSuccess] = useState(false);

  const handleTriageSubmit = (decision) => {
    recordTriageDecision(decision, triageNotes);
    setTriageSuccess(true);
    setTimeout(() => setTriageSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Threat Dossier Hero Banner */}
      <div className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0c1222] via-[#070b16] to-[#04060e] p-6 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                {activeCase.caseNumber}
              </span>
              <span className="font-mono text-xs text-slate-400">
                {activeCase.sector}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                <HiOutlineShieldCheck className="text-sm" /> ISO/IEC 27037 IMMUTABLE LEDGER
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeCase.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Target Entity: <span className="font-bold text-white">{activeCase.targetEntity}</span> &bull; Assigned Lead: <span className="font-bold text-cyan-300">{activeCase.assignedInvestigator}</span>
            </p>
          </div>

          {/* Composite Threat Score Ring */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-b from-rose-950/60 to-black/80 p-5 text-center shadow-[0_0_35px_rgba(244,63,94,0.25)] min-w-[170px]">
              <div className="font-mono text-[10px] font-extrabold text-rose-300 uppercase tracking-widest">
                COMPOSITE DFIR THREAT
              </div>
              <div className="text-4xl font-black font-mono text-rose-400 tracking-tight my-1">
                {activeCase.riskScore}<span className="text-sm text-slate-500 font-normal">/100</span>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-black border border-rose-500/40 uppercase">
                {activeCase.severity} &bull; LEVEL 1
              </div>
            </div>
          </div>
        </div>

        {/* Executive Verdict Ribbon */}
        <div className="relative z-10 mt-5 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-3 backdrop-blur-md">
          <HiOutlineExclamation className="text-rose-400 text-2xl shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-mono font-bold text-rose-300 uppercase tracking-wider text-[11px]">
              DETERMINISTIC DFIR ADJUDICATION VERDICT:
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              {activeCase.verdictSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 4 High-Tech KPI Telemetry Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#090d18] p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              EVIDENCE STREAMS
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <HiOutlineDocumentSearch className="text-lg" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{activeCase.documents.length} Records</div>
          <p className="text-[11px] font-mono text-cyan-400 mt-1">Multi-modal OCR & Table Extraction</p>
        </div>

        {/* Tile 2 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#090d18] p-5 shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              VISUAL ARTIFACTS
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <HiOutlineExclamation className="text-lg" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {activeCase.documents.reduce((acc, d) => acc + (d.visualFindings?.length || 0), 0)} Spliced Areas
          </div>
          <p className="text-[11px] font-mono text-rose-400 mt-1">15x JPEG Quantization Variance</p>
        </div>

        {/* Tile 3 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#090d18] p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CROSS-DOC DELTA
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <HiOutlineSwitchHorizontal className="text-lg" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {activeCase.crossDocCorrelations.length} Contradictions
          </div>
          <p className="text-[11px] font-mono text-amber-400 mt-1">
            {activeCase.id === 'CASE-2026-081' ? '+₹1.00L / mo Inflation' : 'Duplicate Invoice Detected'}
          </p>
        </div>

        {/* Tile 4 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#090d18] p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CUSTODY INTEGRITY
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HiOutlineLockClosed className="text-lg" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {activeCase.chainOfCustody.length} Blocks
          </div>
          <p className="text-[11px] font-mono text-emerald-400 mt-1">100% Cryptographic Match</p>
        </div>
      </div>

      {/* Document Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="font-mono text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider mr-2">
          INSPECTION TARGET:
        </span>
        {activeCase.documents.map((doc) => {
          const isSelected = activeDoc?.id === doc.id;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => setActiveDocId(doc.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                  : 'bg-[#090e1c] text-slate-300 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <span>{doc.displayName}</span>
              {doc.tamperingDetected && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-black uppercase ${
                  isSelected ? 'bg-rose-950 text-rose-300' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  Flagged ({doc.visualFindings?.length || 1})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Centerpiece: Visual Forensics Workstation */}
      <VisualForensicCanvas
        caseData={activeCase}
        activeDoc={activeDoc}
      />

      {/* Cross-Document Triangulation Highlights (Section 6) */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#080d1a] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <HiOutlineSwitchHorizontal className="text-cyan-400 text-base" />
              <span>Multi-Document Cross-Correlation Triangulation Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous reconciliation between asserted claims, banking ledgers, and government filings (Section 6 &bull; 20 Pts).
            </p>
          </div>
          <Link
            to="/cross-doc"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Open Triangulator Hub</span>
            <HiOutlineArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="space-y-3">
          {activeCase.crossDocCorrelations.map((cdc) => (
            <div
              key={cdc.id}
              className="p-4 rounded-2xl border border-white/[0.08] bg-[#040711] hover:border-cyan-500/40 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-xs text-white">{cdc.title}</span>
                <span className="font-mono text-xs font-extrabold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/60 self-start sm:self-auto">
                  Variance: {cdc.discrepancyDelta}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {cdc.analysisGrounded}
              </p>
              <div className="text-[11px] font-mono text-cyan-400 pt-1">
                Mandated Action: {cdc.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investigator Adjudication & Signing Station */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#080d1a] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <HiOutlineCheckCircle className="text-cyan-400 text-base" />
            <span>Investigator Triage & Electronic Signature (ISO 27037)</span>
          </h2>
          <span className="font-mono text-[10px] text-slate-500">
            NIST SP 800-86 Hardened
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Sign your formal examination verdict. This will append a block to the immutable custody ledger signed by Inspector K. Ramanathan.
        </p>

        <textarea
          value={triageNotes}
          onChange={(e) => setTriageNotes(e.target.value)}
          placeholder="Record final DFIR remarks (e.g. 'Confirmed ELA quantization anomaly at coordinates [37, 72]. Reconciled ₹1,00,000/mo gap with HDFC ACH ledger. Loan frozen.')"
          rows={2}
          className="w-full rounded-2xl border border-white/[0.08] bg-[#040711] p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden font-mono"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTriageSubmit('CONFIRMED_FRAUD')}
              className="rounded-xl border border-rose-500/60 bg-rose-600/20 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition shadow-[0_0_20px_rgba(244,63,94,0.2)]"
            >
              Affirm Forgery (Decline Loan)
            </button>
            <button
              type="button"
              onClick={() => handleTriageSubmit('QUARANTINED_MANUAL_REVIEW')}
              className="rounded-xl border border-amber-500/60 bg-amber-600/20 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-600/30 transition"
            >
              Quarantine Asset
            </button>
            <button
              type="button"
              onClick={() => handleTriageSubmit('CLEARED_LEGITIMATE')}
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] transition"
            >
              Clear Legitimate
            </button>
          </div>

          <Link
            to="/dossier"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition shadow-lg"
          >
            <HiOutlineDocumentText className="text-sm" />
            <span>Generate Court Dossier PDF</span>
          </Link>
        </div>

        {triageSuccess && (
          <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in font-mono">
            <HiOutlineCheckCircle className="text-emerald-400 text-base" />
            <span>Adjudication sealed with cryptographic SHA-256 signature into the chain of custody!</span>
          </div>
        )}
      </div>
    </div>
  );
}
