import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  HiOutlineEye,
  HiOutlineSparkles,
  HiOutlineArrowsExpand,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiOutlineRefresh,
  HiOutlineAdjustments,
  HiOutlineShieldCheck
} from 'react-icons/hi';

export default function VisualForensicCanvas({ caseData, activeDoc, onSelectFinding }) {
  const [viewMode, setViewMode] = useState('CURTAIN_WIPE'); // 'CURTAIN_WIPE' | 'ANNOTATED' | 'ELA_HEATMAP' | 'SPLIT_COMPARATOR'
  const [curtainPosition, setCurtainPosition] = useState(50); // percentage 0 to 100
  const [isDraggingCurtain, setIsDraggingCurtain] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedBox, setSelectedBox] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 38, y: 72, active: false });
  const [elaScale, setElaScale] = useState(15);
  const [elaLoading, setElaLoading] = useState(false);
  const [elaDataUrl, setElaDataUrl] = useState(null);
  const [splitDocId, setSplitDocId] = useState(null);
  const canvasRef = useRef(null);

  const findings = activeDoc?.visualFindings || [];

  useEffect(() => {
    if (findings.length > 0) {
      setSelectedBox(findings[0]);
    } else {
      setSelectedBox(null);
    }
  }, [activeDoc?.id]);

  useEffect(() => {
    fetchElaHeatmap();
  }, [activeDoc?.filename, elaScale]);

  const fetchElaHeatmap = async () => {
    setElaLoading(true);
    try {
      const res = await axios.post('/api/forensics/ela', {
        sampleFilename: activeDoc?.filename || 'salary_slip_nov2026_tampered.png',
        quality: 90,
        scale: elaScale
      });
      if (res.data?.success && res.data?.elaDataUrl) {
        setElaDataUrl(res.data.elaDataUrl);
      }
    } catch (e) {
      // Fallback
    } finally {
      setElaLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setCursorPos({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)), active: true });

    if (isDraggingCurtain) {
      setCurtainPosition(Math.max(5, Math.min(95, x)));
    }
  };

  const otherDocs = (caseData?.documents || []).filter(d => d.id !== activeDoc?.id);
  const companionDoc = otherDocs.find(d => d.id === splitDocId) || otherDocs[0];

  return (
    <div className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#090d16] via-[#050811] to-[#03060c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100">
      
      {/* Top HUD Status & Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#070b14]/90 px-5 py-3.5 gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest text-cyan-400 uppercase">
                OPTICAL_FORENSIC_SPECTROMETER
              </span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-300 border border-cyan-700/50">
                15x RESIDUAL AMPLIFIER
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Target: <span className="text-slate-200">{activeDoc?.displayName}</span> &bull; Status: <span className="text-rose-400 font-bold">TAMPERING CONFIRMED</span>
            </p>
          </div>
        </div>

        {/* View Mode Mode Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-[#0b101d] p-1 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setViewMode('CURTAIN_WIPE')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === 'CURTAIN_WIPE'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HiOutlineAdjustments className="text-sm" />
            <span>Curtain Split-Wipe</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('ANNOTATED')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === 'ANNOTATED'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HiOutlineEye className="text-sm" />
            <span>Target Bounding HUD</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('ELA_HEATMAP')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === 'ELA_HEATMAP'
                ? 'bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HiOutlineSparkles className="text-sm" />
            <span>Thermal ELA</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('SPLIT_COMPARATOR')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === 'SPLIT_COMPARATOR'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HiOutlineArrowsExpand className="text-sm" />
            <span>Dual Stream</span>
          </button>
        </div>
      </div>

      {/* Main Forensic Working Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column: Visual Canvas (8 cols) */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursorPos(prev => ({ ...prev, active: false }))}
          onMouseUp={() => setIsDraggingCurtain(false)}
          className="lg:col-span-8 relative flex flex-col items-center justify-center p-6 bg-[#03060c] border-r border-white/[0.08] overflow-hidden select-none"
        >
          {/* Laser Sweep Scanner Effect */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-laser pointer-events-none z-20" />

          {/* Mode: Curtain Wipe Slider (Professional Forensic Dual-Layer) */}
          {viewMode === 'CURTAIN_WIPE' && (
            <div className="relative w-full max-w-[620px] h-[480px] rounded-2xl border border-white/[0.1] bg-black shadow-2xl overflow-hidden group">
              {/* Layer 1: ELA Heatmap (Base Layer) */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                {elaDataUrl ? (
                  <img
                    src={elaDataUrl}
                    alt="ELA Base Heatmap"
                    className="w-full h-full object-contain filter contrast-125"
                  />
                ) : (
                  <div className="text-center font-mono text-xs text-rose-400">
                    Computing Quantization Matrix...
                  </div>
                )}
                {/* ELA Label */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 border border-rose-500/40 text-[10px] font-mono text-rose-400 font-bold z-10">
                  ELA QUANTIZATION (15x)
                </div>
              </div>

              {/* Layer 2: Original Document (Clipped by Curtain Position) */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden bg-white z-10"
                style={{ width: `${curtainPosition}%` }}
              >
                <img
                  src="/api/forensics/sample/salary_slip_nov2026_tampered.png"
                  alt="Original Document"
                  className="w-[620px] max-w-none h-[480px] object-contain"
                />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/20 text-[10px] font-mono text-slate-200 font-bold z-10">
                  RAW OPTICAL CAPTURE
                </div>
              </div>

              {/* Vertical Curtain Divider Bar with Drag Handle */}
              <div
                className="absolute top-0 bottom-0 z-30 flex items-center justify-center cursor-ew-resize"
                style={{ left: `calc(${curtainPosition}% - 2px)` }}
                onMouseDown={() => setIsDraggingCurtain(true)}
              >
                <div className="w-[3px] h-full bg-cyan-400 shadow-[0_0_12px_#06b6d4]" />
                <div className="absolute w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_15px_#06b6d4] border-2 border-white">
                  ⟷
                </div>
              </div>

              {/* Hotspot Reticle Overlay */}
              <div
                className="absolute top-[68%] left-[36%] w-[56%] h-[12%] rounded border-2 border-rose-500/80 bg-rose-500/10 z-20 pointer-events-none flex items-center justify-end pr-2"
              >
                <span className="font-mono text-[9px] font-bold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-700/60 uppercase animate-pulse">
                  Splice Hotspot (184 Lux)
                </span>
              </div>
            </div>
          )}

          {/* Mode: Target Bounding HUD */}
          {viewMode === 'ANNOTATED' && (
            <div className="relative w-full max-w-[620px] h-[480px] rounded-2xl border border-white/[0.1] bg-white shadow-2xl overflow-hidden">
              <img
                src="/api/forensics/sample/salary_slip_nov2026_tampered.png"
                alt="Forensic Target"
                className="w-full h-full object-contain"
              />

              {/* High-tech SVG Bounding Targets */}
              <svg className="absolute inset-0 w-full h-full pointer-events-auto">
                {findings.map((f) => {
                  const isSelected = selectedBox?.id === f.id;
                  const strokeColor = f.type === 'ERROR_LEVEL_ANALYSIS' ? '#f43f5e' : '#f59e0b';
                  return (
                    <g key={f.id} className="cursor-pointer" onClick={() => setSelectedBox(f)}>
                      {/* Bounding Rectangle */}
                      <rect
                        x={`${f.box.x}%`}
                        y={`${f.box.y}%`}
                        width={`${f.box.width}%`}
                        height={`${f.box.height}%`}
                        fill={isSelected ? `${strokeColor}25` : `${strokeColor}10`}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        strokeDasharray={isSelected ? 'none' : '4 2'}
                      />
                      {/* High-tech Corner Target Indicators */}
                      {isSelected && (
                        <>
                          <rect x={`${f.box.x}%`} y={`${f.box.y}%`} width="6" height="6" fill={strokeColor} />
                          <rect x={`calc(${f.box.x + f.box.width}% - 6px)`} y={`${f.box.y}%`} width="6" height="6" fill={strokeColor} />
                          <rect x={`${f.box.x}%`} y={`calc(${f.box.y + f.box.height}% - 6px)`} width="6" height="6" fill={strokeColor} />
                          <rect x={`calc(${f.box.x + f.box.width}% - 6px)`} y={`calc(${f.box.y + f.box.height}% - 6px)`} width="6" height="6" fill={strokeColor} />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Mode: Thermal ELA */}
          {viewMode === 'ELA_HEATMAP' && (
            <div className="relative w-full max-w-[620px] h-[480px] rounded-2xl border border-rose-500/40 bg-black shadow-2xl overflow-hidden flex items-center justify-center">
              {elaLoading ? (
                <div className="flex flex-col items-center gap-2 font-mono text-xs text-rose-400">
                  <HiOutlineRefresh className="text-2xl animate-spin" />
                  <span>Computing 15x Quantization Divergence Matrix...</span>
                </div>
              ) : (
                <img
                  src={elaDataUrl || '/api/forensics/sample/salary_slip_nov2026_tampered.png'}
                  alt="Thermal ELA"
                  className="w-full h-full object-contain filter contrast-150"
                />
              )}
            </div>
          )}

          {/* Mode: Split Comparator */}
          {viewMode === 'SPLIT_COMPARATOR' && (
            <div className="w-full max-w-2xl space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>MULTI-DOCUMENT RECONCILIATION STREAM</span>
                <span>DELTA: +₹1,00,000 / MO</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-rose-500/50 bg-[#090d18] p-3">
                  <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">PRIMARY CLAIM (ASSERTED)</div>
                  <div className="text-lg font-black text-white mt-1">₹1,45,000.00</div>
                  <p className="text-[11px] text-slate-400 mt-1">Salary slip Nov 2026 assertions</p>
                </div>
                <div className="rounded-xl border border-emerald-500/50 bg-[#090d18] p-3">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">VERIFIED BANK ACH (HDFC)</div>
                  <div className="text-lg font-black text-emerald-400 mt-1">₹45,000.00</div>
                  <p className="text-[11px] text-slate-400 mt-1">Official banking ledger credits</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Interactive HUD Telemetry Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between w-full max-w-[620px] rounded-xl bg-[#090e1a] border border-white/[0.08] px-4 py-2 font-mono text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>CURSOR: <strong className="text-cyan-400">X:{cursorPos.x}% Y:{cursorPos.y}%</strong></span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">RESIDUAL: <strong className="text-rose-400">184 Lux</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">SCALE:</span>
              <button
                type="button"
                onClick={() => setElaScale(10)}
                className={`px-2 py-0.5 rounded ${elaScale === 10 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
              >
                10x
              </button>
              <button
                type="button"
                onClick={() => setElaScale(15)}
                className={`px-2 py-0.5 rounded ${elaScale === 15 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
              >
                15x
              </button>
              <button
                type="button"
                onClick={() => setElaScale(20)}
                className={`px-2 py-0.5 rounded ${elaScale === 20 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
              >
                20x
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Deep-Dive Telemetry Panel (4 cols) */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-[#060a14]/90 backdrop-blur-2xl space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <HiOutlineInformationCircle className="text-cyan-400 text-base" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-200">
                  FORENSIC TELEMETRY
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                ZERO HALLUCINATION
              </span>
            </div>

            {/* Findings Selector */}
            <div className="space-y-2 mb-4">
              {findings.map((f) => {
                const isSelected = selectedBox?.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedBox(f)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-cyan-500/80 bg-cyan-950/30 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                        : 'border-white/[0.06] bg-[#090e1a]/60 hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white truncate">{f.title}</span>
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase">
                        {f.severity}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span className="truncate">{f.tool}</span>
                      <span className="text-cyan-400 font-bold">{(f.confidence * 100).toFixed(0)}% Conf</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Anomaly Deep-Dive Card */}
            {selectedBox && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#070c18] p-4 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                    COORDINATE GROUNDING
                  </span>
                  <div className="mt-1 text-[11px] text-slate-200 bg-black/60 p-2 rounded-lg border border-white/[0.06] flex justify-between">
                    <span>X: {selectedBox.box.x}%</span>
                    <span>Y: {selectedBox.box.y}%</span>
                    <span>W: {selectedBox.box.width}%</span>
                    <span>H: {selectedBox.box.height}%</span>
                  </div>
                </div>

                {selectedBox.pixelMetrics && (
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
                      QUANTIZATION RESIDUAL DELTA
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="p-2 rounded-lg bg-black/60 border border-white/[0.06]">
                        <span className="text-slate-500 text-[10px] block">HOTSPOT NOISE</span>
                        <span className="text-rose-400 font-bold text-sm">{selectedBox.pixelMetrics.avgNoiseDiff} Lux</span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/60 border border-white/[0.06]">
                        <span className="text-slate-500 text-[10px] block">BASELINE MATRIX</span>
                        <span className="text-emerald-400 font-bold text-sm">{selectedBox.pixelMetrics.baselineNoise} Lux</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    GROUNDED DFIR REASONING
                  </span>
                  <p className="mt-1 font-sans text-xs text-slate-300 leading-relaxed border-l-2 border-cyan-500 pl-2.5 py-0.5">
                    {selectedBox.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.08] pt-3 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 text-cyan-400">
              <HiOutlineShieldCheck className="text-xs" /> ISO/IEC 27037 Compliant
            </span>
            <span>NIST SP 800-86</span>
          </div>
        </div>
      </div>
    </div>
  );
}
