import React, { useState } from 'react';

export default function GatekeeperAIVision({
  bins,
  selectedBinId,
  aiLogs,
  onRunAIInspection,
  lastAIResult
}) {
  const [apiKey, setApiKey] = useState('');
  const [sampleType, setSampleType] = useState('clean_organic');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      await onRunAIInspection(selectedBinId, sampleType, apiKey);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      {/* Left: AI Inspection Deck */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="category-wireframe-badge">AI Vision Core Engine • Gatekeeper</span>
            <div className="card-title">👁️ Gatekeeper AI Vision Inspector</div>
            <div className="card-desc">Deteksi mikro & makro kontaminan anorganik pakan larva BSF</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Sistem Prompt Gatekeeper AI Vision:</label>
          <textarea
            className="form-control"
            rows={3}
            readOnly
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', background: 'var(--bg-subtle)' }}
            value="Identifikasi kontaminasi material non-organik (plastik, logam, kaca) pada permukaan sampah."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pilih Sampel Uji Citra Permukaan:</label>
          <select className="form-select" value={sampleType} onChange={(e) => setSampleType(e.target.value)}>
            <option value="clean_organic">Sampel A: 100% Organik Murni (Sisa Sayur & Nasi)</option>
            <option value="contaminated_plastic">Sampel B: Kontaminasi Plastik Kresek & Sachet</option>
            <option value="contaminated_glass_metal">Sampel C: Kontaminasi Pecahan Kaca & Tutup Botol Logam</option>
            <option value="borderline_tissue">Sampel D: Campuran Organik + Kertas Tisu Basah</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Opsional: Google Gemini API Key (Live Inference Online):</label>
          <input
            type="password"
            className="form-control"
            placeholder="AIzaSy... (Biarkan kosong untuk menjalankan Built-in AI Model)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
            *Jika kosong, sistem otomatis menjalankan model inferensi lokal presisi tinggi.
          </small>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? '⏳ Memproses Inferensi Vision API...' : '⚡ Jalankan Gatekeeper AI Vision Inference'}
        </button>

        {lastAIResult && (
          <div
            style={{
              marginTop: '1.75rem',
              border: `1px solid ${lastAIResult.isContaminated ? 'var(--warning-border)' : 'var(--brand-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              background: lastAIResult.isContaminated ? 'var(--warning-soft-bg)' : 'var(--brand-soft-bg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span className={`badge ${lastAIResult.isContaminated ? 'badge-warning' : 'badge-success'}`}>
                {lastAIResult.isContaminated ? '⚠️ KONTAMINASI TERDETEKSI' : '✅ AMAN (ORGANIK MURNI)'}
              </span>
              <strong
                style={{
                  fontSize: '15px',
                  color: lastAIResult.isContaminated ? 'var(--warning-text)' : 'var(--brand-text)'
                }}
              >
                Maggot Safe Score: {lastAIResult.maggotSafeScore}/100
              </strong>
            </div>

            <div style={{ fontSize: '13px', marginBottom: '0.75rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {lastAIResult.aiVerdict}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              <strong>Kontaminan:</strong>{' '}
              {lastAIResult.detectedContaminants.length > 0
                ? lastAIResult.detectedContaminants.join(', ')
                : 'Nihil (Bebas Plastik/Kaca/Logam)'}
            </div>

            <div
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                background: '#ffffff',
                borderRadius: '8px',
                borderLeft: `3px solid ${lastAIResult.isContaminated ? 'var(--warning-primary)' : 'var(--brand-primary)'}`
              }}
            >
              Hardware Trigger: <strong>{lastAIResult.actionTrigger}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Right: AI Audit Trail */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="category-wireframe-badge">Audit Trail & Event Log</span>
            <div className="card-title">📋 AI Inspection Audit Trail</div>
            <div className="card-desc">Riwayat tangkapan kamera dan putusan sistem Gatekeeper</div>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>ID Tong</th>
                <th>Status</th>
                <th>Skor</th>
                <th>Kontaminan Terdeteksi</th>
              </tr>
            </thead>
            <tbody>
              {aiLogs.map((log) => (
                <tr key={log.id}>
                  <td><small>{log.timestamp}</small></td>
                  <td><strong>{log.binId}</strong></td>
                  <td>
                    <span className={`badge ${log.isContaminated ? 'badge-warning' : 'badge-success'}`}>
                      {log.isContaminated ? 'KONTAMINASI' : 'AMAN'}
                    </span>
                  </td>
                  <td><strong>{log.maggotSafeScore}</strong>/100</td>
                  <td>{log.contaminants && log.contaminants.length > 0 ? log.contaminants.join(', ') : 'Nihil'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
