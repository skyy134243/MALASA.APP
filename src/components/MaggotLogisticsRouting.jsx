import React, { useState } from 'react';
import { generateOptimizedRoute } from '../services/routing';

export default function MaggotLogisticsRouting({ bins, onConfirmPickup }) {
  const [route, setRoute] = useState(() => generateOptimizedRoute(bins));
  const [selectedBinId, setSelectedBinId] = useState(bins[0]?.id || '');
  const [measuredWeight, setMeasuredWeight] = useState(bins[0]?.currentWeightKg || 5.0);
  const [pricePerKg, setPricePerKg] = useState(500);
  const [feeRate, setFeeRate] = useState(0.08);
  const [cultivator, setCultivator] = useState('Koperasi Maggot Lestari Jember');

  const handleRecalculate = () => {
    setRoute(generateOptimizedRoute(bins));
  };

  const handleSelectBin = (id) => {
    setSelectedBinId(id);
    const b = bins.find(item => item.id === id);
    if (b) setMeasuredWeight(b.currentWeightKg);
  };

  const gross = Math.round(measuredWeight * pricePerKg);
  const fee = Math.round(gross * feeRate);
  const net = gross - fee;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmPickup({
      binId: selectedBinId,
      weightKg: measuredWeight,
      pricePerKg,
      feeRate,
      feeAmount: fee,
      netReward: net,
      grossAmount: gross,
      cultivatorName: cultivator
    });
    alert(`✅ Penimbangan Sukses!\nPencairan Bersih Kas RT: Rp ${net.toLocaleString()}\nPlatform Fee (8%): Rp ${fee.toLocaleString()}`);
  };

  return (
    <div className="grid-2">
      {/* Left: Dispatch Order */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="category-wireframe-badge">Smart Routing • GIS VRP Logistics</span>
            <div className="card-title">🚚 Dispatch Order & Prioritas Armada Pembudidaya</div>
            <div className="card-desc">Optimasi rute penjemputan berbasis keterisian & jarak terpendek</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleRecalculate}>
            🔄 Optimalkan Rute
          </button>
        </div>

        <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-box">
            <div className="stat-label">Total Jarak Tempuh</div>
            <div className="stat-value">{route.totalEstimatedKm} km</div>
            <div className="stat-sub">Efisiensi bahan bakar ~32.5%</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Proyeksi Biomassa</div>
            <div className="stat-value">{route.totalBiomassKg} kg</div>
            <div className="stat-sub">Pakan segar maggot siap kultur</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Est. Panen POC</div>
            <div className="stat-value">{route.totalLeachateLiters} L</div>
            <div className="stat-sub">Pupuk organik cair terpasang</div>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Urutan</th>
                <th>Titik Komunal</th>
                <th>Jarak</th>
                <th>Kapasitas</th>
                <th>Instruksi Petugas</th>
              </tr>
            </thead>
            <tbody>
              {route.stops.map((stop) => (
                <tr key={stop.binId}>
                  <td><strong>Stop #{stop.stepOrder}</strong></td>
                  <td>
                    <strong>{stop.name}</strong><br />
                    <small style={{ color: 'var(--text-muted)' }}>{stop.location}</small>
                  </td>
                  <td>{stop.legDistanceKm} km</td>
                  <td>
                    <span className={`badge ${stop.fillPercent >= 70 ? 'badge-danger' : 'badge-info'}`}>
                      {stop.fillPercent}% ({stop.weightKg} kg)
                    </span>
                  </td>
                  <td>
                    <span style={{ color: stop.isContaminated ? 'var(--warning-primary)' : 'var(--brand-primary)', fontWeight: 600 }}>
                      {stop.actionRequired}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Digital Weighing Settlement Form */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="category-wireframe-badge">Circular Fintech • Digital Weigh-In</span>
            <div className="card-title">⚖️ Konfirmasi Penimbangan & Transaksi</div>
            <div className="card-desc">Settlement penjemputan, fee platform 8%, & transfer saldo RT</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tong yang Sedang Dijemput:</label>
            <select
              className="form-select"
              value={selectedBinId}
              onChange={(e) => handleSelectBin(e.target.value)}
            >
              {bins.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.name} ({b.currentWeightKg} kg)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Armada / Pembudidaya Maggot:</label>
            <input
              type="text"
              className="form-control"
              value={cultivator}
              onChange={(e) => setCultivator(e.target.value)}
            />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Hasil Timbangan Digital (kg):</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={measuredWeight}
                onChange={(e) => setMeasuredWeight(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Harga Beli Organik (Rp/kg):</label>
              <input
                type="number"
                className="form-control"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Potongan Platform Fee Malasa.App (%):</label>
            <select
              className="form-select"
              value={feeRate}
              onChange={(e) => setFeeRate(parseFloat(e.target.value))}
            >
              <option value={0.05}>5% (Tarif Promosi Desa)</option>
              <option value={0.08}>8% (Tarif Standar Ekosistem)</option>
              <option value={0.10}>10% (Tarif Komersial Perkotaan)</option>
            </select>
          </div>

          <div className="settlement-preview-box">
            <div className="settlement-preview-row">
              <span style={{ color: 'var(--text-muted)' }}>Total Nilai Kotor (Gross):</span>
              <strong>Rp {gross.toLocaleString()}</strong>
            </div>
            <div className="settlement-preview-row" style={{ color: 'var(--warning-text)' }}>
              <span>Biaya Layanan Platform ({(feeRate * 100).toFixed(0)}%):</span>
              <strong>Rp {fee.toLocaleString()}</strong>
            </div>
            <div
              className="settlement-preview-row"
              style={{
                fontSize: '14px',
                color: 'var(--brand-text)',
                borderTop: '1px dashed var(--border-subtle)',
                paddingTop: '8px',
                marginTop: '6px'
              }}
            >
              <span>Kredit Bersih ke Kas Warga RT:</span>
              <strong>Rp {net.toLocaleString()}</strong>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            ✅ Konfirmasi Timbang & Transfer Saldo ke Dompet RT
          </button>
        </form>
      </div>
    </div>
  );
}
