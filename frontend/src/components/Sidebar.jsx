import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineUpload,
  HiOutlineX,
  HiOutlineSwitchHorizontal,
  HiOutlineTerminal
} from 'react-icons/hi';
import { useForensic } from '../context/ForensicContext';

const groups = [
  {
    title: 'TACTICAL FORENSICS & SOC',
    items: [
      { to: '/dashboard', label: 'Command Center', icon: HiOutlineViewGrid, end: true, badge: 'Live ELA' },
      { to: '/cross-doc', label: 'Cross-Doc Triangulator', icon: HiOutlineSwitchHorizontal, badge: '20 Pts' },
      { to: '/verify', label: 'Investigator Triage', icon: HiOutlineClipboardCheck, badge: 'SEV-1' }
    ]
  },
  {
    title: 'MULTIMODAL AI & INTAKE',
    items: [
      { to: '/copilot', label: 'Grounded AI Copilot', icon: HiOutlineChatAlt2, badge: 'Zero-Hal' },
      { to: '/upload', label: 'Intake & ELA Scanner', icon: HiOutlineUpload, badge: '15x Sharp' }
    ]
  },
  {
    title: 'GOVERNANCE & STANDARDS',
    items: [
      { to: '/dossier', label: 'ISO 27037 DFIR Dossier', icon: HiOutlineDocumentText, badge: 'Court Sealed' },
      { to: '/audit', label: 'Chain of Custody Ledger', icon: HiOutlineShieldCheck, badge: 'SHA-256' },
      { to: '/metrics', label: 'SOC Accuracy Benchmarks', icon: HiOutlineTrendingUp, badge: '99.4%' }
    ]
  }
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { cases, activeCaseId, setActiveCaseId, activeCase } = useForensic();

  const linkClass = ({ isActive }) =>
    `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
    }`;

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-auto border-r border-white/[0.08] bg-[#040711] p-4 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          type="button"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-white/[0.05] hover:text-slate-300 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <HiOutlineX className="text-xl" />
        </button>

        {/* Startup Brand Header */}
        <div className="mb-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#090e1c] to-[#050812] p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-slate-950 font-black text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/40">
              ⚡
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white whitespace-nowrap">
                  Forens<span className="text-cyan-400">IQ</span>
                </span>
                <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyan-300 border border-cyan-700/50 uppercase">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight truncate mt-0.5">
                Autonomous DFIR Forensics
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2 text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ISO/IEC 27037 CERTIFIED
            </span>
            <span className="text-slate-500">v3.4-PROD</span>
          </div>
        </div>

        {/* Active Case Selector Quick Pill */}
        <div className="mb-4 rounded-xl border border-white/[0.06] bg-[#070b16] p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ACTIVE CASE TARGET
            </span>
            <span className="font-mono text-[9px] text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/40">
              {activeCase?.id}
            </span>
          </div>
          <select
            value={activeCaseId}
            onChange={(e) => setActiveCaseId(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-[#03060f] px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-hidden cursor-pointer"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} &bull; {c.targetEntity.split('(')[0].trim()}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-500">Risk Score:</span>
            <span className="font-bold text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-800/60">
              {activeCase?.riskScore}/100 ({activeCase?.severity})
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 space-y-4">
          {groups.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={linkClass}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <item.icon className="text-base shrink-0 text-slate-400 group-hover:text-cyan-400 transition" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400 border border-white/[0.08] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom SOC Node Telemetry Card */}
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#070b16] p-3 text-[10px] font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <HiOutlineTerminal className="text-cyan-400" />
              <span>CLUSTER TELEMETRY</span>
            </span>
            <span className="text-emerald-400 font-bold">OPTIMAL</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[9px]">
            <span>ENGINE: SHARP RESIDUAL 15x</span>
            <span>ZERO-HAL: ON</span>
          </div>
        </div>
      </aside>
    </>
  );
}
