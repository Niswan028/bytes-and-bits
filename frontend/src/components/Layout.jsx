import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineDocumentReport,
  HiOutlineExclamation,
  HiOutlineSearch,
  HiOutlineUser
} from 'react-icons/hi';
import Sidebar from './Sidebar';
import { useForensic } from '../context/ForensicContext';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeCase, cases, activeCaseId, setActiveCaseId } = useForensic();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex font-sans antialiased">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-hidden">
        {/* Top SOC DFIR Command Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#050914]/80 px-4 sm:px-6 lg:px-8 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] p-2 text-slate-300 shadow-xs transition hover:border-cyan-500/50 hover:text-white lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <HiOutlineMenu className="text-xl" />
            </button>

            {/* Active Case Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                DOSSIER:
              </span>
              <select
                value={activeCaseId}
                onChange={(e) => setActiveCaseId(e.target.value)}
                className="rounded-xl border border-white/[0.1] bg-[#090e1a] px-3 py-1.5 font-mono text-xs font-bold text-cyan-400 focus:border-cyan-400 focus:outline-hidden shadow-inner cursor-pointer"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} &bull; {c.targetEntity.split('(')[0].trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right SOC Telemetry & User Badges */}
          <div className="flex items-center gap-3">
            {/* Live Operational Status */}
            <div className="hidden xl:flex items-center gap-3 font-mono text-[11px] border-r border-white/[0.08] pr-4 text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SOC ENCLAVE ACTIVE
              </span>
              <span>&bull;</span>
              <span>LATENCY: <strong className="text-cyan-400">12ms</strong></span>
              <span>&bull;</span>
              <span>ISO 27037: <strong className="text-slate-200">SEALED</strong></span>
            </div>

            {/* Threat Level Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 px-3 py-1.5 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-300 font-bold hidden sm:inline">THREAT:</span>
              <span className="font-extrabold text-rose-400">
                {activeCase?.riskScore}/100 {activeCase?.severity}
              </span>
            </div>

            {/* Lead Investigator Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090e1a] px-3 py-1.5 text-xs">
              <HiOutlineUser className="text-cyan-400 text-sm" />
              <span className="font-medium text-slate-300 text-[11px]">
                {activeCase?.assignedInvestigator?.split('(')[0].trim() || 'SOC Examiner'}
              </span>
            </div>

            {/* DFIR PDF Export Button */}
            <Link
              to="/dossier"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              <HiOutlineDocumentReport className="text-cyan-400 text-sm" />
              <span className="hidden md:inline">Export Court Dossier</span>
            </Link>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
