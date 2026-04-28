import React from 'react';

function corrColor(corr) {
  if (corr > 0.8) return '#ef4444';
  if (corr > 0.6) return '#f97316';
  return '#eab308';
}

function severityLabel(corr) {
  if (corr > 0.8) return 'Critical Risk';
  if (corr > 0.6) return 'High Risk';
  return 'Moderate Risk';
}

function severityPillStyle(corr) {
  if (corr > 0.8)
    return { background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5' };
  if (corr > 0.6)
    return { background: '#fff7ed', color: '#f97316', border: '1px solid #fdba74' };
  return { background: '#fefce8', color: '#ca8a04', border: '1px solid #fde047' };
}

export default function ProxyExplainer({ proxy_variables, protected_attr }) {
  if (!proxy_variables || Object.keys(proxy_variables).length === 0) return null;

  const entries = Object.entries(proxy_variables);

  return (
    <div className="result-card">
      {/* Header */}
      <div className="proxy-ex-header">
        <span className="proxy-ex-icon">🔍</span>
        <div>
          <h3 className="result-card__title" style={{ marginBottom: 4 }}>
            Hidden Bias Sources Found
          </h3>
          <p className="proxy-ex-subtitle">
            These columns in your dataset secretly carry information about{' '}
            <strong>"{protected_attr || '—'}"</strong>, even though they don't
            say so directly. A model trained on these columns could discriminate
            without anyone realizing it.
          </p>
        </div>
      </div>

      {/* Per-variable sub-cards */}
      <div className="proxy-ex-list">
        {entries.map(([col, corr]) => {
          const corrNum = typeof corr === 'number' ? corr : 0;
          const fillColor = corrColor(corrNum);
          const linkedPct = Math.round(corrNum * 100);

          return (
            <div className="proxy-ex-item" key={col}>
              <div className="proxy-ex-item__top">
                <strong className="proxy-ex-item__col">{col}</strong>
                <span className="proxy-ex-severity-pill" style={severityPillStyle(corrNum)}>
                  {severityLabel(corrNum)}
                </span>
              </div>

              {/* Correlation bar */}
              <div className="proxy-ex-bar-track">
                <div
                  className="proxy-ex-bar-fill"
                  style={{ width: `${linkedPct}%`, background: fillColor }}
                />
                <span className="proxy-ex-bar-label" style={{ color: fillColor }}>
                  {linkedPct}% linked
                </span>
              </div>

              {/* Plain-English explanation */}
              <p className="proxy-ex-explanation">
                The column <strong>"{col}"</strong> is{' '}
                <strong style={{ color: fillColor }}>{linkedPct}% correlated</strong>{' '}
                with <strong>"{protected_attr || '—'}"</strong>. This means when the
                AI looks at <strong>{col}</strong>, it is indirectly learning about{' '}
                <strong>{protected_attr || '—'}</strong>. Even if you remove{' '}
                <strong>{protected_attr || '—'}</strong> from your data, the model can
                still discriminate using <strong>{col}</strong> as a substitute.
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer advice */}
      <div className="proxy-ex-footer">
        <h4 className="proxy-ex-footer__heading">What should I do?</h4>
        <p className="proxy-ex-footer__text">
          Consider removing these columns from your dataset before training any
          model. If these columns are genuinely needed for predictions, consult a
          data ethics specialist to determine whether their use can be legally
          justified.
        </p>
      </div>
    </div>
  );
}
