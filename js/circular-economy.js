/**
 * ==============================================================================
 * MALASA.APP - CIRCULAR ECONOMY & DIGITAL MARKETPLACE ENGINE
 * Mengelola konversi sampah organik -> insentif rupiah warga RT + Platform Fee 5-10%
 * Serta pencatatan panen Pupuk Organik Cair (POC) dari lindi French Press
 * ==============================================================================
 */

const CircularEconomy = {
  DEFAULT_PRICE_PER_KG: 500, // Rp 500 per kg sampah organik pakan maggot
  DEFAULT_PLATFORM_FEE_RATE: 0.08, // 8% biaya layanan platform Malasa.App

  /**
   * Mengonfirmasi penimbangan armada dan membukukan transaksi
   */
  processPickupWeighIn({ binId, measuredWeightKg, pricePerKg, platformFeeRate, cultivatorName }) {
    const bin = MalasaState.bins.find(b => b.id === binId);
    if (!bin) {
      throw new Error("Tong komunal tidak ditemukan dalam sistem.");
    }

    const weight = parseFloat(measuredWeightKg || bin.currentWeightKg);
    const unitPrice = parseFloat(pricePerKg || this.DEFAULT_PRICE_PER_KG);
    const feeRate = parseFloat(platformFeeRate || this.DEFAULT_PLATFORM_FEE_RATE);

    const grossAmount = Math.round(weight * unitPrice);
    const feeAmount = Math.round(grossAmount * feeRate);
    const netReward = grossAmount - feeAmount;
    const leachateHarvested = bin.leachateVolumeLiters;

    const trxId = `TRX-${Date.now().toString().slice(-6)}`;
    const newTransaction = {
      id: trxId,
      binId: bin.id,
      rtName: bin.name,
      cultivatorName: cultivatorName || "Sentra Maggot UNEJ",
      weightKg: weight,
      pricePerKg: unitPrice,
      grossAmount,
      feeRate,
      feeAmount,
      netCitizenReward: netReward,
      leachateLiters: leachateHarvested,
      timestamp: new Date().toLocaleString()
    };

    // Tambah ke transaksi
    MalasaState.transactions.unshift(newTransaction);

    // Perbarui dompet RT
    if (!MalasaState.rtWallets[bin.id]) {
      MalasaState.rtWallets[bin.id] = { balanceIdr: 0, totalOrganicKg: 0, pocHarvestedLiters: 0 };
    }
    MalasaState.rtWallets[bin.id].balanceIdr += netReward;
    MalasaState.rtWallets[bin.id].totalOrganicKg += weight;
    MalasaState.rtWallets[bin.id].pocHarvestedLiters += leachateHarvested;

    // Reset kapasitas tong karena telah dikosongkan petugas
    bin.currentFillPercent = 0.0;
    bin.currentWeightKg = 0.0;
    bin.leachateVolumeLiters = 0.0;
    bin.isContaminated = false;
    bin.lastContaminant = null;
    bin.maggotSafeScore = 95;
    bin.status = "NORMAL";
    bin.lastUpdated = new Date().toLocaleTimeString();

    MalasaState.notify();
    return newTransaction;
  },

  /**
   * Menghitung statistik makro untuk DLH (Dinas Lingkungan Hidup)
   */
  getDLHMacroMetrics() {
    let totalWasteKg = 0;
    let totalGrossValue = 0;
    let totalPlatformRevenue = 0;
    let totalPOCLiters = 0;

    MalasaState.transactions.forEach(t => {
      totalWasteKg += t.weightKg;
      totalGrossValue += t.grossAmount;
      totalPlatformRevenue += t.feeAmount;
      totalPOCLiters += t.leachateLiters;
    });

    // Tambah sampah yang sedang aktif di tong saat ini
    const activeBinWeight = MalasaState.bins.reduce((sum, b) => sum + b.currentWeightKg, 0);
    const activePOC = MalasaState.bins.reduce((sum, b) => sum + b.leachateVolumeLiters, 0);

    const grandTotalWasteKg = totalWasteKg + activeBinWeight;
    const grandTotalPocLiters = totalPOCLiters + activePOC;

    return {
      totalOrganicWasteKg: parseFloat(grandTotalWasteKg.toFixed(2)),
      totalOrganicWasteTons: parseFloat((grandTotalWasteKg / 1000).toFixed(3)),
      methaneGasAvoidedKg: parseFloat((grandTotalWasteKg * 0.42).toFixed(2)), // Faktor emisi metana tereduksi
      totalPOCFertilizerLiters: parseFloat(grandTotalPocLiters.toFixed(1)),
      economicIncentiveDistributedIdr: totalGrossValue - totalPlatformRevenue,
      platformFeeEarnedIdr: totalPlatformRevenue,
      activeBinsCount: MalasaState.bins.length,
      cleanComplianceRatePercent: parseFloat(((MalasaState.bins.filter(b => !b.isContaminated).length / MalasaState.bins.length) * 100).toFixed(1))
    };
  }
};
