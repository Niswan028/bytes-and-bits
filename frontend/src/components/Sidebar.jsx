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
  HiOutlineSwitchHorizontal
} from 'react-icons/hi';
import { useForensic } from '../context/ForensicContext';

const groups = [
  {
    title: 'FORENSIC TRIAGE & SOC',
    items: [
      { to: '/dashboard', label: 'Forensic Command Center', icon: HiOutlineViewGrid, end: true, badge: 'Live ELA' },
      { to: '/cross-doc', label: 'Cross-Doc Correlation Hub', icon: HiOutlineSwitchHorizontal, badge: '20 Pts' },
      { to: '/verify', label: 'Investigator Triage Queue', icon: HiOutlineClipboardCheck, badge: 'Sign-off' }
    ]
  },
  {
    title: 'DEEP FORENSIC ANALYSIS',
    items: [
      { to: '/copilot', label: 'Forensic AI Copilot', icon: HiOutlineChatAlt2, badge: 'Zero-Hal' },
      { to: '/upload', label: 'Intake & ELA Scanner', icon: HiOutlineUpload, badge: 'Multi-Page' }
    ]
  },
  {
    title: 'EVIDENCE & GOVERNANCE',
    items: [
      { to: '/dossier', label: 'ISO 27037 DFIR Dossier', icon: HiOutlineDocumentText, badge: 'PDF Sealed' },
      { to: '/audit', label: 'Chain of Custody Ledger', icon: HiOutlineShieldCheck, badge: 'SHA-256' },
      { to: '/metrics', label: 'SOC Accuracy & F1 Metrics', icon: HiOutlineTrendingUp, badge: '99.4%' }
    ]
  }
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { cases, activeCaseId, setActiveCaseId, activeCase } = useForensic();

  const linkClass = ({ isActive }) =>
    `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
      isActive
        ? 'bg-cyan-500/15 text-cyan-400 font-bold shadow-xs border border-cyan-500/30'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`;

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 p-4 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          type="button"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <HiOutlineX className="text-xl" />
        </button>

        {/* Brand Header */}
        <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg font-black text-base">
              F
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                  Forens<span className="text-cyan-400">IQ</span>
                </span>
                <span className="rounded-md bg-cyan-950/80 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-700/50 uppercase">
                  SOC/VAPT
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-tight truncate mt-0.5">
                AI Document Forensics & DFIR
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ISO/IEC 27037 Ready
            </span>
            <span className="font-mono text-slate-500">v3.0 DataOps</span>
          </div>
        </div>

        {/* Case Switcher Widget */}
        <div className="mb-4 p-2.5 rounded-xl border border-slate-800 bg-slate-900/50">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
            <span>Active Investigation Case</span>
            <span className="text-cyan-400 font-mono text-[9px]">{activeCase?.caseNumber?.split('-')?.[2] || 'FIN'}</span>
          </label>
          <select
            value={activeCaseId}
            onChange={(e) => setActiveCaseId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-hidden"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.targetEntity.split('(')[0]}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Risk Score:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded ${
              activeCase?.riskScore > 80 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400'
            }`}>
              {activeCase?.riskScore}/100 ({activeCase?.severity})
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 space-y-4">
          {groups.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
                      <item.icon className="text-sm shrink-0 text-slate-400 group-hover:text-cyan-400" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 border border-slate-700 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom SOC Status Seal */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400">
            <HiOutlineShieldCheck className="text-cyan-400 text-xs" /> Cryptographic Ledger
          </span>
          <span className="font-mono text-cyan-400">NIST SP 800-86</span>
        </div>
      </aside>
    </>
  );
}
