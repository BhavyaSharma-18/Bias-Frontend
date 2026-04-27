import React from 'react';

const ProxyWarning = ({ proxyVariables }) => {
  if (!proxyVariables || Object.keys(proxyVariables).length === 0) return null;

  return (
    <div className="proxy-warning">
      <div className="proxy-header">
        <span className="proxy-icon">⚠️</span>
        <div>
          <h4 className="proxy-title">Proxy Variables Detected</h4>
          <p className="proxy-subtitle">
            The following columns are highly correlated with your protected attribute and may
            act as stand-ins for it, introducing indirect bias even when the protected column
            is excluded from the model.
          </p>
        </div>
      </div>

      <ul className="proxy-list">
        {Object.entries(proxyVariables).map(([col, corr]) => (
          <li key={col} className="proxy-item">
            <div className="proxy-item-left">
              <span className="proxy-col-name">{col}</span>
              <span className="proxy-col-desc">Correlated proxy column</span>
            </div>
            <div className="proxy-item-right">
              <span className="proxy-corr-label">Correlation</span>
              <span className="proxy-corr-val">{(Math.abs(corr) * 100).toFixed(1)}%</span>
            </div>
          </li>
        ))}
      </ul>

      <p className="proxy-advice">
        💡 <strong>Recommendation:</strong> Consider removing or transforming these columns
        before training your model to reduce the risk of indirect discrimination.
      </p>
    </div>
  );
};

export default ProxyWarning;
