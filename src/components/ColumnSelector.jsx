import React, { useState } from 'react';

const ColumnSelector = ({ columns, onSubmit }) => {
  const [outcomeCol, setOutcomeCol] = useState('');
  const [protectedAttr, setProtectedAttr] = useState('');

  const isReady = outcomeCol && protectedAttr;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReady) onSubmit(outcomeCol, protectedAttr);
  };

  return (
    <div className="column-selector-card">
      <div className="card-header">
        <div className="card-header-icon">⚙️</div>
        <div>
          <h2 className="card-title">Configure Audit Parameters</h2>
          <p className="card-subtitle">Select the columns to analyse for bias</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="selector-form">
        <div className="form-group">
          <label htmlFor="outcome-col" className="form-label">
            Outcome Column
            <span className="label-hint">The column representing the model's prediction or decision</span>
          </label>
          <div className="select-wrapper">
            <select
              id="outcome-col"
              className="form-select"
              value={outcomeCol}
              onChange={(e) => setOutcomeCol(e.target.value)}
            >
              <option value="">— Select outcome column —</option>
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="protected-attr" className="form-label">
            Protected Attribute
            <span className="label-hint">The sensitive column to check for bias (e.g. race, gender)</span>
          </label>
          <div className="select-wrapper">
            <select
              id="protected-attr"
              className="form-select"
              value={protectedAttr}
              onChange={(e) => setProtectedAttr(e.target.value)}
            >
              <option value="">— Select protected attribute —</option>
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

        <button
          type="submit"
          className={`btn-primary ${!isReady ? 'btn-disabled' : ''}`}
          disabled={!isReady}
        >
          <span>Run Bias Audit</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ColumnSelector;
