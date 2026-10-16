# MALASA.APP ECOSYSTEM
### Smart Communal Bin + Gatekeeper AI + Cloud SaaS
*Platform Dasar untuk Persidangan Dewan Juri Enov KSKM Universitas Jember*

---

## 📌 Gambaran Umum Platform
Platform ini dibangun sebagai fondasi fungsional menyeluruh (*foundational core platform*) yang menghubungkan:
1. **Physical & Edge Computing**: Drum komunal HDPE 120L dengan mekanisme French Press, dispenser bekatul pasif, dan ESP32-CAM.
2. **Gatekeeper AI Vision**: Engine validasi pakan larva maggot (BSF) untuk deteksi kontaminasi anorganik (plastik, kaca, logam).
3. **Predictive Analytics**: Peramalan laju keterisian berbasis time-series (estimasi jam menuju ambang batas 70% / 5kg).
4. **Logistics & Smart Routing**: Optimasi rute penjemputan armada pembudidaya maggot (*Vehicle Routing Problem*).
5. **DLH & Circular Economy Hub**: Pembukuan insentif kas RT/warga, panen Pupuk Organik Cair (POC), dan *platform fee* 5%-10%.

UI dan UX sengaja disusun secara **bersih, terstruktur, semantik, dan wireframe-friendly** agar Anda dapat dengan leluasa menyusun dan menyempurnakan desain visual (UI/UX) sesuai selera dan standar presentasi tim.

---

## 📂 Struktur Repositori

```plaintext
malasa-app/
├── index.html                  # Aplikasi web dashboard interaktif utama (Multi-Role)
├── css/
│   └── style.css               # Desain CSS modular & variabel warna yang mudah dikustomisasi
├── js/
│   ├── state.js                # Central reactive state store (tong, telemetri, transaksi)
│   ├── gatekeeper-ai.js        # Engine Vision AI (simulasi heuristik cerdas + Gemini Vision API)
│   ├── predictive-engine.js    # Perhitungan time-to-full time-series laju pengisian
│   ├── routing-engine.js       # Solusi rute VRP Haversine armada maggot Jember
│   ├── circular-economy.js     # Pembukuan kas RT, penimbangan digital, & platform fee 8%
│   └── app.js                  # Controller interaksi DOM & event listeners
├── firmware/
│   └── esp32_cam_gatekeeper.ino# Kode program C++ lengkap untuk modul ESP32-CAM (Deep Sleep & HTTP)
├── backend/
│   ├── server.js               # REST API Node.js Express Cloud Core Microservices
│   └── package.json            # Dependensi backend (Express, Multer, Cors)
└── docs/
    ├── ARCHITECTURE.md         # Blueprint arsitektur terdistribusi 3-tier
    ├── FLOWCHARTS.md           # Diagram alur 1 (Fisik), alur 2 (IoT & AI), alur 3 (Logistik)
    └── JURY_DEFENSE.md         # Cheat-sheet Q&A taktis untuk menghadapi pertanyaan dewan juri
```

---

## 🚀 Cara Menjalankan Platform

### Opsi 1: Menjalankan Frontend Langsung di Browser (Paling Cepat & Portabel)
Cukup buka file `index.html` langsung di browser Anda (Google Chrome, Edge, Safari, Firefox):
```plaintext
C:\Users\LAB 1 SAKA\.gemini\antigravity\scratch\malasa-app\index.html
```
Semua simulasi (buka tutup tong, dispenser bekatul, sensor HC-SR04/Load Cell, Gatekeeper AI, optimasi rute, dan dompet RT) sudah berfungsi interaktif di dalam browser tanpa instalasi tambahan.

### Opsi 2: Menjalankan Backend Node.js Express (Jika Node.js Terpasang)
```bash
cd backend
npm install
npm start
```
Server akan aktif di `http://localhost:4000` dengan endpoint siap pakai:
- `POST /api/v1/telemetry/edge-ingest`
- `POST /api/v1/ai/validate-waste`
- `GET /api/v1/bins`
- `GET /api/v1/logistics/dispatch`
- `POST /api/v1/transactions/confirm-pickup`
- `GET /api/v1/analytics/dlh`

---

## 💡 Kustomisasi UI / UX yang Direkomendasikan
Semua variabel visual didefinisikan di bagian atas `css/style.css`:
- `--color-brand` (Warna utama hijau organik: `#059669`)
- `--color-warning` (Warna peringatan kuning LED: `#d97706`)
- `--color-danger` (Warna tong penuh merah: `#dc2626`)
- `--font-sans` dan `--radius-md`

Anda dapat dengan mudah menyuntikkan framework CSS seperti Tailwind CSS, Bootstrap, atau styling custom Figma Anda tanpa khawatir merusak logika engine JavaScript di baliknya.
