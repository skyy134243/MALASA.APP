import React from 'react';

export default function BlueprintJuryDefense() {
  return (
    <div className="grid-2">
      {/* Left: Strategic Defense Arguments */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="category-wireframe-badge">Executive Defense • Enov KSKM UNEJ</span>
            <div className="card-title">🎯 Strategi Pertahanan Sidang Juri</div>
            <div className="card-desc">Argumen berbasis logika sistem terdistribusi, daya baterai, & efisiensi biaya</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--brand-primary)'
            }}
          >
            <strong style={{ color: 'var(--text-main)', fontSize: '13.5px' }}>Pertanyaan Dewan Juri 1:</strong>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: '6px 0 10px 0', fontSize: '13px' }}>
              "Mengapa harus menggunakan AI Cloud Vision yang mahal dan boros kuota internet untuk sampah? Bukankah sensor berat atau ultrasonik saja sudah cukup?"
            </p>
            <strong style={{ color: 'var(--brand-text)', fontSize: '13px' }}>Jawaban Strategis Anda:</strong>
            <p style={{ marginTop: '6px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              "Pak Juri, sensor berat hanya mampu memberi tahu <em>kuantitas</em> ('berapa banyak'), tetapi buta terhadap <em>kualitas</em> ('apa isinya'). Kontaminasi plastik sekecil 5% saja dapat mematikan dan membuat amblas koloni kultur larva maggot hitam (BSF). Dengan pendekatan Gatekeeper AI yang hanya aktif saat tutup dibuka (event-driven), ESP32-CAM berada dalam Deep Sleep 99% waktu sehingga baterai awet berbulan-bulan, namun pakan maggot terjamin 90%+ bersih tanpa komputasi lokal mahal."
            </p>
          </div>

          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--info-primary)'
            }}
          >
            <strong style={{ color: 'var(--text-main)', fontSize: '13.5px' }}>Pertanyaan Dewan Juri 2:</strong>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: '6px 0 10px 0', fontSize: '13px' }}>
              "Bagaimana cara meyakinkan warga perumahan/desa agar mau merawat dan disiplin membuang ke alat ini?"
            </p>
            <strong style={{ color: 'var(--info-text)', fontSize: '13px' }}>Jawaban Strategis Anda:</strong>
            <p style={{ marginTop: '6px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              "Prinsip Malasa.App adalah <strong>Zero Friction Habit</strong>. Warga tidak perlu belajar hal rumit: buka tutup tong, dispenser mekanis otomatis menabur bekatul penekan bau, sistem french press memisahkan lindi agar dapur tidak becek, dan warga mendapatkan insentif kas RT serta Pupuk Organik Cair (POC) gratis dari keran bawah untuk tanaman pekarangan mereka."
            </p>
          </div>
        </div>
      </div>

      {/* Right: Bill of Materials (BOM) Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="category-wireframe-badge">Hardware Procurement • B2G DLH</span>
            <div className="card-title">📋 Matriks Komponen Teknis & Anggaran (BOM)</div>
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
                <td>Wadah komunal luar ruangan tahan cuaca & asam lindi</td>
                <td>Rp200.000 - Rp250.000</td>
              </tr>
              <tr>
                <td><strong>Saringan Internal</strong></td>
                <td>Plat Stainless Perforated Mesh 1.5mm</td>
                <td>Pemisah sampah padat dan cairan lindi secara pasif</td>
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
                <td>Ukur tinggi, berat, & deteksi bukaan tutup</td>
                <td>Rp35.000 - Rp50.000</td>
              </tr>
              <tr>
                <td><strong>Power Supply</strong></td>
                <td>Li-ion 18650 (2-slot) + Solar Panel Mini</td>
                <td>Daya mandiri tanpa listrik PLN rumah tangga</td>
                <td>Rp45.000 - Rp60.000</td>
              </tr>
              <tr>
                <td><strong>Dispenser Mekanis</strong></td>
                <td>Piringan Akrilik + Kawat Sling + Per</td>
                <td>Tabur bekatul/EM4 pasif saat buka tutup</td>
                <td>Rp25.000 - Rp35.000</td>
              </tr>
              <tr style={{ background: 'var(--brand-soft-bg)', fontWeight: 'bold' }}>
                <td colSpan={3} style={{ color: 'var(--brand-text)' }}>
                  TOTAL ESTIMASI PER UNIT (Siap Produksi Massal B2G DLH)
                </td>
                <td style={{ color: 'var(--brand-primary)', fontSize: '14px' }}>
                  ~Rp450.000 - Rp550.000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
