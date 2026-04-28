import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ProxyWarning = ({ proxyVariables }) => {
  if (!proxyVariables || Object.keys(proxyVariables).length === 0) return null;

  const entries = Object.entries(proxyVariables);

  return (
    <div className="proxy-warning animate-pulse-slow">
      <div className="proxy-warning__inner">
        <div className="proxy-warning__icon-ring">
          <AlertTriangle />
        </div>

        <div style={{ flex: 1 }}>
          <h4 className="proxy-warning__title">Proxy Variables Detected</h4>
          <p className="proxy-warning__desc">
            The following features strongly correlate with your protected attribute.
            Including them may introduce hidden bias into your model even if the
            protected column itself is excluded.
          </p>

          <div className="proxy-grid">
            {entries.map(([col, corr]) => (
              <div key={col} className="proxy-item">
                <span className="proxy-item__name">{col}</span>
                <span className="proxy-item__corr">
                  r = {(Math.abs(corr)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <p className="proxy-advice">
            💡 <strong>Recommendation:</strong> Remove or reweigh these columns before
            retraining to reduce the risk of indirect discrimination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProxyWarning;
