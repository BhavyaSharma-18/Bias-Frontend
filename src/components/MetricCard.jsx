import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

const STATUS_MAP = {
  GREEN:  { cls: 'good',   Icon: CheckCircle2  },
  YELLOW: { cls: 'warn',   Icon: AlertTriangle  },
  RED:    { cls: 'danger', Icon: ShieldAlert    },
  // also accept lowercase aliases from the template's format
  good:    { cls: 'good',   Icon: CheckCircle2  },
  warning: { cls: 'warn',   Icon: AlertTriangle  },
  danger:  { cls: 'danger', Icon: ShieldAlert    },
};

const MetricCard = ({ label, value, verdict }) => {
  const mapped = STATUS_MAP[verdict] || STATUS_MAP['danger'];
  const { cls, Icon } = mapped;

  const displayVal = typeof value === 'number'
    ? (value > 0 ? '+' : '') + value.toFixed(4)
    : String(value ?? '—');

  return (
    <div className={`metric-card metric-card--${cls}`}>
      <div className="metric-card__top">
        <p className="metric-card__title">{label}</p>
        <Icon className="metric-card__icon" />
      </div>

      <p className="metric-card__value">{displayVal}</p>

      <div className="metric-card__blob" aria-hidden="true" />
    </div>
  );
};

export default MetricCard;
