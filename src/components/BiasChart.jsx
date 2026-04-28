import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill, fontWeight: 600, fontSize: '.88rem' }}>
          {p.name}: {p.value.toFixed(1)}%
        </p>
      ))}
    </div>
  );
};

const BiasChart = ({ groupRepresentation }) => {
  if (!groupRepresentation) return null;

  const data = Object.entries(groupRepresentation).map(([group, pct]) => ({
    group: `Group ${group}`,
    'Representation (%)': parseFloat((pct * 100).toFixed(2)),
  }));

  return (
    <div className="card chart-card">
      <div className="chart-card__header">
        <BarChart3 />
        <h3 className="chart-card__title">Outcome Disparities by Group</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="group"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 13 }}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip
            content={<CUSTOM_TOOLTIP />}
            cursor={{ fill: 'rgba(30,41,59,.6)' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20, fontSize: '0.82rem', color: '#94a3b8' }}
          />
          <ReferenceLine
            y={50}
            stroke="#f43f5e"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ value: 'Equal (50%)', position: 'insideTopRight', fill: '#f43f5e', fontSize: 12 }}
          />
          <Bar
            dataKey="Representation (%)"
            radius={[6, 6, 0, 0]}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={i % 2 === 0 ? '#6366f1' : '#10b981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiasChart;
