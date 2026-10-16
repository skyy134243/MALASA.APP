# STRATEGI PERTAHANAN SIDANG DEWAN JURI: ENOV KSKM UNIVERSITAS JEMBER
**Ekosistem Malasa.App: Smart Communal Bin + Gatekeeper AI + Cloud SaaS**

---

## 1. Argumen Inti (Core Thesis)
Masalah terbesar dalam industri biokonversi maggot *Black Soldier Fly* (BSF) bukanlah membudidayakan lalatnya, melainkan **kualitas dan kontinuitas pakan sampah organik yang bebas dari kontaminasi anorganik (plastik, kaca, jarum, baterai)**. 

Kontaminasi plastik sekecil 5% pada media pakan dapat menyebabkan:
- Penyumbatan saluran pencernaan larva maggot.
- Akumulasi mikroplastik pada tepung maggot (menurunkan nilai jual pakan ternak/ikan).
- Kematian massal (*colony crash*) larva maggot yang merugikan pembudidaya.

Malasa.App menyelesaikan problem ini langsung pada sumber timbulan sampah melalui perpaduan rekayasa mekanis, Edge AI, dan insentif ekonomi digital.

---

## 2. Matriks Tanya Jawab Strategis (Q&A Defense)

### Pertanyaan 1: Efisiensi Komputasi & Daya IoT
> **Dewan Juri:** *"Mengapa harus menggunakan AI Cloud Vision yang mahal dan boros kuota internet untuk sampah? Bukankah sensor berat atau ultrasonik saja sudah cukup?"*

**Jawaban Anda:**
> *"Pak/Ibu Juri yang terhormat, sensor berat hanya mampu memberi tahu **'berapa banyak' (kuantitas)** sampah yang masuk, tetapi buta total terhadap **'apa isi dan kualitas'** sampah tersebut. Sensor berat tidak bisa membedakan antara 5 kg kulit semangka murni dengan 5 kg sampah yang di dalamnya terbungkus plastik kresek atau pecahan kaca.
>
> Mengapa kami memilih arsitektur Cloud AI Vision (seperti Gemini 1.5 Flash API) dibanding Edge AI berat?
> 1. **Daya Baterai:** ESP32-CAM berada dalam mode *Deep Sleep* 99% dari waktu operasionalnya, hanya bangun saat limit switch tutup tong terpicu (Event-Driven). Ini membuat konsumsi arus hanya berkisar $\sim 15\mu\text{A}$ pada saat diam, sehingga baterai 18650 mampu bertahan berbulan-bulan tanpa pasokan listrik PLN.
> 2. **Biaya Hardware Murah:** Mikrokontroler tidak perlu dibebani chip NPU/TPU mahal seharga jutaan rupiah. Kami cukup menggunakan modul ESP32-CAM seharga Rp75.000–Rp95.000.
> 3. **Akurasi Tinggi:** Model Cloud Vision memiliki parameter masif yang mampu mengidentifikasi mikro-fragmen plastik transparan, sedotan, styrofoam, dan sachet alumunium foil dengan tingkat akurasi di atas 90% tanpa perlu repot melakukan flashing ulang model ke ratusan tong di lapangan."*

---

### Pertanyaan 2: Adopsi Warga & Kebiasaan Sosial
> **Dewan Juri:** *"Bagaimana cara Anda meyakinkan warga desa atau perumahan agar mau repot-repot memilah dan merawat alat ini?"*

**Jawaban Anda:**
> *"Desain Malasa.App dibangun dengan filosofi **'Zero Friction Habit'** (Nihil Hambatan Perilaku):
> 1. **Tidak Ada Edukasi yang Melelahkan:** Warga membuang sampah seperti biasa. Saat tutup dibuka, mekanisme hopper sling secara otomatis menaburkan bekatul + EM4 penekan bau tanpa warga harus menyentuh apapun.
> 2. **Tidak Becek & Tidak Bau:** Karbon aktif dan seal EPDM menghilangkan bau busuk amonia di lingkungan pemukiman, sedangkan tuas *French Press* mengalirkan cairan lindi ke bawah sehingga tempat sampah tetap kering.
> 3. **Insentif Ganda Nyata:** 
>    - **Finansial:** Setiap kg sampah yang terkumpul terkonversi menjadi rupiah yang masuk langsung ke kas kas RT atau dompet digital warga (Rp500/kg).
>    - **Produk:** Warga memperoleh Pupuk Organik Cair (POC) gratis dari keran bawah tong yang dapat langsung digunakan untuk menyuburkan tanaman pekarangan mereka."*

---

### Pertanyaan 3: Kelayakan Finansial & Model Bisnis Sirkular
> **Dewan Juri:** *"Siapa yang akan mendanai dan membeli sistem ini? Bagaimana platform ini menghidupi dirinya sendiri?"*

**Jawaban Anda:**
> *"Malasa.App memiliki model monetisasi hibrida (*Multi-Sided Platform*):
> 1. **B2G (Business-to-Government):** Pengadaan unit tong fisik kepada Dinas Lingkungan Hidup (DLH) Kabupaten Jember untuk program *Smart Village* dan penanganan timbulan sampah di sumber dengan margin manufaktur 25%–30% (Harga per unit sangat terjangkau: Rp450.000 – Rp550.000).
> 2. **SaaS Subscription Pembudidaya Maggot:** Mitra pembudidaya maggot berlangganan fitur *Predictive Dispatch & Dynamic Routing* seharga Rp150.000 – Rp300.000/bulan untuk memangkas biaya bahan bakar armada penjemputan hingga 32.5%.
> 3. **Marketplace Platform Fee:** Sistem memotong 5%–10% secara otomatis pada setiap transaksi timbang bayar sampah antara pembudidaya dan RT.
> 4. **Konsumabel & Perawatan:** Penjualan paket isi ulang bekatul EM4 dan penggantian filter karbon aktif tiap 3 bulan."*
