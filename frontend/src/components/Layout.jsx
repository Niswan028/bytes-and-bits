import { useEffect, useState, Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineUserCircle,
  HiOutlineUserAdd
} from 'react-icons/hi';
import Sidebar from './Sidebar';
import RegisterPatientModal from './RegisterPatientModal';
import { usePatient } from '../context/PatientContext';

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 p-6">
      <div className="h-20 w-full rounded-2xl bg-slate-200/60" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 rounded-xl bg-slate-200/60" />
        <div className="h-28 rounded-xl bg-slate-200/60" />
        <div className="h-28 rounded-xl bg-slate-200/60" />
        <div className="h-28 rounded-xl bg-slate-200/60" />
      </div>
      <div className="h-96 w-full rounded-2xl bg-slate-200/60" />
    </div>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { activePatient, openRegisterModal, patients, activePatientId, setActivePatientId } = usePatient();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <RegisterPatientModal />

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-xs transition hover:border-slate-400 hover:text-slate-900 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <HiOutlineMenu className="text-xl" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 shadow-xs font-black text-white text-xs">
                +
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900">
                CareSync<span className="text-emerald-600">IQ</span>
              </span>
            </div>

            {/* Active Patient Quick Switcher Pill */}
            <div className="hidden sm:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500">Active Chart:</span>
              <select
                value={activePatientId}
                onChange={(e) => setActivePatientId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* + Register New Patient Button */}
            <button
              type="button"
              onClick={openRegisterModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-950 shadow-xs hover:bg-emerald-100 transition"
              title="Add a new sovereign patient chart into CareSyncIQ"
            >
              <HiOutlineUserAdd className="text-emerald-700 text-sm" />
              <span className="hidden md:inline">+ Register Patient</span>
              <span className="md:hidden">+ Patient</span>
            </button>

            {/* Synthetic Data Badge */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 border border-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>SYNTHETIC DEMO DATA</span>
            </div>

            {/* 1-Tap ER Emergency Action */}
            <Link
              to="/handoff"
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 shadow-xs hover:bg-rose-100 transition"
            >
              <HiOutlineLightningBolt className="text-rose-600 text-sm animate-pulse" />
              <span>1-Tap ER Handoff</span>
            </Link>
          </div>
        </header>

        {/* Global Synthetic Data & Offline Notice Bar */}
        <div className="bg-emerald-800 px-4 py-1 text-center text-[11px] font-medium text-emerald-100 flex items-center justify-center gap-2">
          <span>IIITDM Kancheepuram Hackathon • HealthTech: Lost in Transit</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">100% Patient-Owned Verified Data Pipeline</span>
        </div>

        {!online && (
          <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-slate-950">
            Offline mode active. Local embeddings & in-memory intelligence remain available.
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-slate-50">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
