import React from 'react';

function biasStrength(verdict) {
  if (verdict === 'RED') return 'strong';
  if (verdict === 'YELLOW') return 'mild';
  return 'no';
}

function verdictRec(verdict) {
  if (verdict === 'RED')
    return 'We strongly recommend not using this dataset to train any decision-making model until the bias is addressed.';
  if (verdict === 'YELLOW')
    return 'We recommend reviewing the dataset and considering bias mitigation before deployment.';
  return 'This dataset appears suitable for fair model training, though ongoing monitoring is advised.';
}

function diColor(score) {
  if (score < 0.8) return '#ef4444';
  if (score < 0.9) return '#eab308';
  return '#22c55e';
}

function gapColor(absGap) {
  if (absGap < 0.1) return '#22c55e';
  if (absGap < 0.2) return '#eab308';
  return '#ef4444';
}

export default function ResultsSummary({
  disparate_impact,
  statistical_parity_difference,
  group_representation,
  proxy_variables,
  verdict,
  outcome_col,
  protected_attr,
}) {
  const di = typeof disparate_impact === 'number' ? disparate_impact : 0;
  const spd =
    typeof statistical_parity_difference === 'number'
      ? statistical_parity_difference
      : 0;
  const absGap = Math.abs(spd);
  const gap_pct = Math.round(absGap * 100);
  const unprivilegedPct = Math.round(di * 100);
  const proxyKeys = proxy_variables ? Object.keys(proxy_variables) : [];
  const proxyCount = proxyKeys.length;
  const v = (verdict || 'RED').toUpperCase();

  return (
    <div className="result-card summary-card">
      <h3 className="summary-card__heading">Here is what we found</h3>

      <p className="summary-card__narrative">
        We analyzed your dataset and checked whether the column{' '}
        <strong>"{outcome_col || '—'}"</strong> is affected by{' '}
        <strong>"{protected_attr || '—'}"</strong>.
      </p>

      <p className="summary-card__narrative">
        The results show <strong>{biasStrength(v)} evidence of bias</strong>.
        People in the less-favored group are approved at{' '}
        <strong style={{ color: diColor(di) }}>{unprivilegedPct}%</strong> the
        rate of the favored group — a gap of{' '}
        <strong style={{ color: gapColor(absGap) }}>{gap_pct} percentage points</strong>.
      </p>

      {proxyCount > 0 && (
        <p className="summary-card__narrative">
          We also found{' '}
          <strong style={{ color: '#ef4444' }}>
            {proxyCount} column{proxyCount > 1 ? 's' : ''}
          </strong>{' '}
          that indirectly carry group information:{' '}
          <strong>{proxyKeys.join(', ')}</strong>. These could allow a model to
          discriminate even without directly using{' '}
          <strong>"{protected_attr || '—'}"</strong>.
        </p>
      )}

      <p className="summary-card__narrative summary-card__narrative--rec">
        {verdictRec(v)}
      </p>

      {/* Stat strip */}
      <div className="summary-stat-strip">
        <div className="summary-stat">
          <span className="summary-stat__label">Disparate Impact</span>
          <span
            className="summary-stat__value"
            style={{ color: diColor(di) }}
          >
            {di.toFixed(3)}
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Approval Gap</span>
          <span
            className="summary-stat__value"
            style={{ color: gapColor(absGap) }}
          >
            {gap_pct}%
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Proxy Risks Found</span>
          <span
            className="summary-stat__value"
            style={{ color: proxyCount > 0 ? '#ef4444' : '#22c55e' }}
          >
            {proxyCount}
          </span>
        </div>
      </div>
    </div>
  );
}
