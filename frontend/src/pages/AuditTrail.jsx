import React, { useState, useEffect } from 'react';
import {
  HiOutlineClipboardCheck,
  HiOutlineRefresh,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineInformationCircle
} from 'react-icons/hi';

const CLINICAL_AUDIT_LOGS = [
  {
    id: 'LOG-001',
    timestamp: '2026-03-12T10:15:00.000Z',
    eventType: 'RECORD_INGESTION',
    patient: 'Rajesh Sharma (P1001)',
    actor: 'Dr. Lal PathLabs Portal',
    document: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
    action: 'Ingested Comprehensive Lipid Panel & Fasting Glucose',
    status: 'Verified & Indexed',
    verificationId: 'VER-P1001-LAL-2026'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-03-12T10:18:22.000Z',
    eventType: 'CLINICAL_VERIFICATION',
    patient: 'Rajesh Sharma (P1001)',
    actor: 'Dr. Neha Kapoor (MCI-77412)',
    document: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
    action: 'Biochemist reviewed & verified HbA1c 7.8% and Lipid values',
    status: 'Clinician Certified',
    verificationId: 'VER-SIGN-77412'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-03-14T11:30:00.000Z',
    eventType: 'PRESCRIPTION_LOGGED',
    patient: 'Rajesh Sharma (P1001)',
    actor: 'Dr. Arvind Rao (Apollo Sugar Clinic)',
    document: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
    action: 'Prescribed Metformin 500mg BD + Telmisartan 40mg. Documented Penicillin allergy.',
    status: 'Active Regimen',
    verificationId: 'VER-P1001-APOLLO-991'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-03-28T09:40:00.000Z',
    eventType: 'SAFETY_ALERT_TRIGGERED',
    patient: 'Rajesh Sharma (P1001)',
    actor: 'CareSyncIQ Safety Engine',
    document: 'metropolis_lipid_panel_duplicate_p1001.pdf',
    action: 'Duplicate Lipid Panel flagged (16-day interval). Prevented ₹1,200 redundant test.',
    status: 'Duplicate Flagged',
    verificationId: 'ALERT-DUP-16D'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-04-05T14:10:00.000Z',
    eventType: 'RECONCILIATION_FLAG',
    patient: 'Rajesh Sharma (P1001)',
    actor: 'CareSyncIQ Reconciler',
    document: 'city_family_clinic_conflicting_rx_p1001.pdf',
    action: 'Conflicting Metformin dosage detected across providers (500mg BD vs 850mg BD).',
    status: 'Needs Confirmation',
    verificationId: 'ALERT-RX-CONFLICT'
  },
  {
    id: 'LOG-006',
    timestamp: '2026-04-09T18:00:00.000Z',
    eventType: 'PATIENT_CONSENT_GRANTED',
    patient: 'Rajesh Sharma (P1001)',
    actor: 'Patient Self-Service Portal',
    document: 'Electronic Health Record',
    action: 'Generated temporary passcode DOC-9421 (Scope: Cardiometabolic Labs, 24 Hours).',
    status: 'Active Authorization',
    verificationId: 'CONSENT-DOC-9421'
  }
];

export default function AuditTrail() {
  const [logs, setLogs] = useState(CLINICAL_AUDIT_LOGS);
  const [filterType, setFilterType] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  const filteredLogs = filterType === 'ALL'
    ? logs
    : logs.filter(l => l.eventType === filterType);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <HiOutlineClipboardCheck className="text-xl" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Audit Trail & Activity Log
            </h1>
            <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-950 border border-emerald-300">
              Verified Provenance
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Comprehensive audit record tracking every document ingestion, clinical review, safety check, and patient consent event.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
        >
          <HiOutlineRefresh className={`text-base text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Audit Log
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Trail Status</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-black text-emerald-700 tracking-tight">
              100% Verified
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            All clinical actions logged with authenticated timestamps
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logged Events</p>
          <div className="mt-2 flex items-center gap-2 text-slate-900 font-bold text-base">
            <HiOutlineDocumentText className="text-emerald-600 text-lg" />
            <span>{logs.length} Total Entries</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Ingestion, safety flags, and doctor consults
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Patient Scope</p>
          <div className="mt-2 flex items-center gap-2 text-slate-900 font-bold text-base">
            <HiOutlineUser className="text-emerald-600 text-lg" />
            <span>Rajesh Sharma (P1001)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Multi-provider longitudinal history
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Provenance Standards</p>
          <div className="mt-2 flex items-center gap-1.5 text-slate-900 font-bold text-base">
            <HiOutlineShieldCheck className="text-emerald-600 text-lg" />
            <span>Statutory Medical Log</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Immutable clinical record keeping
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {['ALL', 'RECORD_INGESTION', 'CLINICAL_VERIFICATION', 'SAFETY_ALERT_TRIGGERED', 'PATIENT_CONSENT_GRANTED'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              filterType === type
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Chronological Activity & Verification Trail
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredLogs.length} Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Actor / Provider</th>
                <th className="py-2.5 px-3">Clinical Action</th>
                <th className="py-2.5 px-3">Verification ID</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{log.id}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 uppercase">
                      {log.eventType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{log.actor}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-xs">{log.action}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-emerald-800 font-bold">{log.verificationId}</td>
                  <td className="py-3 px-3">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      log.status.includes('Verified') || log.status.includes('Certified') || log.status.includes('Active')
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medical Governance Notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
          <HiOutlineInformationCircle className="text-emerald-600 text-base" />
          Clinical Governance & Audit Trail Integrity
        </h3>
        <p>
          CareSyncIQ maintains a detailed chronological log of every clinical observation, prescription edit, lab result ingestion, and patient consent authorization. This provides patients and clinicians with transparent accountability and verifiable continuity of care across all participating clinics and hospitals.
        </p>
      </div>
    </div>
  );
}
