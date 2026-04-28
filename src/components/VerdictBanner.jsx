import React from 'react';

const CONFIGS = {
  RED: {
    bg: '#fef2f2',
    border: '#ef4444',
    emoji: '🚨',
    headline: 'Significant Bias Detected',
  },
  YELLOW: {
    bg: '#fffbeb',
    border: '#eab308',
    emoji: '⚠️',
    headline: 'Borderline Bias Detected',
    subtext:
      'Your dataset shows mild disparity between groups. While not immediately illegal, this pattern could lead to unfair outcomes at scale. We recommend reviewing the dataset before using it to train any model.',
  },
  GREEN: {
    bg: '#f0fdf4',
    border: '#22c55e',
    emoji: '✅',
    headline: 'No Significant Bias Detected',
    subtext:
      'Your dataset appears to treat both groups fairly. The approval rates between groups are within acceptable limits. Continue to monitor for bias as new data is collected.',
  },
};

export default function VerdictBanner({
  verdict,
  disparate_impact,
  protected_attr,
  outcome_col,
}) {
  const key = (verdict || 'RED').toUpperCase();
  const cfg = CONFIGS[key] || CONFIGS.RED;

  const unprivilegedPct = Math.round((disparate_impact || 0) * 100);

  const subtext =
    key === 'RED'
      ? `Your dataset shows that people in the less-favored group are approved at only ${unprivilegedPct}% of the rate of people in the favored group. This level of disparity is considered illegal discrimination under the US 80% Rule and similar international standards. A model trained on this data would make unfair decisions.`
      : cfg.subtext;

  return (
    <div
      className="verdict-banner"
      style={{
        background: cfg.bg,
        borderLeft: `6px solid ${cfg.border}`,
      }}
    >
      <div className="verdict-banner__emoji">{cfg.emoji}</div>
      <div className="verdict-banner__body">
        <h2 className="verdict-banner__headline" style={{ color: cfg.border }}>
          {cfg.headline}
        </h2>
        <p className="verdict-banner__subtext">{subtext}</p>
        <p className="verdict-banner__columns">
          We analyzed the column{' '}
          <strong>"{outcome_col || '—'}"</strong> as the decision being made,
          and <strong>"{protected_attr || '—'}"</strong> as the group
          characteristic being checked for fairness.
        </p>
      </div>
    </div>
  );
}
