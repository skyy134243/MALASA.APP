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
          <div className="card-title">📈 Predictive Analytics & Time-Series Engine (LSTM / Regression)</div>
          <div className="card-desc">Prediksi laju pengisian tong dan estimasi jam menuju ambang batas kritis (70% / 5kg)</div>
        </div>
      </div>

      <div className="grid-4">
        {forecasts.map(({ bin, forecast }) => (
          <div key={bin.id} className="stat-box">
            <div className="stat-label">{bin.name}</div>
            <div className="stat-value" style={{ fontSize: '18px', color: `var(--color-${forecast.urgencyColor})` }}>
              {forecast.hoursRemaining === 0 ? 'CRITICAL (0j)' : `${forecast.hoursRemaining} Jam`}
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar-fill ${forecast.urgencyColor}`}
                style={{ width: `${bin.currentFillPercent}%` }}
              ></div>
            </div>
            <div className="stat-sub">{bin.currentFillPercent}% Kapasitas | {bin.currentWeightKg} kg</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div className="card-title" style={{ marginBottom: '0.75rem' }}>
          📊 Matriks Prediksi Waktu Penuh Antar Titik Komunal
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID & Lokasi Tong</th>
                <th>Kapasitas Saat Ini</th>
                <th>Bobot Saat Ini</th>
                <th>Laju Pengisian</th>
                <th>Estimasi Waktu Penuh</th>
                <th>Tingkat Urgensi</th>
                <th>Rekomendasi Dispatch</th>
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
