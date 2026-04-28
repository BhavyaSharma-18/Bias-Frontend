import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

function barColor(pct) {
  if (pct < 20) return '#ef4444';
  if (pct < 35) return '#eab308';
  return '#6366f1';
}

function healthLabel(pct) {
  if (pct < 20) return 'Critically underrepresented';
  if (pct < 35) return 'Underrepresented';
  return 'Healthy';
}

function xLabel(key) {
  if (key === '0') return 'Less Favored Group';
  if (key === '1') return 'More Favored Group';
  return `Group ${key}`;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const { group, percentage } = payload[0].payload;
  return (
    <div className="rep-tooltip">
      <strong>{xLabel(group)}</strong> makes up <strong>{percentage}%</strong>{' '}
      of your dataset.
      <br />
      <span style={{ color: barColor(percentage) }}>
        {healthLabel(percentage)}
      </span>
    </div>
  );
};

export default function RepresentationChart({ group_representation, protected_attr }) {
  const raw = group_representation || {};
  const entries = Object.entries(raw).map(([key, val]) => ({
    group: key,
    percentage: Math.round(val * 100),
    raw: val,
  }));

  // Sort for consistent rendering
  entries.sort((a, b) => a.group.localeCompare(b.group));

  const criticalGroups = entries.filter((e) => e.percentage < 20);

  return (
    <div className="result-card">
      <h3 className="result-card__title">
        Group Representation{' '}
        <span className="result-card__term-def">
          (how evenly your data is split between groups)
        </span>
      </h3>

      {/* VISUAL 1 — Stacked proportion bar */}
      <div className="rep-stacked-section">
        <p className="rep-stacked-title">
          How is your data split between groups?
        </p>
        <div className="rep-stacked-bar">
          {entries.map((e, i) => (
            <div
              key={e.group}
              className="rep-stacked-segment"
              style={{
                width: `${e.percentage}%`,
                background: i === 0 ? '#6366f1' : i === 1 ? '#a5b4fc' : `hsl(${i * 60}, 60%, 60%)`,
              }}
              title={`${xLabel(e.group)}: ${e.percentage}%`}
            >
              <span className="rep-stacked-segment__label">
                {xLabel(e.group)}: {e.percentage}%
              </span>
            </div>
          ))}
          {/* Ideal balance marker at 50% */}
          <div className="rep-stacked-ideal-line">
            <span className="rep-stacked-ideal-label">Ideal Balance</span>
          </div>
        </div>
      </div>

      {/* VISUAL 2 — recharts BarChart */}
      <div className="rep-chart-section">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={entries}
            margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="group"
              tickFormatter={xLabel}
              tick={{ fontSize: 12, fill: '#4b5563' }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 12, fill: '#4b5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={50}
              stroke="#ef4444"
              strokeDasharray="6 3"
              label={{
                value: 'Ideal (50%)',
                position: 'insideTopRight',
                fontSize: 11,
                fill: '#ef4444',
              }}
            />
            <ReferenceLine
              y={20}
              stroke="#f97316"
              strokeDasharray="6 3"
              label={{
                value: 'Minimum threshold (20%)',
                position: 'insideBottomRight',
                fontSize: 11,
                fill: '#f97316',
              }}
            />
            <Bar
              dataKey="percentage"
              radius={[6, 6, 0, 0]}
              isAnimationActive
            >
              {entries.map((entry) => (
                <Cell key={entry.group} fill={barColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Explanation */}
      <div className="rep-explanation-box">
        <h4 className="di-section-heading">Why does representation matter?</h4>
        <p className="rep-explanation-text">
          If your dataset contains far more data from one group than another,
          the AI model learns mostly from the larger group and makes worse
          decisions for the smaller group — even if there is no intentional
          discrimination. Think of it like teaching someone to cook only Italian
          food and then asking them to rate all world cuisines fairly.
        </p>
      </div>

      {/* Critical group warnings */}
      {criticalGroups.map((e) => (
        <div className="rep-critical-warning" key={e.group}>
          ⚠️ <strong>{xLabel(e.group)}</strong> has critically low
          representation (<strong>{e.percentage}%</strong>). Bias metrics for
          this group may not be statistically reliable. Collect more data before
          drawing conclusions.
        </div>
      ))}
    </div>
  );
}
