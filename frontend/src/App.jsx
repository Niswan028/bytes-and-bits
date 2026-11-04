import React, { Component, useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ForensicProvider } from './context/ForensicContext';

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

// ForensIQ page chunks
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const CrossDocHub = lazyWithRetry(() => import('./pages/CrossDocHub'));
const ReportGenerator = lazyWithRetry(() => import('./pages/ReportGenerator'));
const VerificationQueue = lazyWithRetry(() => import('./pages/VerificationQueue'));
const AuditTrail = lazyWithRetry(() => import('./pages/AuditTrail'));
const Upload = lazyWithRetry(() => import('./pages/Upload'));
const Chat = lazyWithRetry(() => import('./pages/Chat'));
const AIMetrics = lazyWithRetry(() => import('./pages/AIMetrics'));

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 p-6">
      <div className="h-20 w-full rounded-2xl bg-slate-800/60" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 rounded-xl bg-slate-800/60" />
        <div className="h-28 rounded-xl bg-slate-800/60" />
        <div className="h-28 rounded-xl bg-slate-800/60" />
        <div className="h-28 rounded-xl bg-slate-800/60" />
      </div>
      <div className="h-96 w-full rounded-2xl bg-slate-800/60" />
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
    console.error('App ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
          <div className="max-w-md rounded-3xl border border-cyan-500/40 bg-slate-900 p-8 shadow-xl">
            <span className="inline-block h-3.5 w-3.5 animate-ping rounded-full bg-cyan-400 mb-4" />
            <h1 className="text-xl font-bold text-white">ForensIQ System Alert</h1>
            <p className="mt-2 text-sm text-slate-400">
              Session refreshed to load latest SOC modules.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-400 bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-cyan-400 transition"
            >
              Refresh Terminal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ForensicProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
              <Route path="/cross-doc" element={<Suspense fallback={<PageFallback />}><CrossDocHub /></Suspense>} />
              <Route path="/dossier" element={<Suspense fallback={<PageFallback />}><ReportGenerator /></Suspense>} />
              <Route path="/reports" element={<Navigate to="/dossier" replace />} />
              <Route path="/verify" element={<Suspense fallback={<PageFallback />}><VerificationQueue /></Suspense>} />
              <Route path="/audit" element={<Suspense fallback={<PageFallback />}><AuditTrail /></Suspense>} />
              <Route path="/upload" element={<Suspense fallback={<PageFallback />}><Upload /></Suspense>} />
              <Route path="/copilot" element={<Suspense fallback={<PageFallback />}><Chat /></Suspense>} />
              <Route path="/chat" element={<Navigate to="/copilot" replace />} />
              <Route path="/metrics" element={<Suspense fallback={<PageFallback />}><AIMetrics /></Suspense>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ForensicProvider>
    </ErrorBoundary>
  );
}

export default App;
