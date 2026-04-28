import React, { useState } from 'react';
import './App.css';

import { Activity, RefreshCw, FileText, ChevronRight, Cpu, ShieldCheck } from 'lucide-react';

import UploadPanel   from './components/UploadPanel';
import ColumnSelector from './components/ColumnSelector';
import ResultsSummary          from './components/ResultsSummary';
import VerdictBanner           from './components/VerdictBanner';
import DisparateImpactExplainer from './components/DisparateImpactExplainer';
import ParityExplainer         from './components/ParityExplainer';
import RepresentationChart     from './components/RepresentationChart';
import ProxyExplainer          from './components/ProxyExplainer';

import { runAudit, fixBias } from './api/client';

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────────── */

/** True if any metric is in danger/red */
const hasBias = (results) => {
  if (!results) return false;
  return (
    results.verdict === 'RED' ||
    (typeof results.statistical_parity_difference === 'number' &&
      Math.abs(results.statistical_parity_difference) >= 0.1)
  );
};

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/* ─────────────────────────────────────────────────────────────────────────
   App
   ───────────────────────────────────────────────────────────────────────── */

export default function App() {
  // Steps: 1 = Upload  2 = Configure  3 = Analyzing  4 = Results
  const [step, setStep]           = useState(1);
  const [uploadData, setUploadData] = useState(null);
  const [fileName, setFileName]   = useState('');
  const [results, setResults]     = useState(null);
  const [auditError, setAuditError] = useState(null);
  const [fixed, setFixed]         = useState(false);
  const [fixing, setFixing]       = useState(false);
  const [fixError, setFixError]   = useState(null);
  const [selectedCols, setSelectedCols] = useState({ outcome_col: '', protected_attr: '' });

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  const handleUpload = (data, name) => {
    setUploadData(data);
    setFileName(name || 'dataset');
    setResults(null);
    setFixed(false);
    setAuditError(null);
    setFixError(null);
    setSelectedCols({ outcome_col: '', protected_attr: '' });
    // Small delay for snappy feel before advancing
    setTimeout(() => setStep(2), 400);
  };

  const handleAuditSubmit = async (outcome_col, protected_attr) => {
    setStep(3);
    setAuditError(null);
    setResults(null);
    setFixed(false);
    setSelectedCols({ outcome_col, protected_attr });
    try {
      const data = await runAudit(outcome_col, protected_attr);
      setResults(data);
      setStep(4);
    } catch (err) {
      setAuditError(
        err?.response?.data?.detail ||
        'Audit failed. Please check your column selections and try again.'
      );
      setStep(2);   // bounce back so user can retry
    }
  };

  const handleFixBias = async () => {
    setFixing(true);
    setFixError(null);
    try {
      await fixBias(selectedCols.outcome_col, selectedCols.protected_attr);
      setFixed(true);
    } catch (err) {
      setFixError(
        err?.response?.data?.detail ||
        'Bias mitigation failed. Please try again.'
      );
    } finally {
      setFixing(false);
    }
  };

  const reset = () => {
    setStep(1);
    setUploadData(null);
    setFileName('');
    setResults(null);
    setFixed(false);
    setAuditError(null);
    setFixError(null);
    setSelectedCols({ outcome_col: '', protected_attr: '' });
  };

  /* ── Derived ──────────────────────────────────────────────────────────── */

  const biasDetected = hasBias(results);

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Fixed full-screen glow blobs */}
      <div className="bg-ornament" aria-hidden="true">
        <div className="bg-ornament__blob bg-ornament__blob--tl" />
        <div className="bg-ornament__blob bg-ornament__blob--br" />
      </div>

      <div className="app-shell">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="app-header">
          <div className="header-brand">
            <div className="header-logo">
              <Activity />
            </div>
            <div>
              <p className="header-app-name">BiasLens</p>
              <p className="header-app-sub">Algorithmic Fairness Dashboard</p>
            </div>
          </div>

          {step > 1 && (
            <button className="btn-reset" onClick={reset} id="start-over-btn">
              <RefreshCw /> Start Over
            </button>
          )}
        </header>

        {/* ── Main ────────────────────────────────────────────────────── */}
        <main>

          {/* ── STEP 1: Upload ──────────────────────────────────────── */}
          {step === 1 && (
            <div className="animate-fade-in-up" style={{ maxWidth: 700, margin: '0 auto' }}>
              <div className="step-hero">
                <h2 className="step-hero__title">Uncover Hidden&nbsp;Biases<br />in Your Data</h2>
                <p className="step-hero__sub">
                  Upload your dataset to automatically evaluate statistical parity,
                  disparate impact, and discover proxy variables that may skew your model.
                </p>
              </div>
              <UploadPanel onUpload={handleUpload} />
            </div>
          )}

          {/* ── STEP 2: Configure ───────────────────────────────────── */}
          {step === 2 && (
            <div className="animate-fade-in-up" style={{ maxWidth: 860, margin: '0 auto' }}>
              {/* Breadcrumb */}
              <div className="breadcrumb">
                <span className="breadcrumb__file">
                  <FileText />
                  {fileName}
                </span>
                <ChevronRight />
                <span className="breadcrumb__active">Configure Variables</span>
              </div>

              <ColumnSelector
                columns={uploadData?.columns || []}
                onSubmit={handleAuditSubmit}
              />

              {/* Audit error shown below the form */}
              {auditError && (
                <div className="upload-error-msg" style={{ marginTop: 16 }}>
                  ⚠ {auditError}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Analyzing ───────────────────────────────────── */}
          {step === 3 && (
            <div className="analyzing-wrap animate-fade-in-up">
              <div className="spinner-ring-wrap">
                <div className="spinner-ring" />
                <div className="spinner-ring--active" />
                <Cpu className="spinner-cpu" />
              </div>
              <h3 className="analyzing-title">Analyzing Dataset</h3>
              <p className="analyzing-sub">
                Calculating fairness metrics and scanning for proxy variables…
              </p>
              <div className="loading-bar-outer">
                <div className="loading-bar-inner" />
              </div>
            </div>
          )}

          {/* ── STEP 4: Results ─────────────────────────────────────── */}
          {step === 4 && results && (
            <div className="animate-fade-in-up">

              {/* Results header */}
              <div className="results-header">
                <div>
                  <h2 className="results-header__title">Fairness Report</h2>
                  <p className="results-header__sub">
                    Analysis complete for <strong style={{ color: '#e2e8f0' }}>{fileName}</strong>.
                    Review the metrics below.
                  </p>
                </div>
                <div className="status-badge">
                  Status:{' '}
                  {biasDetected
                    ? <span className="status-badge--biased">Bias Detected</span>
                    : <span className="status-badge--clean">Looks Fair</span>
                  }
                </div>
              </div>

              {/* 1. Narrative summary */}
              <section style={{ marginBottom: 32 }}>
                <ResultsSummary
                  disparate_impact={results.disparate_impact}
                  statistical_parity_difference={results.statistical_parity_difference}
                  group_representation={results.group_representation}
                  proxy_variables={results.proxy_variables}
                  verdict={results.verdict}
                  outcome_col={selectedCols.outcome_col}
                  protected_attr={selectedCols.protected_attr}
                />
              </section>

              {/* 2. Verdict Banner */}
              <section style={{ marginBottom: 32 }}>
                <VerdictBanner
                  verdict={results.verdict}
                  disparate_impact={results.disparate_impact}
                  protected_attr={selectedCols.protected_attr}
                  outcome_col={selectedCols.outcome_col}
                />
              </section>

              {/* 3. Disparate Impact deep dive */}
              <section style={{ marginBottom: 32 }}>
                <DisparateImpactExplainer
                  disparate_impact={results.disparate_impact}
                  protected_attr={selectedCols.protected_attr}
                  outcome_col={selectedCols.outcome_col}
                  group_representation={results.group_representation}
                />
              </section>

              {/* 4. Statistical Parity deep dive */}
              <section style={{ marginBottom: 32 }}>
                <ParityExplainer
                  statistical_parity_difference={results.statistical_parity_difference}
                  protected_attr={selectedCols.protected_attr}
                />
              </section>

              {/* 5. Group Representation chart */}
              <section style={{ marginBottom: 32 }}>
                <RepresentationChart
                  group_representation={results.group_representation}
                  protected_attr={selectedCols.protected_attr}
                />
              </section>

              {/* 6. Proxy Variables */}
              <section style={{ marginBottom: 32 }}>
                <ProxyExplainer
                  proxy_variables={results.proxy_variables}
                  protected_attr={selectedCols.protected_attr}
                />
              </section>

              {/* 7. Fix Bias / Mitigation */}
              {!fixed ? (
                <div className="card fix-card">
                  <div className="fix-card__header">
                    <ShieldCheck />
                    <h3 className="fix-card__title">Apply Bias Mitigation</h3>
                  </div>
                  <p className="fix-card__desc">
                    <strong>Reweighing</strong> is a pre-processing technique that assigns
                    instance weights to balance representation across demographic groups —
                    without altering any labels or predictions.
                  </p>
                  <button
                    className="btn-fix"
                    onClick={handleFixBias}
                    disabled={fixing}
                    id="fix-bias-btn"
                  >
                    {fixing ? (
                      <>
                        <div className="inline-spinner" />
                        Applying Reweighing…
                      </>
                    ) : (
                      <>
                        <ShieldCheck />
                        Fix Bias (Reweighing)
                      </>
                    )}
                  </button>
                  {fixError && (
                    <p className="fix-error">⚠ {fixError}</p>
                  )}
                </div>
              ) : (
                <div className="fixed-success animate-fade-in-up">
                  <div className="fixed-success__icon">✓</div>
                  <div>
                    <h3 className="fixed-success__title">Bias Mitigation Applied!</h3>
                    <p className="fixed-success__desc">
                      The reweighed dataset is ready. Download it below to use in your pipeline.
                    </p>
                    <a
                      href={`${BASE_URL}/download-fixed`}
                      className="btn-download"
                      download
                      id="download-fixed-link"
                    >
                      ⬇ Download Fixed Dataset
                    </a>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="app-footer">
          BiasLens · Powered by AIF360 &amp; React · Algorithmic Fairness Dashboard
        </footer>

      </div>
    </>
  );
}
