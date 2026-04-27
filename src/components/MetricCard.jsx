import React from 'react';

const VERDICT_COLORS = {
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  RED: '#ef4444',
};

const VERDICT_BG = {
  GREEN: 'rgba(34,197,94,0.1)',
  YELLOW: 'rgba(234,179,8,0.1)',
  RED: 'rgba(239,68,68,0.1)',
};

const VERDICT_LABELS = {
  GREEN: 'Passed',
  YELLOW: 'Caution',
  RED: 'Biased',
};

const MetricCard = ({ label, value, verdict }) => {
  const color = VERDICT_COLORS[verdict] || '#6b7280';
  const bg = VERDICT_BG[verdict] || 'rgba(107,114,128,0.1)';
  const displayVal = typeof value === 'number' ? value.toFixed(4) : String(value ?? '—');

  return (
    <div
      className="metric-card"
      style={{
        borderColor: color,
        background: `linear-gradient(135deg, #ffffff 0%, ${bg} 100%)`,
      }}
    >
      <p className="metric-label">{label}</p>

      <p className="metric-value" style={{ color }}>
        {displayVal}
      </p>

      <span
        className="metric-badge"
        style={{ backgroundColor: bg, color, border: `1px solid ${color}` }}
      >
        {VERDICT_LABELS[verdict] || verdict}
      </span>
    </div>
  );
};

export default MetricCard;
