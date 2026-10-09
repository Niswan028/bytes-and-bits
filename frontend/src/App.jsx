import React, { Component, useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Robust lazy loading with automatic retry on new deployments
function lazyWithRetry(componentImport) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      const isChunkError =
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Importing a module script failed') ||
        error?.message?.includes('dynamically imported module');

      if (isChunkError && typeof window !== 'undefined') {
        const lastReload = window.sessionStorage.getItem('chunk_reload_ts');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
          window.sessionStorage.setItem('chunk_reload_ts', now.toString());
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw error;
    }
  });
}

// Lazy-loaded CareSyncIQ page chunks
const Landing = lazyWithRetry(() => import('./pages/Landing'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const TimelinePage = lazyWithRetry(() => import('./pages/TimelinePage'));
const PatientPortal = lazyWithRetry(() => import('./pages/PatientPortal'));
const DoctorHandoff = lazyWithRetry(() => import('./pages/DoctorHandoff'));
const SafetyChecks = lazyWithRetry(() => import('./pages/SafetyChecks'));
const Chat = lazyWithRetry(() => import('./pages/Chat'));
const VerificationQueue = lazyWithRetry(() => import('./pages/VerificationQueue'));
const AuditTrail = lazyWithRetry(() => import('./pages/AuditTrail'));
const ReportGenerator = lazyWithRetry(() => import('./pages/ReportGenerator'));
const FhirExport = lazyWithRetry(() => import('./pages/FhirExport'));
const AIMetrics = lazyWithRetry(() => import('./pages/AIMetrics'));
const Upload = lazyWithRetry(() => import('./pages/Upload'));

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 p-6">
      <div className="h-20 w-full rounded-2xl bg-zinc-100/80" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 rounded-xl bg-zinc-100/80" />
        <div className="h-28 rounded-xl bg-zinc-100/80" />
        <div className="h-28 rounded-xl bg-zinc-100/80" />
        <div className="h-28 rounded-xl bg-zinc-100/80" />
      </div>
      <div className="h-96 w-full rounded-2xl bg-zinc-100/80" />
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    const isChunkError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('dynamically imported module');

    if (isChunkError && typeof window !== 'undefined') {
      const lastReload = window.sessionStorage.getItem('chunk_reload_ts');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
        window.sessionStorage.setItem('chunk_reload_ts', now.toString());
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message?.includes('Importing a module script failed') ||
        this.state.error?.message?.includes('dynamically imported module');

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="max-w-md rounded-3xl border border-emerald-300 bg-white p-8 shadow-xl">
            <span className="inline-block h-3.5 w-3.5 animate-ping rounded-full bg-emerald-500 mb-4" />
            <h1 className="text-xl font-bold text-slate-900">
              {isChunkError ? 'Updating to Latest Deployment' : 'CareSyncIQ Notice'}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {isChunkError
                ? 'A new system update was applied. Refreshing to load latest modules...'
                : 'A module requires reloading to restore session integrity.'}
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-400 bg-emerald-100 px-5 py-2.5 text-xs font-bold text-emerald-950 shadow-xs hover:bg-emerald-200 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Suspense fallback={<PageFallback />}><Landing /></Suspense>} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
            <Route path="/timeline" element={<Suspense fallback={<PageFallback />}><TimelinePage /></Suspense>} />
            <Route path="/patient" element={<Suspense fallback={<PageFallback />}><PatientPortal /></Suspense>} />
            <Route path="/handoff" element={<Suspense fallback={<PageFallback />}><DoctorHandoff /></Suspense>} />
            <Route path="/safety" element={<Suspense fallback={<PageFallback />}><SafetyChecks /></Suspense>} />
            <Route path="/chat" element={<Suspense fallback={<PageFallback />}><Chat /></Suspense>} />
            <Route path="/verify" element={<Suspense fallback={<PageFallback />}><VerificationQueue /></Suspense>} />
            <Route path="/audit" element={<Suspense fallback={<PageFallback />}><AuditTrail /></Suspense>} />
            <Route path="/reports" element={<Suspense fallback={<PageFallback />}><ReportGenerator /></Suspense>} />
            <Route path="/fhir" element={<Suspense fallback={<PageFallback />}><FhirExport /></Suspense>} />
            <Route path="/metrics" element={<Suspense fallback={<PageFallback />}><AIMetrics /></Suspense>} />
            <Route path="/upload" element={<Suspense fallback={<PageFallback />}><Upload /></Suspense>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>

        {showInstall && (
          <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
            <div className="flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-100 px-4 py-3 text-emerald-950 shadow-md">
              <span className="font-semibold text-xs sm:text-sm">Install CareSyncIQ on your device for sovereign offline health access</span>
              <button
                type="button"
                className="rounded-lg border border-emerald-400 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
                onClick={handleInstall}
              >
                Install
              </button>
            </div>
          </div>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
