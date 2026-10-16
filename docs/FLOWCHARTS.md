# FLOWCHART & EXECUTIVE WORKFLOW: MALASA.APP ECOSYSTEM
*Smart Communal Bin + Gatekeeper AI + Cloud SaaS*
*Fakultas / Universitas Jember - Enov KSKM*

---

## Diagram Alur 1: Proses Operasional Fisik & Mekanis di Tingkat Warga (Multi-Tier Action)

```mermaid
flowchart TD
    A["Warga Membuka Tutup Tong Komunal (Drum HDPE 120L)"] --> B["Mekanis Hopper: Kawat Sling Menarik Lempeng Akrilik"]
    A --> C["Sensor Trigger: Limit Switch / HC-SR04 Berubah Status"]
    
    B --> D["Menjatuhkan 1 Takar (±15g) Bekatul + EM4 Kering ke Permukaan Sampah"]
    C --> E["Membangunkan ESP32-CAM dari Mode 'Deep Sleep' (Konsumsi Daya Mikroampere)"]

    D --> F["Warga Membuang Sampah Organik Domestik"]
    F --> G["Warga Menutup Kembali Tutup Tong"]

    G --> H["Seal Karet EPDM Mengunci Rapat Rongga (Odor Isolation)"]
    G --> I["Gas Amonia/Bau Dialirkan Melewati Filter Spons Karbon Aktif"]

    H --> J["Warga Menekan Tuas French Press (Secara Berkala / Sekali Sehari)"]
    J --> K["Piringan Penekan Memeras Kandungan Air pada Serat Sampah Padat"]

    K --> L["Cairan Lindi Turun ke Kompartemen Bawah secara Gravitasi"]
    L --> M["Melewati Saringan Plat Stainless Perforated Mesh 1.5 mm"]
    M --> N["Ditampung di Tangki Bawah (Siap Dipanen Jadi Pupuk Organik Cair / POC)"]
```

---

## Diagram Alur 2: Alur Pemrosesan IoT & "Gatekeeper AI" (Cloud Vision Intelligence)

```mermaid
flowchart TD
    A["ESP32-CAM Menangkap Foto Permukaan Sampah (Settle Delay 0.8s)"] --> B["Pengiriman Payload via HTTPS POST (Multipart / Base64 JSON)"]
    B --> C["Cloud AI Vision (Gemini 1.5 Flash / Cloud Vision API) Menganalisis Gambar"]
    
    C --> D{"Prompt: 'Identifikasi kontaminasi material non-organik (plastik, logam, kaca)'<br/>Apakah 'is_contaminated' == true?"}
    
    D -->|YA / TERKONTAMINASI| E["1. Trigger Lampu LED KUNING pada Fisik Tong<br/>2. Kirim Push Notification Peringatan ke HP Ketua RT"]
    D -->|TIDAK / AMAN| F["Trigger Lampu LED HIJAU pada Fisik Tong (Pakan Terverifikasi Aman untuk Maggot)"]

    E --> G["Sensor Ultrasonik (Tinggi) & Load Cell (Berat) Memeriksa Kapasitas Tong"]
    F --> G

    G --> H{"Evaluasi Ambang Batas Kapasitas"}
    H -->|Berat < 5kg & Kapasitas < 70%| I["Status: NORMAL (Hijau)"]
    H -->|Berat >= 5kg atau Kapasitas >= 70%| J["Status: CRITICAL / SIAP JEMPUT (Merah)"]

    J --> K["ESP32 Mengirim Sinyal Status Penuh ke Broker MQTT / REST API Gateway"]
    K --> L["Database Mencatat Timestamp, Location ID, & Metrik Telemetri"]
```

---

## Diagram Alur 3: Alur Logistik Cerdas & Prediksi AI di Malasa.App SaaS

```mermaid
flowchart TD
    A["Data Historis Pengisian Masuk ke Time-Series DB Malasa.App"] --> B["Algoritma Machine Learning (LSTM / Regression Time-Series) Berjalan"]
    B --> C["Prediksi Laju Kepenuhan: 'Estimasi Tong X Penuh dalam 3 Jam ke Depan'"]

    C --> D["Modul Smart Routing Optimization (Vehicle Routing Problem / VRP)"]
    D --> E["Menghitung Matriks Jarak GIS & Jalur Rute Terpendek Paling Hemat Bahan Bakar"]

    E --> F["Dashboard Pembudidaya Maggot Memunculkan Dispatch Order"]
    F --> G["Daftar Prioritas Rute Armada: Rute A -> Rute C -> Rute F"]

    G --> H["Petugas Armada Tiba & Melakukan Penjemputan di Titik Komunal"]
    H --> I["Konfirmasi Penimbangan Digital (Weigh-In) via Marketplace Malasa.App"]

    I --> J["Pemotongan Otomatis Platform Fee Malasa.App (5% - 10%)"]
    J --> K["Konversi Berat Sampah Menjadi Poin / Saldo Kas Dompet Digital Warga RT"]
    K --> L["Pengurasan Tangki Lindi untuk Distribusi Pupuk Organik Cair (POC)"]
```
