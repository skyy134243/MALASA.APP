/**
 * ==============================================================================
 * MALASA.APP ECOSYSTEM - CLOUD CORE MICROSERVICES
 * Architecture: RESTful API Gateway, Gatekeeper AI, Logistics VRP, Circular Ledger
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-Memory Database (Foundation model, easily mapped to PostgreSQL / TimescaleDB)
const binsDatabase = [
  {
    id: "MALASA-BIN-01",
    rtLocation: "RT 03 / RW 02 Kel. Tegalgede, Kec. Sumbersari, Jember",
    lat: -8.1682,
    lng: 113.7153,
    capacityLiters: 120,
    currentFillPercent: 78.4,
    currentWeightKg: 6.2,
    leachateVolumeLiters: 4.5,
    isContaminated: false,
    lastContaminant: null,
    maggotSafeScore: 94,
    status: "CRITICAL_FULL",
    lastUpdated: new Date().toISOString(),
    fillHistory: [
      { timestamp: "2026-10-14T18:00:00Z", fill: 35.0, weight: 2.1 },
      { timestamp: "2026-10-14T21:00:00Z", fill: 52.0, weight: 3.8 },
      { timestamp: "2026-10-15T06:00:00Z", fill: 78.4, weight: 6.2 }
    ]
  },
  {
    id: "MALASA-BIN-02",
    rtLocation: "RT 01 / RW 05 Kel. Krajan, Kec. Patrang, Jember",
    lat: -8.1554,
    lng: 113.7021,
    capacityLiters: 120,
    currentFillPercent: 42.0,
    currentWeightKg: 3.1,
    leachateVolumeLiters: 2.1,
    isContaminated: true,
    lastContaminant: "Plastik kresek sachet & sedotan",
    maggotSafeScore: 48,
    status: "CONTAMINATED",
    lastUpdated: new Date().toISOString(),
    fillHistory: [
      { timestamp: "2026-10-14T19:00:00Z", fill: 20.0, weight: 1.5 },
      { timestamp: "2026-10-15T05:30:00Z", fill: 42.0, weight: 3.1 }
    ]
  },
  {
    id: "MALASA-BIN-03",
    rtLocation: "RT 04 / RW 01 Lingkungan Kampus UNEJ, Sumbersari, Jember",
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
    lastUpdated: new Date().toISOString(),
    fillHistory: [
      { timestamp: "2026-10-14T16:00:00Z", fill: 40.0, weight: 3.2 },
      { timestamp: "2026-10-14T22:00:00Z", fill: 68.0, weight: 5.4 },
      { timestamp: "2026-10-15T06:30:00Z", fill: 88.0, weight: 7.4 }
    ]
  }
];

const transactionsLedger = [
  {
    id: "TRX-20261015-001",
    binId: "MALASA-BIN-01",
    cultivatorName: "Koperasi Maggot Lestari Jember",
    weightKg: 6.2,
    pricePerKg: 500, // Rp 500 / kg
    grossAmount: 3100,
    platformFeeRate: 0.08, // 8% Malasa.App Platform fee
    platformFeeAmount: 248,
    netCitizenReward: 2852,
    leachateTappedLiters: 4.5,
    status: "SETTLED",
    timestamp: new Date().toISOString()
  }
];

// Helper: Haversine distance in KM
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 1. Telemetry Ingest & Edge Payload Receiver
app.post('/api/v1/telemetry/edge-ingest', (req, res) => {
  const binId = req.headers['x-bin-id'] || req.body.binId || "MALASA-BIN-01";
  const fillPercent = parseFloat(req.headers['x-fill-percent'] || req.body.fillPercent || 0);
  const weightKg = parseFloat(req.headers['x-weight-kg'] || req.body.weightKg || 0);

  let bin = binsDatabase.find(b => b.id === binId);
  if (!bin) {
    bin = {
      id: binId,
      rtLocation: "Unit Komunal Baru Terdaftar",
      lat: -8.1600,
      lng: 113.7100,
      capacityLiters: 120,
      currentFillPercent: fillPercent,
      currentWeightKg: weightKg,
      leachateVolumeLiters: 0,
      isContaminated: false,
      maggotSafeScore: 90,
      status: "NORMAL",
      lastUpdated: new Date().toISOString(),
      fillHistory: []
    };
    binsDatabase.push(bin);
  } else {
    bin.currentFillPercent = fillPercent;
    bin.currentWeightKg = weightKg;
    bin.lastUpdated = new Date().toISOString();
  }

  // Evaluate status
  if (bin.currentFillPercent >= 70 || bin.currentWeightKg >= 5.0) {
    bin.status = "CRITICAL_FULL";
  } else if (!bin.isContaminated) {
    bin.status = "NORMAL";
  }

  bin.fillHistory.push({
    timestamp: new Date().toISOString(),
    fill: fillPercent,
    weight: weightKg
  });

  return res.status(200).json({
    success: true,
    message: "Telemetry ingested successfully",
    binId: bin.id,
    currentStatus: bin.status,
    isContaminated: bin.isContaminated
  });
});

// 2. Gatekeeper AI Vision Garbage Validation Endpoint
app.post('/api/v1/ai/validate-waste', async (req, res) => {
  const { binId, imageBase64, simulatedContaminant } = req.body;
  const bin = binsDatabase.find(b => b.id === binId);

  // Heuristic / Simulated Engine or Gemini Vision call
  let isContaminated = false;
  let contaminants = [];
  let score = 95;
  let summary = "Permukaan didominasi sisa sayur, kulit buah, dan nasi basi. Aman untuk media larva BSF.";

  if (simulatedContaminant || (imageBase64 && imageBase64.includes("plastic"))) {
    isContaminated = true;
    contaminants = ["Plastik kresek bening", "Styrofoam potongan kecil"];
    score = 42;
    summary = "Peringatan: Terdeteksi materi anorganik non-degradable berisiko tinggi mematikan koloni maggot.";
  }

  if (bin) {
    bin.isContaminated = isContaminated;
    bin.lastContaminant = isContaminated ? contaminants.join(", ") : null;
    bin.maggotSafeScore = score;
    if (isContaminated) {
      bin.status = "CONTAMINATED";
    }
  }

  return res.json({
    success: true,
    timestamp: new Date().toISOString(),
    binId,
    is_contaminated: isContaminated,
    detected_contaminants: contaminants,
    maggot_safe_score: score,
    ai_verdict: summary,
    trigger_action: isContaminated ? "TRIGGER_YELLOW_LED_AND_NOTIFY_RT" : "TRIGGER_GREEN_LED_NORMAL"
  });
});

// 3. Get All Communal Bins
app.get('/api/v1/bins', (req, res) => {
  res.json({
    success: true,
    totalBins: binsDatabase.length,
    bins: binsDatabase
  });
});

// 4. Smart Routing & Dynamic Logistics VRP Optimizer
app.get('/api/v1/logistics/dispatch', (req, res) => {
  // Maggot Cultivator Depo / Hub (Reference location in Sumbersari, Jember)
  const depo = { name: "Depo Budidaya Maggot Koperasi Lestari", lat: -8.1720, lng: 113.7200 };

  // Prioritize critical full bins, then high volume bins
  const actionableBins = binsDatabase
    .filter(b => b.currentFillPercent >= 40 || b.status === "CRITICAL_FULL")
    .map(b => {
      const distFromDepo = haversineDistance(depo.lat, depo.lng, b.lat, b.lng);
      return {
        ...b,
        distanceKm: parseFloat(distFromDepo.toFixed(2)),
        priorityScore: (b.currentFillPercent * 0.7) + (b.isContaminated ? -20 : 30)
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);

  let totalTripDistance = 0;
  let estimatedBiomassYield = 0;

  actionableBins.forEach(b => {
    totalTripDistance += (b.distanceKm * 1.4); // approx road factor
    estimatedBiomassYield += b.currentWeightKg;
  });

  res.json({
    success: true,
    depoOrigin: depo,
    recommendedOrder: actionableBins,
    totalTripEstimatedKm: parseFloat(totalTripDistance.toFixed(2)),
    totalBiomassYieldKg: parseFloat(estimatedBiomassYield.toFixed(2)),
    estimatedCO2SavedKg: parseFloat((estimatedBiomassYield * 2.5).toFixed(2))
  });
});

// 5. Digital Weighing & Circular Marketplace Transaction
app.post('/api/v1/transactions/confirm-pickup', (req, res) => {
  const { binId, cultivatorName, measuredWeightKg, pricePerKg = 500, platformFeeRate = 0.08 } = req.body;
  const bin = binsDatabase.find(b => b.id === binId);

  if (!bin) {
    return res.status(404).json({ success: false, message: "Tong tidak ditemukan" });
  }

  const weight = parseFloat(measuredWeightKg || bin.currentWeightKg);
  const grossAmount = Math.round(weight * pricePerKg);
  const platformFee = Math.round(grossAmount * platformFeeRate);
  const netReward = grossAmount - platformFee;

  const trx = {
    id: `TRX-${Date.now().toString().slice(-8)}`,
    binId: bin.id,
    rtLocation: bin.rtLocation,
    cultivatorName: cultivatorName || "Mitra Pembudidaya Maggot UNEJ",
    weightKg: weight,
    pricePerKg,
    grossAmount,
    platformFeeRate,
    platformFeeAmount: platformFee,
    netCitizenReward: netReward,
    leachateTappedLiters: bin.leachateVolumeLiters,
    status: "SETTLED",
    timestamp: new Date().toISOString()
  };

  transactionsLedger.unshift(trx);

  // Reset bin metrics post-pickup
  bin.currentFillPercent = 0.0;
  bin.currentWeightKg = 0.0;
  bin.leachateVolumeLiters = 0.0;
  bin.status = "NORMAL";
  bin.isContaminated = false;

  res.json({
    success: true,
    message: "Penimbangan berhasil dikonfirmasi. Dana insentif ditransfer ke dompet RT.",
    transaction: trx
  });
});

// 6. DLH (Dinas Lingkungan Hidup) Analytics Hub
app.get('/api/v1/analytics/dlh', (req, res) => {
  const totalWeightDiverted = transactionsLedger.reduce((sum, t) => sum + t.weightKg, 0) +
                              binsDatabase.reduce((sum, b) => sum + b.currentWeightKg, 0);
  const totalLeachateTapped = transactionsLedger.reduce((sum, t) => sum + t.leachateTappedLiters, 0) +
                              binsDatabase.reduce((sum, b) => sum + b.leachateVolumeLiters, 0);
  const totalGrossValue = transactionsLedger.reduce((sum, t) => sum + t.grossAmount, 0);
  const totalPlatformFees = transactionsLedger.reduce((sum, t) => sum + t.platformFeeAmount, 0);

  res.json({
    success: true,
    district: "Kabupaten Jember (Pilot KSKM UNEJ)",
    metrics: {
      totalCommunalBins: binsDatabase.length,
      totalOrganicWasteDivertedKg: parseFloat(totalWeightDiverted.toFixed(2)),
      totalLiquidFertilizerLiters: parseFloat(totalLeachateTapped.toFixed(2)),
      methaneAvoidedKgCH4: parseFloat((totalWeightDiverted * 0.45).toFixed(2)),
      totalEconomicCirculationIdr: totalGrossValue,
      platformRevenueIdr: totalPlatformFees
    }
  });
});

app.listen(PORT, () => {
  console.log(`[MALASA CORE] Microservices running on port ${PORT}`);
});
