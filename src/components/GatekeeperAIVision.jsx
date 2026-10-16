import React, { useState } from 'react';
import { SYSTEM_PROMPT } from '../services/gatekeeper';

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
            <div className="card-title">👁️ Gatekeeper AI Vision Inspector</div>
            <div className="card-desc">Model analitik deteksi kontaminasi pakan larva Black Soldier Fly (BSF)</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Sistem Prompt Gatekeeper AI Vision:</label>
          <textarea
            className="form-control"
            rows={3}
            readOnly
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            value="Identifikasi kontaminasi material non-organik (plastik, logam, kaca) pada permukaan sampah."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pilih Sampel Uji Citra:</label>
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
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleRun} disabled={loading}>
          {loading ? '⏳ Memproses Inferensi Vision API...' : '⚡ Jalankan Gatekeeper AI Vision Inference'}
        </button>

        {lastAIResult && (
          <div
            style={{
              marginTop: '1.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              background: 'var(--bg-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className={`badge ${lastAIResult.isContaminated ? 'badge-warning' : 'badge-success'}`}>
                {lastAIResult.isContaminated ? 'TERKONTAMINASI!' : 'AMAN (ORGANIK MURNI)'}
              </span>
              <strong
                style={{
                  fontSize: '16px',
                  color: lastAIResult.isContaminated ? 'var(--color-warning)' : 'var(--color-brand)'
                }}
              >
                Maggot Safe Score: {lastAIResult.maggotSafeScore}/100
              </strong>
            </div>
            <div style={{ fontSize: '13px', marginBottom: '0.5rem' }}>{lastAIResult.aiVerdict}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              <strong>Kontaminan:</strong>{' '}
              {lastAIResult.detectedContaminants.length > 0
                ? lastAIResult.detectedContaminants.join(', ')
                : 'Nihil (Bebas Plastik/Kaca/Logam)'}
            </div>
            <div
              style={{
                marginTop: '0.75rem',
                fontSize: '11px',
                padding: '6px',
                background: '#ffffff',
                borderRadius: '4px',
                borderLeft: `3px solid ${lastAIResult.isContaminated ? 'var(--color-warning)' : 'var(--color-brand)'}`
              }}
            >
              Sinyal Balik: <strong>{lastAIResult.actionTrigger}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Right: AI Audit Trail */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📋 AI Inspection Audit Trail & History</div>
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
                <th>Skor Pakan</th>
                <th>Kontaminan</th>
              </tr>
            </thead>
            <tbody>
              {aiLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.timestamp}</td>
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
