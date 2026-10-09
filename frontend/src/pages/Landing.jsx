import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineTrendingUp,
  HiOutlineUser,
  HiOutlineLightningBolt,
  HiOutlineExclamationCircle,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlineCode,
  HiOutlineClock,
  HiOutlineLockClosed
} from 'react-icons/hi';

const PROBLEM_POINTS = [
  {
    title: 'Scattered Records Across Providers',
    desc: 'Prescriptions, lab reports, scans, and discharge summaries sit in disconnected clinics and WhatsApp chats, with no single unified timeline.'
  },
  {
    title: 'Unreliable Recall During Consults',
    desc: 'Chronic patients struggle to recall past dosages and allergy histories. Clinicians are forced to make decisions from incomplete information.'
  },
  {
    title: 'Repeated Tests & Prescription Conflicts',
    desc: 'Without access to prior records, expensive diagnostic panels are redone unnecessarily, and overlapping or interacting medications are prescribed.'
  },
  {
    title: 'Broken Continuity in Emergency Care',
    desc: 'When moving cities or arriving at an ER, new clinicians start completely from scratch without a verified view of critical allergies and diagnoses.'
  }
];

const SOLUTION_MODULES = [
  {
    title: 'Longitudinal Health Timeline',
    desc: 'Visualizes diagnoses, prescription history, and biomarker trend charts with reference bands across every doctor visit.',
    link: '/timeline',
    icon: HiOutlineTrendingUp,
    badge: 'Biomarkers'
  },
  {
    title: 'Safety & Reconciliation Hub',
    desc: 'Automated duplicate test detection (30-day window), drug-drug interaction flags, and allergy contraindication cross-checks.',
    link: '/safety',
    icon: HiOutlineExclamationCircle,
    badge: '₹1,200 Saved'
  },
  {
    title: 'Patient Consent & Time-Limited Sharing',
    desc: 'Mobile-first portal allowing patients to generate 1-time DOC codes, set expiration windows, and revoke access instantly.',
    link: '/patient',
    icon: HiOutlineUser,
    badge: 'Mobile Portal'
  },
  {
    title: '1-Tap Emergency Care Handoff',
    desc: 'Instant triage view highlighting blood group, severe allergies, active medications, and downloadable 1-page emergency PDF.',
    link: '/handoff',
    icon: HiOutlineLightningBolt,
    badge: '1-Tap ER'
  },
  {
    title: 'Grounded Clinical Copilot',
    desc: 'Natural language clinical inquiries with exact document/page citations, multilingual voice input, and zero hallucination.',
    link: '/chat',
    icon: HiOutlineChatAlt2,
    badge: 'Indic Voice'
  },
  {
    title: 'HL7 FHIR R4 & Clinical Audit Trail',
    desc: 'Bilateral interoperability export conforming to FHIR Release 4 and comprehensive clinical audit tracking.',
    link: '/fhir',
    icon: HiOutlineCode,
    badge: 'FHIR R4'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-xl shadow-xs">
              +
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  CareSync<span className="text-emerald-600">IQ</span>
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-950 border border-emerald-300 uppercase">
                  HealthTech
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500">
                Patient-Owned Longitudinal Health Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">
              IIITDM Kancheepuram Hackathon
            </span>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <span>Open Patient Command Center</span>
              <HiOutlineArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-900">
            <HiOutlineShieldCheck className="text-base text-emerald-600" />
            <span>Problem Statement: Lost in Transit • Fragmented Medical Records</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Unify records from every doctor into <br />
            <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy underline-offset-8">
              one verified health timeline.
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed">
            A patient-owned sovereign platform that aggregates prescriptions, lab reports, and phone photos across clinics into a single timeline. Eliminates duplicate tests, flags dangerous prescription conflicts, and shares exactly the right history for exactly as long as you allow.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <span>Explore Live Patient Overview</span>
              <HiOutlineArrowRight className="text-base" />
            </Link>
            <Link
              to="/timeline"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              <span>Interactive Biomarker Timeline</span>
            </Link>
          </div>

          {/* Quick KPI Strip */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-2xl font-black text-slate-900">96.8%</span>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Extraction F1-Score</p>
              <p className="text-[11px] text-slate-400">32-sample ground truth test set</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-2xl font-black text-emerald-700">₹1,200</span>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Avoided Per Duplicate</p>
              <p className="text-[11px] text-slate-400">Diagnostic tariff savings</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-2xl font-black text-slate-900">0.04s</span>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Fact Retrieval</p>
              <p className="text-[11px] text-slate-400">vs 12 min manual search</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-2xl font-black text-slate-900">100%</span>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Audit Verified</p>
              <p className="text-[11px] text-slate-400">Complete clinical provenance</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Space */}
      <section className="py-16 border-b border-slate-200 bg-slate-100/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <h2 className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest">
              The Healthcare Crisis
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Fragmented Records Harm Patient Care
            </h3>
            <p className="text-sm text-slate-600">
              Patients with chronic conditions (diabetes, hypertension, thyroid, asthma) see multiple providers over years without a unified record system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEM_POINTS.map((pt, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-800 text-xs font-black">
                  0{i + 1}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm">{pt.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Architecture Modules */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <h2 className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest">
              Engineered Solution
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Core Technical Capabilities of CareSyncIQ
            </h3>
            <p className="text-sm text-slate-600">
              Built for speed, sovereign privacy, zero generative hallucinations, and clinical auditability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTION_MODULES.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={idx}
                  to={mod.link}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs transition hover:border-emerald-400 hover:bg-white hover:shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                        <Icon className="text-xl" />
                      </div>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-950 border border-emerald-300">
                        {mod.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:gap-2.5 transition-all">
                    <span>Explore Module</span>
                    <HiOutlineArrowRight className="text-sm" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer & Synthetic Disclosure */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">CareSyncIQ</span>
            <span>• Built for 24-Hour Web Development Hackathon, IIITDM Kancheepuram</span>
          </div>
          <div className="rounded-lg bg-emerald-50 px-3 py-1 border border-emerald-200 text-emerald-900 font-bold text-[11px]">
            SYNTHETIC DEMO DATA ONLY • NO REAL PHI
          </div>
        </div>
      </footer>
    </div>
  );
}
