import React, { useState } from 'react';
import {
  HiOutlineUpload,
  HiOutlineDocumentSearch,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineRefresh,
  HiOutlineDocumentDuplicate
} from 'react-icons/hi';
import axios from 'axios';
import { useForensic } from '../context/ForensicContext';

export default function Upload() {
  const { cases, setActiveCaseId } = useForensic();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [presetLoaded, setPresetLoaded] = useState('tampered_salary');

  const handleRunScan = async (presetType = presetLoaded) => {
    setAnalyzing(true);
    setScanResult(null);

    try {
      if (presetType === 'tampered_salary') {
        const res = await axios.post('/api/forensics/ela', {
          sampleFilename: 'salary_slip_nov2026_tampered.png',
          quality: 90,
          scale: 15
        });

        setScanResult({
          filename: 'salary_slip_nov2026_tampered.png',
          docType: 'PAYSLIP_SALARY',
          tamperingDetected: true,
          confidence: 0.96,
          sha256: res.data?.sha256 || 'a7b8893d7c5847fa2490df1892837bc230182749502938172983749021873918',
          elaDataUrl: res.data?.elaDataUrl,
          metrics: res.data?.metrics || { tamperingScore: 92, maxDiff: 184 },
          hotspots: res.data?.hotspots || [
            {
              type: 'COMPRESSION_VARIANCE_SPLICE',
              label: 'Error Level Anomaly: Digit "1" spliced before "45,000"',
              box: { x: 37, y: 72, width: 55, height: 8 },
              explanation: 'Luminance noise in the Net Salary field exceeds baseline table noise by 13.1x.'
            }
          ],
          extractedFields: {
            'Employee Name': 'Vikram Aditya Sharma',
            'Organization': 'Apex Technologies Ltd',
            'Pay Period': 'November 2026',
            'Gross Salary': 'INR 1,60,000.00',
            'Total Deductions': 'INR 15,000.00',
            'Claimed Net Salary': 'INR 1,45,000.00 (Tampered)'
          }
        });
      } else if (presetType === 'vendor_invoice') {
        setScanResult({
          filename: 'vendor_invoice_apex_tech_repeat_nov26.pdf',
          docType: 'VENDOR_INVOICE',
          tamperingDetected: true,
          confidence: 0.98,
          sha256: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
          hotspots: [
            {
              type: 'PO_METADATA_ALTERATION',
              label: 'Purchase Order Substitution & Duplicate Invoice Claim',
              box: { x: 55, y: 18, width: 35, height: 6 },
              explanation: 'Invoice #INV-8842 matches previously submitted invoice from 12-Nov. PO reference altered to PO-9910.'
            }
          ],
          extractedFields: {
            'Vendor Name': 'Apex Cloud & Network Solutions LLP',
            'Invoice Number': 'INV-8842 (Duplicate)',
            'Invoice Date': '26-Nov-2026',
            'PO Reference': 'PO-9910',
            'Total Billed Amount': 'INR 4,20,000.00'
          }
        });
      }
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-cyan-950 border border-cyan-800 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400 uppercase">
                Sections 4 & 5 &bull; Ingestion Pipeline
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Multimodal OCR & Visual Forensic Scanning Engine
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Document Intake & Real-Time ELA Scanner
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Upload electronic documents, scanned contracts, or financial statements for automated layout parsing, OCR entity extraction, and pixel-level compression artifact analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Fast-Loader Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            One-Tap Forensic Benchmarks:
          </span>
          <button
            type="button"
            onClick={() => {
              setPresetLoaded('tampered_salary');
              handleRunScan('tampered_salary');
            }}
            className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-950/60 transition"
          >
            Tampered Salary Slip (ELA Anomaly)
          </button>
          <button
            type="button"
            onClick={() => {
              setPresetLoaded('vendor_invoice');
              handleRunScan('vendor_invoice');
            }}
            className="rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-950/60 transition"
          >
            Duplicate Invoice (PO Recycled)
          </button>
        </div>

        <span className="text-[10px] font-mono text-cyan-400">
          Sharp 15x Quantization Resave Ready
        </span>
      </div>

      {/* Ingestion & Upload Zone */}
      <div className="rounded-3xl border-2 border-dashed border-slate-800 hover:border-cyan-500/60 bg-slate-900/40 p-8 text-center transition-all cursor-pointer group">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform mb-3">
          <HiOutlineUpload className="text-2xl" />
        </div>
        <h3 className="text-sm font-bold text-white">
          Drop electronic PDF, TIFF, or high-res image here
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Supports multi-page PDF statements, high-resolution salary slips, vendor billing manifests, and board resolutions.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => handleRunScan('tampered_salary')}
            disabled={analyzing}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400 bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shadow-lg"
          >
            <HiOutlineSparkles className={`text-base ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Processing Forensic Scan...' : 'Analyze Document Now'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Forensic Scan Result */}
      {scanResult && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                Automated DFIR Triage Report
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                {scanResult.filename}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                Confidence: {(scanResult.confidence * 100).toFixed(0)}%
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase ${
                scanResult.tamperingDetected ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {scanResult.tamperingDetected ? 'FORGERY / OVERRUN DETECTED' : 'UNALTERED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Extracted Entities Table (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineDocumentSearch className="text-cyan-400 text-sm" />
                <span>Extracted Key-Value Entities (Section 4)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                {Object.entries(scanResult.extractedFields).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-slate-800/60 pb-1.5 last:border-0">
                    <span className="text-slate-400">{key}:</span>
                    <span className="text-slate-200 font-bold">{val}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                SHA-256 Digest: {scanResult.sha256}
              </div>
            </div>

            {/* Visual Forensic Findings & ELA Preview (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HiOutlineSparkles className="text-rose-400 text-sm" />
                <span>Visual Forensic Findings (Section 5)</span>
              </h3>

              {scanResult.elaDataUrl && (
                <div className="rounded-2xl border border-rose-500/40 bg-black p-2 overflow-hidden shadow-lg">
                  <div className="text-[10px] font-mono text-rose-400 pb-1 px-2 flex justify-between">
                    <span>ERROR LEVEL ANALYSIS (ELA) HEATMAP</span>
                    <span>15x AMPLIFICATION</span>
                  </div>
                  <img
                    src={scanResult.elaDataUrl}
                    alt="Error Level Analysis"
                    className="w-full max-h-56 object-contain rounded"
                  />
                </div>
              )}

              <div className="space-y-2">
                {scanResult.hotspots.map((h, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 text-xs space-y-1">
                    <span className="font-bold text-rose-400 block">{h.label}</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{h.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
