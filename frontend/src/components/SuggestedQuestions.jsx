import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';

const QUESTIONS = [
  {
    q: "What is Rajesh Sharma's latest HbA1c and current verified metformin dose?",
    category: 'Cardiometabolic & Glycemic Care'
  },
  {
    q: 'Does Priya Venkat have documented allergies to NSAIDs or Aspirin?',
    category: 'Critical Allergy & Contraindication Safety'
  },
  {
    q: "What is Vikram Malhotra's CK-Total level and why was Atorvastatin put on hold?",
    category: 'Severe Statin-Fibrate Rhabdomyolysis Risk'
  },
  {
    q: "Was Sunita Rao's DEXA scan unnecessarily repeated and what is her calcium-thyroid timing?",
    category: 'Radiology Duplication & Chelation Reconciliation'
  },
  {
    q: 'Are there duplicate tests or conflicting prescriptions between Dr. Rao and Dr. Gupta?',
    category: 'Cross-Provider Reconciliation & Waste Prevention'
  },
  {
    q: 'Does the medical record contain a Brain MRI scan or cranial imaging?',
    category: 'Ungrounded Query Guard (Absence Verification)'
  }
];

function SuggestedQuestions({ onSelect }) {
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-2">
      {QUESTIONS.map((item) => (
        <button
          key={item.q}
          onClick={() => onSelect(item.q)}
          className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:border-emerald-500/50 hover:bg-emerald-50/40 hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                {item.category}
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-950">
                {item.q}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-400 transition group-hover:border-emerald-200 group-hover:bg-emerald-100/60 group-hover:text-emerald-700">
              <HiOutlineArrowRight className="text-sm" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default React.memo(SuggestedQuestions);
