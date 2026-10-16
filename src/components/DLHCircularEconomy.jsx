import React from 'react';

export default function DLHCircularEconomy({ bins, transactions, wallets }) {
  // Aggregate DLH metrics
  const totalTrxWaste = transactions.reduce((acc, t) => acc + t.weightKg, 0);
  const activeBinsWaste = bins.reduce((acc, b) => acc + b.currentWeightKg, 0);
  const grandTotalWasteKg = parseFloat((totalTrxWaste + activeBinsWaste).toFixed(2));

  const totalTrxLeachate = transactions.reduce((acc, t) => acc + t.leachateLiters, 0);
  const activeLeachate = bins.reduce((acc, b) => acc + b.leachateVolumeLiters, 0);
  const grandTotalPOCLiters = parseFloat((totalTrxLeachate + activeLeachate).toFixed(1));

  const methaneAvoidedKg = parseFloat((grandTotalWasteKg * 0.42).toFixed(2));
  const cleanBinsCount = bins.filter(b => !b.isContaminated).length;
  const complianceRate = parseFloat(((cleanBinsCount / (bins.length || 1)) * 100).toFixed(1));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">🏛️ Hub Eksekutif Dinas Lingkungan Hidup (DLH Jember)</div>
          <div className="card-desc">Monitoring makro diversifikasi sampah dari TPA Pakusari, reduksi metana, & perputaran ekonomi</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-box">
          <div className="stat-label">Total Sampah Tereduksi</div>
          <div className="stat-value">{grandTotalWasteKg} kg</div>
          <div className="stat-sub">Teralihkan dari TPA</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Reduksi Gas Metana (CH4)</div>
          <div className="stat-value">{methaneAvoidedKg} kg</div>
          <div className="stat-sub">Mitigasi efek gas rumah kaca</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Panen Pupuk Lindi (POC)</div>
          <div className="stat-value">{grandTotalPOCLiters} L</div>
          <div className="stat-sub">Diserap sektor pertanian</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Kepatuhan Pemilahan Warga</div>
          <div className="stat-value">{complianceRate}%</div>
          <div className="stat-sub">Tong bebas plastik</div>
        </div>
      </div>

      <div className="grid-2">
        {/* RT Community Wallets */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>
            💰 Saldo Insentif & Kas Rukun Tetangga (RT)
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rukun Tetangga (RT)</th>
                  <th>Saldo Kas Dompet</th>
                  <th>Total Organik</th>
                  <th>Panen POC</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(wallets).map((binId) => {
                  const w = wallets[binId];
                  const bin = bins.find((b) => b.id === binId);
                  return (
                    <tr key={binId}>
                      <td><strong>{bin ? bin.name : binId}</strong></td>
                      <td style={{ color: 'var(--color-brand)', fontWeight: 700 }}>
                        Rp {w.balanceIdr.toLocaleString()}
                      </td>
                      <td>{w.totalOrganicKg.toFixed(1)} kg</td>
                      <td>{w.pocHarvestedLiters.toFixed(1)} L POC</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>
            📜 Riwayat Transaksi Pasar Digital & Platform Fee
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Trx</th>
                  <th>RT Warga</th>
                  <th>Berat</th>
                  <th>Platform Fee</th>
                  <th>Pencairan Bersih</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((t) => (
                  <tr key={t.id}>
                    <td><small>{t.id}</small></td>
                    <td><strong>{t.rtName}</strong></td>
                    <td>{t.weightKg} kg</td>
                    <td style={{ color: 'var(--color-warning)' }}>
                      Rp {t.feeAmount.toLocaleString()} ({(t.feeRate * 100).toFixed(0)}%)
                    </td>
                    <td style={{ color: 'var(--color-brand)', fontWeight: 700 }}>
                      Rp {t.netCitizenReward.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
