# MALASA.APP ECOSYSTEM (React + Vite Framework)
### Smart Communal Bin + Gatekeeper AI + Cloud SaaS
*Platform Dasar untuk Persidangan Dewan Juri Enov KSKM Universitas Jember*

---

## 📌 Gambaran Umum Platform
Platform Malasa.App kini telah dimigrasikan secara penuh ke **React + Vite Framework** modern. 

Arsitektur ini mengatasi kendala *routing server* ("Cannot GET /") saat di-deploy di platform cloud seperti **Vercel**, sekaligus memberikan fondasi komponen yang terstruktur rapi bagi Anda untuk menyusun desain antarmuka pengguna (UI/UX).

### Modul Sistem yang Terintegrasi:
1. **Physical & Edge IoT Simulator**: Drum HDPE 120L dengan mekanisme French Press, dispenser bekatul pasif penekan bau, sensor ultrasonik & load cell, serta ESP32-CAM.
2. **Gatekeeper AI Vision**: Engine validasi pakan larva maggot (BSF) untuk deteksi kontaminasi anorganik (plastik, kaca, logam).
3. **Predictive Analytics**: Peramalan laju keterisian berbasis time-series (estimasi jam menuju ambang batas 70% / 5kg).
4. **Logistics & Smart Routing**: Optimasi rute penjemputan armada pembudidaya maggot (*Vehicle Routing Problem*).
5. **DLH & Circular Economy Hub**: Pembukuan kas RT/warga, panen Pupuk Organik Cair (POC), dan *platform fee* 5%-10%.
6. **Blueprint & Jury Defense**: Strategi argumen tanya-jawab dan matriks estimasi biaya komponen (BOM) Rp450.000–Rp550.000.

---

## 📂 Struktur Repositori (Framework Modern)

```plaintext
malasa-app/
├── index.html                   # HTML Entry Point Vite SPA
├── package.json                 # Manifest React 18 & Vite 5
├── vite.config.js               # Konfigurasi bundling Vite
├── vercel.json                  # Konfigurasi SPA rewrite otomatis untuk Vercel
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # State koordinasi & router tab
│   ├── index.css                # Wireframe foundation & CSS variables
│   ├── components/
│   │   ├── Navbar.jsx           # Header & tab navigasi ekosistem
│   │   ├── PhysicalEdgeSimulator.jsx # Simulasi hardware drum, bekatul, sensor & LED
│   │   ├── GatekeeperAIVision.jsx    # Vision AI inspector pakan larva maggot
│   │   ├── PredictiveAnalytics.jsx   # Estimasi waktu penuh time-series
│   │   ├── MaggotLogisticsRouting.jsx# Rute armada VRP & form penimbangan digital
│   │   ├── DLHCircularEconomy.jsx    # Dashboard makro DLH & dompet kas RT
│   │   └── BlueprintJuryDefense.jsx  # Q&A sidang juri & tabel anggaran BOM
│   └── services/
│       ├── data.js              # Seed data awal tong komunal & depo
│       ├── gatekeeper.js        # Engine deteksi AI & Gemini Vision API
│       ├── predictive.js        # Kalkulasi peramalan kapasitas
│       └── routing.js           # Solusi rute VRP Haversine Jember
├── firmware/
│   └── esp32_cam_gatekeeper.ino # Firmware Arduino C++ lengkap untuk ESP32-CAM
├── backend/
│   ├── server.js                # Microservices REST API Node.js Express
│   └── package.json             # Manifest server
└── docs/
    ├── ARCHITECTURE.md          # Dokumen arsitektur terdistribusi 3-tier
    ├── FLOWCHARTS.md            # Diagram alur fisik warga, IoT-AI, & logistik
    └── JURY_DEFENSE.md          # Lembar strategi pertahanan sidang juri
```

---

## 🚀 Deployment Otomatis ke Vercel

Dengan konfigurasi `vercel.json` dan `package.json` di root:
1. Vercel akan otomatis mengenali proyek sebagai **Vite React**.
2. Vercel menjalankan `npm run build` dan menyajikan folder output `dist`.
3. Routing SPA di-handle otomatis via rewrites, sehingga error *"Cannot GET /"* **100% terselesaikan**.
