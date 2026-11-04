import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineDocumentReport,
  HiOutlineExclamation
} from 'react-icons/hi';
import Sidebar from './Sidebar';
import { useForensic } from '../context/ForensicContext';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeCase, cases, activeCaseId, setActiveCaseId } = useForensic();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-hidden">
        {/* Top SOC DFIR Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 shadow-xs transition hover:border-slate-500 hover:text-white lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <HiOutlineMenu className="text-xl" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xs font-black text-white text-xs">
                F
              </div>
              <span className="text-sm font-black tracking-tight text-white">
                Forens<span className="text-cyan-400">IQ</span>
              </span>
            </div>

            {/* Active Case Quick Switcher Pill */}
            <div className="hidden sm:flex items-center gap-2 ml-3 pl-3 border-l border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Investigation Dossier:</span>
              <select
                value={activeCaseId}
                onChange={(e) => setActiveCaseId(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-bold text-cyan-400 focus:border-cyan-500 focus:outline-hidden"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} - {c.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Case Risk Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs">
              <span className="text-slate-400 hidden md:inline">Case Threat Level:</span>
              <span className={`font-black font-mono px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                activeCase?.riskScore > 80
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                <HiOutlineExclamation className="text-xs" />
                {activeCase?.riskScore}/100 {activeCase?.severity}
              </span>
            </div>

            {/* Quick Export Dossier Button */}
            <Link
              to="/dossier"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-400 shadow-xs hover:bg-cyan-500/20 transition"
              title="View full ISO 27037 investigation dossier"
            >
              <HiOutlineDocumentReport className="text-cyan-400 text-sm" />
              <span className="hidden sm:inline">DFIR Dossier</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
