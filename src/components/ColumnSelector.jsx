import React, { useState } from 'react';
import { Activity, ChevronRight } from 'lucide-react';

const ColumnSelector = ({ columns, onSubmit }) => {
  const [outcomeCol, setOutcomeCol]   = useState('');
  const [protectedAttr, setProtectedAttr] = useState('');

  const isReady = outcomeCol && protectedAttr;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReady) onSubmit(outcomeCol, protectedAttr);
  };

  return (
    <div className="card config-card">
      <div className="config-card-header">
        <div className="config-card-icon">
          <Activity />
        </div>
        <div>
          <p className="config-card-title">Configure Analysis</p>
          <p className="config-card-sub">Select the columns to evaluate for bias</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="config-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="outcome-col">
              Target Variable (Outcome)
            </label>
            <div className="form-select-wrap">
              <select
                id="outcome-col"
                className="form-select"
                value={outcomeCol}
                onChange={(e) => setOutcomeCol(e.target.value)}
              >
                <option value="">Select target column…</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
            <p className="form-hint">The prediction outcome (e.g., Loan_Approved).</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="protected-attr">
              Protected Attribute
            </label>
            <div className="form-select-wrap">
              <select
                id="protected-attr"
                className="form-select"
                value={protectedAttr}
                onChange={(e) => setProtectedAttr(e.target.value)}
              >
                <option value="">Select protected class…</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
            <p className="form-hint">The sensitive group to test for bias (e.g., Gender, Race).</p>
          </div>
        </div>

        <div className="config-footer">
          <button
            type="submit"
            className="btn-analyze"
            disabled={!isReady}
            id="run-audit-btn"
          >
            Run Bias Analysis
            <ChevronRight />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColumnSelector;
