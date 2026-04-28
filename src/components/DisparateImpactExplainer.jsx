import React from 'react';

function scoreColor(score) {
  if (score < 0.8) return '#ef4444';
  if (score < 0.9) return '#eab308';
  return '#22c55e';
}

export default function DisparateImpactExplainer({
  disparate_impact,
  protected_attr,
  outcome_col,
}) {
  const score = typeof disparate_impact === 'number' ? disparate_impact : 0;
  const color = scoreColor(score);
  const unprivilegedPct = Math.round(score * 100);
  const barWidth = Math.min(score * 100, 100);
  const aboveBelow = score >= 0.8 ? 'above' : 'below';

  return (
    <div className="result-card">
      <h3 className="result-card__title">
        Disparate Impact{' '}
        <span className="result-card__term-def">
          (how often the less-favored group is approved compared to the favored
          group)
        </span>
      </h3>

      {/* SECTION A — Score */}
      <div className="di-score-section">
        <span className="di-score-label">Disparate Impact Score</span>
        <span className="di-score-value" style={{ color }}>
          {score.toFixed(3)}
        </span>

        {/* Progress bar */}
        <div className="di-bar-wrap">
          <div className="di-bar-track">
            <div
              className="di-bar-fill"
              style={{ width: `${barWidth}%`, background: color }}
            />
            {/* 80% marker */}
            <div className="di-bar-marker" style={{ left: '80%' }}>
              <div className="di-bar-marker__line" />
              <span className="di-bar-marker__label">Fair Zone (80%)</span>
            </div>
          </div>
          <div className="di-bar-ends">
            <span>0</span>
            <span>1.0</span>
          </div>
        </div>
      </div>

      {/* SECTION B — Plain English */}
      <div className="di-plain-section">
        <h4 className="di-section-heading">What does this mean?</h4>
        <div className="di-comparison">
          <div className="di-comparison__side di-comparison__side--bad">
            <span className="di-comparison__group-label">Less Favored Group</span>
            <span className="di-comparison__pct" style={{ color: '#ef4444' }}>
              {unprivilegedPct}%
            </span>
            <span className="di-comparison__caption">approval rate</span>
          </div>
          <div className="di-comparison__vs">vs</div>
          <div className="di-comparison__side di-comparison__side--good">
            <span className="di-comparison__group-label">More Favored Group</span>
            <span className="di-comparison__pct" style={{ color: '#16a34a' }}>
              100%
            </span>
            <span className="di-comparison__caption">approval rate</span>
          </div>
        </div>
        <p className="di-plain-sentence">
          For every <strong>100 people</strong> in the favored group who get
          approved, only{' '}
          <strong style={{ color }}>{unprivilegedPct} people</strong> in the
          less-favored group get approved.
        </p>
      </div>

      {/* SECTION C — Legal Standard */}
      <div className="di-legal-box">
        <p>
          <strong>The 80% Rule</strong> (also called the Four-Fifths Rule) is a
          legal standard used in the US to detect employment and lending
          discrimination. Any score below <strong>0.80</strong> is considered
          evidence of illegal discrimination. Your score of{' '}
          <strong style={{ color }}>{score.toFixed(3)}</strong> is{' '}
          <strong>{aboveBelow}</strong> this threshold.
        </p>
      </div>
    </div>
  );
}
