import React, { useState } from 'react';
import './App.css';
import UploadPanel from './components/UploadPanel';
import ColumnSelector from './components/ColumnSelector';
import MetricCard from './components/MetricCard';
import BiasChart from './components/BiasChart';
import ProxyWarning from './components/ProxyWarning';
import { runAudit, fixBias } from './api/client';

function App() {
  const [uploadData, setUploadData] = useState(null);
  const [results, setResults] = useState(null);
  const [fixed, setFixed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditError, setAuditError] = useState(null);
  const [fixError, setFixError] = useState(null);
  const [fixing, setFixing] = useState(false);

  // Track selected columns so we can reuse them for fixBias
  const [selectedCols, setSelectedCols] = useState({ outcome_col: '', protected_attr: '' });

  const handleUpload = (data) => {
    setUploadData(data);
    setResults(null);
    setFixed(false);
    setAuditError(null);
    setFixError(null);
    setSelectedCols({ outcome_col: '', protected_attr: '' });
  };

  const handleAuditSubmit = async (outcome_col, protected_attr) => {
    setLoading(true);
    setAuditError(null);
    setResults(null);
    setFixed(false);
    setSelectedCols({ outcome_col, protected_attr });
    try {
      const data = await runAudit(outcome_col, protected_attr);
      setResults(data);
    } catch (err) {
      setAuditError(err?.response?.data?.detail || 'Audit failed. Please check your selections and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFixBias = async () => {
    setFixing(true);
    setFixError(null);
    try {
      await fixBias(selectedCols.outcome_col, selectedCols.protected_attr);
      setFixed(true);
    } catch (err) {
      setFixError(err?.response?.data?.detail || 'Bias mitigation failed. Please try again.');
    } finally {
      setFixing(false);
    }
  };

  const spVerdict = results
    ? Math.abs(results.statistical_parity_difference) < 0.1 ? 'GREEN' : 'RED'
    : null;

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  return (
    <div className="app-root">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-glow" />
        <div className="header-content">
          <div className="header-badge">
            <span role="img" aria-label="scales">⚖️</span>
          </div>
          <div>
            <h1 className="app-title">AI Bias Auditor</h1>
            <p className="app-subtitle">
              Detect, visualise & mitigate algorithmic bias in your datasets
            </p>
          </div>
        </div>
        <div className="header-chips">
          <span className="chip">Disparate Impact</span>
          <span className="chip">Statistical Parity</span>
          <span className="chip">Reweighing Mitigation</span>
        </div>
      </header>

      <main className="app-main">
        {/* ── Step 1: Upload ──────────────────────────────────────────── */}
        <section className="step-section">
          <div className="step-label">
            <span className="step-number">1</span>
            <span>Upload Dataset</span>
          </div>
          <UploadPanel onUpload={handleUpload} />
        </section>

        {/* ── Step 2: Configure ───────────────────────────────────────── */}
        {uploadData && (
          <section className="step-section animate-in">
            <div className="step-label">
              <span className="step-number">2</span>
              <span>Configure Audit</span>
            </div>
            <ColumnSelector
              columns={uploadData.columns || []}
              onSubmit={handleAuditSubmit}
            />
          </section>
        )}

        {/* ── Audit Loading ────────────────────────────────────────────── */}
        {loading && (
          <div className="loading-bar-wrap animate-in">
            <div className="loading-bar">
              <div className="loading-bar-fill" />
            </div>
            <p className="loading-text">Running bias audit…</p>
          </div>
        )}

        {/* ── Audit Error ──────────────────────────────────────────────── */}
        {auditError && (
          <div className="alert alert-error animate-in">
            <span>⚠ {auditError}</span>
          </div>
        )}

        {/* ── Step 3: Results ─────────────────────────────────────────── */}
        {results && (
          <section className="step-section animate-in">
            <div className="step-label">
              <span className="step-number">3</span>
              <span>Audit Results</span>
            </div>

            <h2 className="results-heading">Bias Metrics</h2>

            <div className="metrics-grid">
              <MetricCard
                label="Disparate Impact"
                value={results.disparate_impact}
                verdict={results.verdict}
              />
              <MetricCard
                label="Statistical Parity Diff"
                value={results.statistical_parity_difference}
                verdict={spVerdict}
              />
            </div>

            <BiasChart groupRepresentation={results.group_representation} />

            <ProxyWarning proxyVariables={results.proxy_variables} />

            {/* ── Fix Bias Button ──────────────────────────────────────── */}
            {!fixed && (
              <div className="fix-section">
                <p className="fix-description">
                  Apply <strong>Reweighing</strong> — a pre-processing bias mitigation
                  technique that assigns instance weights to balance representation across groups.
                </p>
                <button
                  className="btn-fix"
                  onClick={handleFixBias}
                  disabled={fixing}
                  id="fix-bias-btn"
                >
                  {fixing ? (
                    <>
                      <div className="spinner spinner-white" />
                      Applying Reweighing…
                    </>
                  ) : (
                    <>
                      <span role="img" aria-label="magic">✨</span>
                      Fix Bias (Reweighing)
                    </>
                  )}
                </button>
                {fixError && (
                  <div className="alert alert-error" style={{ marginTop: '12px' }}>
                    ⚠ {fixError}
                  </div>
                )}
              </div>
            )}

            {/* ── Fixed Success ───────────────────────────────────────── */}
            {fixed && (
              <div className="fixed-success animate-in">
                <div className="fixed-icon">✓</div>
                <div>
                  <h3 className="fixed-title">Bias Mitigation Applied!</h3>
                  <p className="fixed-desc">
                    The reweighed dataset is ready. Download it below.
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
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>AI Bias Auditor · Powered by AIF360 &amp; React</p>
      </footer>
    </div>
  );
}

export default App;
