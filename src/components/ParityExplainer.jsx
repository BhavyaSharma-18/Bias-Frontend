import React from 'react';

function getSeverity(absValue) {
  if (absValue < 0.1) return 'GREEN';
  if (absValue < 0.2) return 'YELLOW';
  return 'RED';
}

const SEVERITY_COLOR = {
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  RED: '#ef4444',
};

const DOT_BG = {
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  RED: '#ef4444',
};

const ROWS = [
  { label: 'Gap below 10%', concern: 'Low concern', sev: 'GREEN' },
  { label: 'Gap 10%–20%', concern: 'Moderate concern', sev: 'YELLOW' },
  { label: 'Gap above 20%', concern: 'High concern', sev: 'RED' },
];

export default function ParityExplainer({
  statistical_parity_difference,
  protected_attr,
}) {
  const raw =
    typeof statistical_parity_difference === 'number'
      ? statistical_parity_difference
      : 0;
  const absValue = Math.abs(raw);
  const direction = raw < 0 ? 'less likely' : 'more likely';
  const severity = getSeverity(absValue);
  const color = SEVERITY_COLOR[severity];
  const gap_pct = Math.round(absValue * 100);

  // Diverging bar: extension width capped at 200px
  const extWidth = Math.min(absValue * 200, 200);
  const isNegative = raw < 0;

  const hiresFromFavored = Math.max(0, 100 - gap_pct);

  return (
    <div className="result-card">
      <h3 className="result-card__title">
        Statistical Parity Difference{' '}
        <span className="result-card__term-def">
          (the gap in approval rates between groups)
        </span>
      </h3>

      {/* SECTION A — Score */}
      <div className="parity-score-section">
        <span className="di-score-label">Approval Rate Gap</span>
        <span className="di-score-value" style={{ color }}>
          {raw >= 0 ? '+' : ''}
          {raw.toFixed(3)}
        </span>

        {/* Diverging bar */}
        <div className="parity-bar-outer">
          <div className="parity-bar-track">
            <div className="parity-bar-center-line" />
            {isNegative ? (
              <div
                className="parity-bar-fill parity-bar-fill--left"
                style={{ width: extWidth, background: '#ef4444' }}
              />
            ) : (
              <div
                className="parity-bar-fill parity-bar-fill--right"
                style={{ width: extWidth, background: '#22c55e' }}
              />
            )}
          </div>
          <span className="parity-bar-no-gap-label">No Gap (0)</span>
        </div>
      </div>

      {/* SECTION B — Plain English */}
      <div className="di-plain-section">
        <h4 className="di-section-heading">What does this mean?</h4>
        <p className="di-plain-sentence">
          People in the less-favored group are{' '}
          <strong style={{ color }}>
            {gap_pct} percentage points {direction}
          </strong>{' '}
          to receive a positive outcome compared to the favored group.
        </p>
        <p className="parity-analogy">
          In a company that hires <strong>100 people</strong> from the favored
          group, only about{' '}
          <strong style={{ color }}>{hiresFromFavored} people</strong> from the
          less-favored group would be hired under the same conditions.
        </p>
      </div>

      {/* SECTION C — Severity Table */}
      <div className="parity-table-section">
        <h4 className="di-section-heading">How serious is this gap?</h4>
        <div className="parity-severity-table">
          {ROWS.map((row) => {
            const isActive = row.sev === severity;
            return (
              <div
                key={row.sev}
                className="parity-severity-row"
                style={
                  isActive
                    ? {
                        borderLeft: `4px solid ${DOT_BG[row.sev]}`,
                        background: `${DOT_BG[row.sev]}18`,
                        fontWeight: 700,
                      }
                    : { borderLeft: '4px solid transparent' }
                }
              >
                <span
                  className="severity-dot"
                  style={{ background: DOT_BG[row.sev] }}
                />
                <span className="parity-severity-range">{row.label}</span>
                <span
                  className="parity-severity-concern"
                  style={isActive ? { color: DOT_BG[row.sev] } : {}}
                >
                  {row.concern}
                  {isActive && ' ← You are here'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
