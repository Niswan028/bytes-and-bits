import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
  HiOutlineExclamationCircle,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineUser,
  HiOutlineLightningBolt,
  HiOutlineUpload,
  HiOutlineCode,
  HiOutlineX
} from 'react-icons/hi';

const groups = [
  {
    title: 'PATIENT & CLINICAL CARE',
    items: [
      { to: '/dashboard', label: 'Patient Overview', icon: HiOutlineViewGrid, end: true, badge: 'Live' },
      { to: '/timeline', label: 'Health Timeline', icon: HiOutlineTrendingUp, badge: 'Biomarkers' },
      { to: '/patient', label: 'Patient Portal', icon: HiOutlineUser, badge: 'Mobile-First' },
      { to: '/handoff', label: 'Emergency Handoff', icon: HiOutlineLightningBolt, badge: '1-Tap ER' }
    ]
  },
  {
    title: 'SAFETY & CLINICAL AI',
    items: [
      { to: '/safety', label: 'Safety & Reconciler', icon: HiOutlineExclamationCircle, badge: 'Duplicates' },
      { to: '/chat', label: 'Grounded Clinical Q&A', icon: HiOutlineChatAlt2, badge: 'Indic Voice' },
      { to: '/verify', label: 'Clinician Queue', icon: HiOutlineClipboardCheck, badge: 'Sign-off' }
    ]
  },
  {
    title: 'AUDIT & EXPORTS',
    items: [
      { to: '/audit', label: 'Clinical Audit Trail', icon: HiOutlineShieldCheck, badge: 'Activity Log' },
      { to: '/reports', label: 'Dossier & PDF Export', icon: HiOutlineDocumentText, badge: 'QR Sealed' },
      { to: '/fhir', label: 'FHIR R4 Export', icon: HiOutlineCode, badge: 'HL7 Valid' },
      { to: '/metrics', label: 'Measured KPIs', icon: HiOutlineClipboardCheck, badge: '96.8% F1' },
      { to: '/upload', label: 'Upload Medical Records', icon: HiOutlineUpload, badge: 'OCR & Photos' }
    ]
  }
];

export default function Sidebar({ mobileOpen, onClose }) {
  const linkClass = ({ isActive }) =>
    `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
      isActive
        ? 'bg-emerald-100 text-emerald-950 font-bold shadow-xs border border-emerald-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          type="button"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <HiOutlineX className="text-xl" />
        </button>

        {/* Brand Header */}
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400 bg-emerald-600 text-white shadow-xs font-black text-sm">
              +
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  CareSync<span className="text-emerald-600">IQ</span>
                </span>
                <span className="rounded-md bg-emerald-200/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-950 border border-emerald-300 uppercase">
                  HealthTech
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-tight truncate mt-0.5">
                Longitudinal Health Records
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-emerald-200/60 pt-2 text-[10px] text-slate-600">
            <span className="flex items-center gap-1 font-medium text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sovereign In-Memory
            </span>
            <span className="font-semibold text-slate-400">IIITDM 2026</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 space-y-4">
          {groups.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {group.title}
              </p>
              <div className="mt-1 space-y-1">
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={linkClass}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="text-base text-slate-500 group-hover:text-slate-800 transition" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 group-hover:bg-emerald-200 group-hover:text-emerald-900 transition">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-auto border-t border-slate-200 pt-3 text-[10px] text-slate-400 text-center">
          <span className="font-bold text-emerald-700">SYNTHETIC DEMO DATA</span>
          <p className="text-[9px] text-slate-400 mt-0.5">No Real PHI • Zero Hallucination Ground Truth</p>
        </div>
      </aside>
    </>
  );
}
