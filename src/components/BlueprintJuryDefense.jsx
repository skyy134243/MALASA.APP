import React from 'react';

export default function BlueprintJuryDefense() {
  return (
    <div className="grid-2">
      {/* Left: Strategic Defense Arguments */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">🎯 Strategi Pertahanan Sidang Juri Enov KSKM</div>
            <div className="card-desc">Argumen berbasis logika sistem terdistribusi & efisiensi biaya</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '4px solid var(--color-brand)'
            }}
          >
            <strong>Pertanyaan Juri 1:</strong>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: '4px 0' }}>
              "Mengapa harus menggunakan AI Cloud Vision yang mahal dan boros internet untuk sampah? Bukankah sensor berat saja cukup?"
            </p>
            <strong>Jawaban Strategis Anda:</strong>
            <p style={{ marginTop: '4px' }}>
              "Pak Juri, sensor berat hanya memberi tahu <em>kuantitas</em> ('berapa banyak'), tetapi buta terhadap <em>kualitas</em> ('apa isinya'). Kontaminasi plastik sekecil 5% saja dapat mematikan dan membuat amblas media kultur maggot hitam (BSF). Dengan pendekatan Gatekeeper AI yang hanya aktif saat tutup dibuka (event-driven), ESP32-CAM berada dalam Deep Sleep 99% waktu, baterai awet berbulan-bulan, namun pakan maggot terjamin 90%+ bersih tanpa komputasi lokal yang boros hardware."
            </p>
          </div>

          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '4px solid var(--color-info)'
            }}
          >
            <strong>Pertanyaan Juri 2:</strong>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: '4px 0' }}>
              "Bagaimana meyakinkan warga perumahan/desa agar mau merawat dan disiplin membuang ke alat ini?"
            </p>
            <strong>Jawaban Strategis Anda:</strong>
            <p style={{ marginTop: '4px' }}>
              "Prinsip Malasa.App adalah <strong>Zero Friction Habit</strong>. Warga tidak perlu belajar hal rumit: buka tutup tong, dispenser mekanis otomatis menabur bekatul penekan bau, sistem french press memisahkan lindi agar dapur tidak becek, dan warga mendapatkan insentif kas RT serta Pupuk Organik Cair (POC) gratis dari keran bawah untuk pekarangan mereka."
            </p>
          </div>
        </div>
      </div>

      {/* Right: Bill of Materials (BOM) Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📋 Matriks Komponen Teknis & Estimasi Anggaran (BOM)</div>
            <div className="card-desc">Rasio biaya kompetitif untuk pengadaan skala massal (B2G DLH)</div>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Komponen</th>
                <th>Spesifikasi & Model</th>
                <th>Fungsi Utama</th>
                <th>Estimasi (IDR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Bodi Utama</strong></td>
                <td>Drum Plastik HDPE 120L + Roda</td>
                <td>Wadah komunal tahan korosi asam lindi</td>
                <td>Rp200.000 - Rp250.000</td>
              </tr>
              <tr>
                <td><strong>Saringan Internal</strong></td>
                <td>Plat Stainless Perforated Mesh 1.5mm</td>
                <td>Pemisah sampah padat dan cairan lindi</td>
                <td>Rp45.000 - Rp60.000</td>
              </tr>
              <tr>
                <td><strong>Kontrol Bau</strong></td>
                <td>Seal EPDM + Karbon Aktif</td>
                <td>Kunci udara & penetral amonia pasif</td>
                <td>Rp20.000</td>
              </tr>
              <tr>
                <td><strong>Mikrokontroler</strong></td>
                <td>ESP32-CAM (OV2640)</td>
                <td>Otak pemrosesan, Wi-Fi, tangkapan AI</td>
                <td>Rp75.000 - Rp95.000</td>
              </tr>
              <tr>
                <td><strong>Sensor-Sensor</strong></td>
                <td>HC-SR04, Load Cell + HX711, Limit Switch</td>
                <td>Ukur tinggi, berat, & deteksi bukaan</td>
                <td>Rp35.000 - Rp50.000</td>
              </tr>
              <tr>
                <td><strong>Power Supply</strong></td>
                <td>Li-ion 18650 (2-slot) + Solar Panel Mini</td>
                <td>Daya mandiri tanpa listrik PLN rumah</td>
                <td>Rp45.000 - Rp60.000</td>
              </tr>
              <tr>
                <td><strong>Dispenser Mekanis</strong></td>
                <td>Piringan Akrilik + Kawat Sling + Per</td>
                <td>Tabur bekatul/EM4 pasif saat buka tutup</td>
                <td>Rp25.000 - Rp35.000</td>
              </tr>
              <tr style={{ background: '#f1f5f9', fontWeight: 'bold' }}>
                <td colSpan={3}>TOTAL ESTIMASI PER UNIT (Siap Produksi Massal B2G DLH)</td>
                <td style={{ color: 'var(--color-brand)' }}>~Rp450.000 - Rp550.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
