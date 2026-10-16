import React, { useState } from 'react';

export default function PhysicalEdgeSimulator({
  bins,
  selectedBinId,
  setSelectedBinId,
  onUpdateBin,
  onRunAIInspection,
  ledSignal
}) {
  const currentBin = bins.find(b => b.id === selectedBinId) || bins[0];
  const [lidOpen, setLidOpen] = useState(false);
  const [samplePhoto, setSamplePhoto] = useState('clean_organic');
  const [terminalLogs, setTerminalLogs] = useState([
    { text: '[BOOT] ESP32-CAM Initialized. Free PSRAM: 4MB', type: 'normal' },
    { text: '[RTC] Ext0 Wakeup source: Limit Switch on GPIO 33', type: 'normal' },
    { text: '[NETWORK] Connected to Wi-Fi Gateway. Signal: -62 dBm', type: 'succ' },
    { text: '[READY] Settle delay calibrated to 0.8s. Awaiting citizen trigger...', type: 'normal' }
  ]);

  const addLog = (text, type = 'normal') => {
    setTerminalLogs(prev => [...prev.slice(-20), { text: `[${new Date().toLocaleTimeString()}] ${text}`, type }]);
  };

  const handleOpenLid = () => {
    setLidOpen(true);
    const updatedCount = currentBin.hopperTriggerCount + 1;
    onUpdateBin(currentBin.id, { hopperTriggerCount: updatedCount });

    addLog('[LID SENSOR] Warga membuka tutup tong komunal.');
    addLog('[DISPENSER] Tuas sling bergerak: Taburkan 1 takar bekatul+EM4 (±15g) penekan bau.');
    addLog('[RTC GPIO 33] Limit switch HIGH -> Membangunkan ESP32-CAM dari Deep Sleep.');

    setTimeout(() => {
      setLidOpen(false);
      addLog('[LID SENSOR] Tutup ditutup rapat kembali. Settle delay 0.8s aktif.');
      addLog('[DEEP SLEEP] ESP32 kembali ke mode hemat daya mikroampere.');
    }, 2500);
  };

  const handlePressFrenchPress = () => {
    const updatedLeachate = parseFloat((currentBin.leachateVolumeLiters + 0.8).toFixed(1));
    onUpdateBin(currentBin.id, { leachateVolumeLiters: updatedLeachate });

    addLog('[FRENCH PRESS] Piringan ditekan: Air lindi terperas menembus mesh stainless 1.5mm.');
    addLog(`[POC RESERVOIR] Volume cairan lindi bertambah menjadi ${updatedLeachate} Liter.`);
  };

  const handleTransmitEdge = async () => {
    addLog('[OV2640] Mengambil foto resolusi 640x480... Selesai.');
    addLog('[HTTPS POST] Mengirim payload ke api.malasa.app/v1/telemetry/edge-ingest...');

    const res = await onRunAIInspection(currentBin.id, samplePhoto);
    addLog(`[CLOUD RESPONSE 200] AI Verdict: ${res.aiVerdict}`, res.isContaminated ? 'warn' : 'succ');
  };

  return (
    <div className="grid-2">
      {/* Left: Cutaway Physical Bin */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📦 Smart Communal Bin 120L (Mekanis & Edge HW)</div>
            <div className="card-desc">Simulasi aksi fisik warga, dispenser bekatul pasif, & ESP32-CAM</div>
          </div>
          <span className={`badge ${lidOpen ? 'badge-warning' : 'badge-success'}`}>
            {lidOpen ? 'ESP32: WAKING UP (Active)' : 'Deep Sleep: Standby'}
          </span>
        </div>

        <div className="bin-visual-box">
          <div className="bin-cutaway-diagram">
            <div className="bin-part part-lid">
              <strong>TUTUP DRUM HDPE 120L + SEAL EPDM</strong><br />
              <small>{lidOpen ? '⚠️ Status: Terbuka! Bekatul & EM4 tertabur otomatis' : '🔒 Status: Tertutup Rapat (Odor Locked)'}</small>
            </div>
            <div className="bin-part part-hopper">
              🌾 Dispenser Mekanis: Sekam/Bekatul + EM4 Kering (±15g per bukaan)<br />
              <small>Total Taburan: {currentBin.hopperTriggerCount} takar</small>
            </div>
            <div className="bin-part part-press">
              ⚙️ French Press Piston Plate (Penekan Serat Sampah Organik)
            </div>
            <div className="bin-part part-solid">
              <div>
                <strong>Kompartemen Sampah Padat</strong><br />
                <span>Kapasitas: {currentBin.currentFillPercent}% | Berat: {currentBin.currentWeightKg} kg</span>
              </div>
            </div>
            <div className="bin-part part-mesh">
              ━━━━ Saringan Plat Stainless Steel Perforated Mesh 1.5mm ━━━━
            </div>
            <div className="bin-part part-leachate">
              💧 Tangki Cairan Lindi (POC): <strong>{currentBin.leachateVolumeLiters} Liter</strong><br />
              <small>Keran Bawah: Siap Dipanen Warga / Disemprot Eco-Enzyme</small>
            </div>
          </div>

          {/* Physical LED Lights */}
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <div className="led-box">
              <div className={`physical-led ${ledSignal === 'GREEN' ? 'green-on' : ''}`}></div>
              <span>LED Hijau (Pakan Aman)</span>
            </div>
            <div className="led-box">
              <div className={`physical-led ${ledSignal === 'YELLOW' ? 'yellow-on' : ''}`}></div>
              <span>LED Kuning (Kontaminasi!)</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <div className="grid-2">
            <button className="btn btn-primary" onClick={handleOpenLid}>
              🔄 Simulasi Warga Buka Tutup Tong
            </button>
            <button className="btn btn-secondary" onClick={handlePressFrenchPress}>
              ⏬ Tekan French Press (Ekstraksi Lindi)
            </button>
          </div>
        </div>
      </div>

      {/* Right: Sensor Inputs & Transmit */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📡 ESP32-CAM Sensor Ingestion Hub</div>
            <div className="card-desc">Pengaturan nilai sensor HC-SR04, Load Cell, & trigger pengiriman payload</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Pilih Tong Komunal:</label>
          <select
            className="form-select"
            value={currentBin.id}
            onChange={(e) => setSelectedBinId(e.target.value)}
          >
            {bins.map((bin) => (
              <option key={bin.id} value={bin.id}>
                {bin.id} - {bin.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Tinggi Sampah / Ultrasonik HC-SR04: <strong>{currentBin.currentFillPercent}%</strong>
          </label>
          <input
            type="range"
            className="form-control"
            min="0"
            max="100"
            value={currentBin.currentFillPercent}
            onChange={(e) => onUpdateBin(currentBin.id, { currentFillPercent: parseFloat(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Timbangan Load Cell HX711: <strong>{currentBin.currentWeightKg} kg</strong>
          </label>
          <input
            type="range"
            className="form-control"
            min="0"
            max="15"
            step="0.1"
            value={currentBin.currentWeightKg}
            onChange={(e) => onUpdateBin(currentBin.id, { currentWeightKg: parseFloat(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pilihan Sampel Foto Kamera OV2640 untuk Gatekeeper AI:</label>
          <select
            className="form-select"
            value={samplePhoto}
            onChange={(e) => setSamplePhoto(e.target.value)}
          >
            <option value="clean_organic">Sampel A: 100% Organik Murni (Sisa Sayur & Nasi)</option>
            <option value="contaminated_plastic">Sampel B: Kontaminasi Plastik Kresek & Sachet</option>
            <option value="contaminated_glass_metal">Sampel C: Kontaminasi Pecahan Kaca & Tutup Botol Logam</option>
            <option value="borderline_tissue">Sampel D: Campuran Organik + Kertas Tisu Basah</option>
          </select>
        </div>

        <button className="btn btn-warning" style={{ width: '100%', marginTop: '0.5rem' }} onClick={handleTransmitEdge}>
          🚀 Kirim Payload ESP32 ke Cloud (HTTPS POST Image & JSON)
        </button>

        <div style={{ marginTop: '1rem' }}>
          <div className="form-label">Edge Console & Serial Monitor (115200 baud):</div>
          <div className="terminal-box">
            {terminalLogs.map((log, index) => (
              <div key={index} className={`terminal-line ${log.type}`}>
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
