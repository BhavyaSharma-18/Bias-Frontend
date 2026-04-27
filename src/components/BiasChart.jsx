import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';

const INDIGO = '#6366f1';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">Group: <strong>{label}</strong></p>
        <p className="chart-tooltip-value">{payload[0].value.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const BiasChart = ({ groupRepresentation }) => {
  if (!groupRepresentation) return null;

  const data = Object.entries(groupRepresentation).map(([group, pct]) => ({
    group,
    percentage: parseFloat((pct * 100).toFixed(2)),
  }));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Group Representation</h3>
        <div className="chart-legend">
          <span className="legend-dot" style={{ background: INDIGO }} />
          <span>Representation %</span>
          <span className="legend-dot" style={{ background: '#ef4444', borderRadius: 0, height: 2 }} />
          <span>Equal (50%)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="group"
            tick={{ fill: '#6b7280', fontSize: 13 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            unit="%"
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
          <ReferenceLine
            y={50}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ value: '50%', position: 'insideTopRight', fill: '#ef4444', fontSize: 12 }}
          />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={INDIGO} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiasChart;
