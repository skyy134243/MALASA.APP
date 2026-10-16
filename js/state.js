/**
 * ==============================================================================
 * MALASA.APP STATE STORE (REACTIVE CLIENT-SIDE STORE)
 * Menampung state tong komunal, telemetri sensor, log AI, dan ledger transaksi.
 * ==============================================================================
 */

const MalasaState = {
  // Master Data Tong Komunal (Smart Communal Bins)
  bins: [
    {
      id: "MALASA-BIN-01",
      name: "Tong Komunal RT 03 Tegalgede",
      location: "RT 03 / RW 02 Kel. Tegalgede, Kec. Sumbersari, Jember",
      lat: -8.1682,
      lng: 113.7153,
      capacityLiters: 120,
      currentFillPercent: 78.4,
      currentWeightKg: 6.2,
      leachateVolumeLiters: 4.5,
      isContaminated: false,
      lastContaminant: null,
      maggotSafeScore: 94,
      status: "CRITICAL_FULL", // NORMAL, CONTAMINATED, CRITICAL_FULL
      lastUpdated: new Date().toLocaleTimeString(),
      hopperTriggerCount: 42, // Berapa kali dispense bekatul
      fillRatePerHour: 2.1, // % per hour
      hoursToFull: 1.2
    },
    {
      id: "MALASA-BIN-02",
      name: "Tong Komunal RT 01 Patrang",
      location: "RT 01 / RW 05 Kel. Krajan, Kec. Patrang, Jember",
      lat: -8.1554,
      lng: 113.7021,
      capacityLiters: 120,
      currentFillPercent: 42.0,
      currentWeightKg: 3.1,
      leachateVolumeLiters: 2.1,
      isContaminated: true,
      lastContaminant: "Plastik kemasan sachet & sedotan",
      maggotSafeScore: 48,
      status: "CONTAMINATED",
      lastUpdated: new Date().toLocaleTimeString(),
      hopperTriggerCount: 28,
      fillRatePerHour: 1.4,
      hoursToFull: 18.5
    },
    {
      id: "MALASA-BIN-03",
      name: "Tong Komunal Kampus UNEJ",
      location: "RT 04 / RW 01 Lingkungan Kampus UNEJ, Sumbersari, Jember",
      lat: -8.1631,
      lng: 113.7188,
      capacityLiters: 120,
      currentFillPercent: 88.0,
      currentWeightKg: 7.4,
      leachateVolumeLiters: 5.8,
      isContaminated: false,
      lastContaminant: null,
      maggotSafeScore: 98,
      status: "CRITICAL_FULL",
      lastUpdated: new Date().toLocaleTimeString(),
      hopperTriggerCount: 65,
      fillRatePerHour: 3.4,
      hoursToFull: 0.6
    },
    {
      id: "MALASA-BIN-04",
      name: "Tong Komunal RT 02 Kaliwates",
      location: "RT 02 / RW 04 Kel. Sempusari, Kec. Kaliwates, Jember",
      lat: -8.1812,
      lng: 113.6894,
      capacityLiters: 120,
      currentFillPercent: 25.0,
      currentWeightKg: 1.8,
      leachateVolumeLiters: 1.2,
      isContaminated: false,
      lastContaminant: null,
      maggotSafeScore: 92,
      status: "NORMAL",
      lastUpdated: new Date().toLocaleTimeString(),
      hopperTriggerCount: 15,
      fillRatePerHour: 0.9,
      hoursToFull: 48.0
    }
  ],

  // Log Evaluasi Gatekeeper AI
  aiLogs: [
    {
      id: "AI-EV-901",
      binId: "MALASA-BIN-03",
      timestamp: "10:14:22",
      isContaminated: false,
      contaminants: [],
      maggotSafeScore: 98,
      promptUsed: "Identifikasi kontaminasi material non-organik (plastik, logam, kaca) pada permukaan sampah.",
      summary: "Permukaan 100% sisa makanan basah, potongan sayur kol, sawi, dan nasi. Sangat aman untuk media pakan maggot.",
      actionTriggered: "LED_HIJAU"
    },
    {
      id: "AI-EV-900",
      binId: "MALASA-BIN-02",
      timestamp: "09:48:10",
      isContaminated: true,
      contaminants: ["Plastik kresek hitam", "Tutup botol plastik"],
      maggotSafeScore: 48,
      promptUsed: "Identifikasi kontaminasi material non-organik (plastik, logam, kaca) pada permukaan sampah.",
      summary: "Terdeteksi fragmen plastik sintetis non-organik. Berpotensi mematikan pencernaan larva maggot jika tidak dipilah.",
      actionTriggered: "LED_KUNING_NOTIF_KETUA_RT"
    }
  ],

  // Transaksi Ekonomi Sirkular (Marketplace & Insentif Warga)
  transactions: [
    {
      id: "TRX-20261015-01",
      binId: "MALASA-BIN-01",
      rtName: "RT 03 Tegalgede",
      cultivatorName: "Koperasi Maggot Lestari Jember",
      weightKg: 6.2,
      pricePerKg: 500,
      grossAmount: 3100,
      feeRate: 0.08, // 8% platform fee
      feeAmount: 248,
      netCitizenReward: 2852,
      leachateLiters: 4.5,
      timestamp: "2026-10-15 08:30"
    }
  ],

  // Saldo Dompet Warga RT (Incentive Points & POC Stock)
  rtWallets: {
    "MALASA-BIN-01": { balanceIdr: 45200, totalOrganicKg: 90.4, pocHarvestedLiters: 32.0 },
    "MALASA-BIN-02": { balanceIdr: 21500, totalOrganicKg: 43.0, pocHarvestedLiters: 14.5 },
    "MALASA-BIN-03": { balanceIdr: 68000, totalOrganicKg: 136.0, pocHarvestedLiters: 48.0 },
    "MALASA-BIN-04": { balanceIdr: 12000, totalOrganicKg: 24.0, pocHarvestedLiters: 8.0 }
  },

  // Central Listeners for updates
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
  },
  notify() {
    this.listeners.forEach(fn => fn(this));
  }
};
