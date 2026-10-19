import React from 'react';
import { calculateForecast } from '../services/predictive';

export default function PredictiveAnalytics({ bins }) {
  const forecasts = bins.map((bin) => ({
    bin,
    forecast: calculateForecast(bin)
  }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <span className="category-wireframe-badge">Machine Learning Pipeline • Time-Series Forecast</span>
          <div className="card-title">📈 Predictive Analytics Engine (LSTM / Fill Forecasting)</div>
          <div className="card-desc">Estimasi jam menuju ambang batas kritis (70% kapasitas / 5 kg berat)</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {forecasts.map(({ bin, forecast }) => (
          <div key={bin.id} className="stat-box">
            <div>
              <div className="stat-label">{bin.name}</div>
              <div className="stat-value" style={{ fontSize: '20px', color: `var(--${forecast.urgencyColor}-primary)` }}>
                {forecast.hoursRemaining === 0 ? 'CRITICAL (0 Jam)' : `${forecast.hoursRemaining} Jam Lagi`}
              </div>
            </div>
            <div>
              <div className="progress-bar-container">
                <div
                  className={`progress-bar-fill ${forecast.urgencyColor}`}
                  style={{ width: `${bin.currentFillPercent}%` }}
                ></div>
              </div>
              <div className="stat-sub">{bin.currentFillPercent}% Kapasitas • {bin.currentWeightKg} kg</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="card-title" style={{ marginBottom: '1rem', fontSize: '15px' }}>
          📊 Matriks Waktu Penuh Antar Titik Komunal
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID & Lokasi Tong</th>
                <th>Kapasitas</th>
                <th>Bobot</th>
                <th>Laju Pengisian</th>
                <th>Estimasi Penuh</th>
                <th>Urgensi</th>
                <th>Rekomendasi Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map(({ bin, forecast }) => (
                <tr key={bin.id}>
                  <td>
                    <strong>{bin.id}</strong><br />
                    <small style={{ color: 'var(--text-muted)' }}>{bin.location}</small>
                  </td>
                  <td><strong>{bin.currentFillPercent}%</strong></td>
                  <td>{bin.currentWeightKg} kg</td>
                  <td>+{bin.fillRatePerHour}% / jam</td>
                  <td>
                    <span className={`badge badge-${forecast.urgencyColor}`}>
                      {forecast.formattedEstimate}
                    </span>
                  </td>
                  <td><strong>{forecast.alertLevel}</strong></td>
                  <td><small>{forecast.recommendation}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
