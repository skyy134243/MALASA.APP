/**
 * ==============================================================================
 * MALASA.APP - PREDICTIVE ANALYTICS ENGINE (TIME-SERIES FORECASTING)
 * Memprediksi laju kepenuhan tong komunal berdasarkan data time-series
 * Output: "Estimasi Tong X akan penuh dalam 3.2 jam ke depan"
 * ==============================================================================
 */

const PredictiveEngine = {
  CRITICAL_FILL_THRESHOLD: 70.0, // 70% kapasitas drum 120L
  CRITICAL_WEIGHT_THRESHOLD: 5.0, // 5 kg ambang batas penjemputan

  /**
   * Menghitung estimasi sisa waktu hingga tong penuh
   * @param {Object} bin Objek tong komunal
   * @returns {Object} { hoursRemaining, formattedEstimate, alertLevel, recommendation }
   */
  forecastBinFullness(bin) {
    const currentFill = bin.currentFillPercent;
    const currentWeight = bin.currentWeightKg;
    const rate = bin.fillRatePerHour || 1.5; // default 1.5% per jam

    // Kasus 1: Tong sudah melebihi ambang batas kritis
    if (currentFill >= this.CRITICAL_FILL_THRESHOLD || currentWeight >= this.CRITICAL_WEIGHT_THRESHOLD) {
      return {
        hoursRemaining: 0,
        formattedEstimate: "SEGERA PENUH / MELEBIHI KAPASITAS (0 Jam)",
        alertLevel: "CRITICAL",
        recommendation: "Prioritas Utama Penjemputan Armada Pembudidaya",
        urgencyColor: "danger"
      };
    }

    // Kasus 2: Menghitung sisa jam menuju ambang batas 70%
    const remainingPercent = this.CRITICAL_FILL_THRESHOLD - currentFill;
    const hours = remainingPercent / rate;
    const roundedHours = parseFloat(hours.toFixed(1));

    let alertLevel = "NORMAL";
    let urgencyColor = "success";
    let recommendation = "Kapasitas aman. Tidak memerlukan aksi penjemputan saat ini.";

    if (roundedHours <= 4.0) {
      alertLevel = "HIGH_ALERT";
      urgencyColor = "warning";
      recommendation = `Tong diperkirakan penuh dalam ${roundedHours} jam. Masukkan ke rute logistik armada hari ini.`;
    } else if (roundedHours <= 8.0) {
      alertLevel = "MODERATE";
      urgencyColor = "info";
      recommendation = `Tong diperkirakan penuh nanti sore/malam (${roundedHours} jam lagi).`;
    }

    return {
      hoursRemaining: roundedHours,
      formattedEstimate: `Estimasi penuh dalam ${roundedHours} jam ke depan`,
      alertLevel,
      recommendation,
      urgencyColor
    };
  },

  /**
   * Memproses seluruh tong dan menghasilkan ringkasan intelijen prediktif
   */
  generateEcosystemForecast() {
    return MalasaState.bins.map(bin => {
      const forecast = this.forecastBinFullness(bin);
      return {
        binId: bin.id,
        binName: bin.name,
        location: bin.location,
        currentFill: bin.currentFillPercent,
        currentWeight: bin.currentWeightKg,
        ratePerHour: bin.fillRatePerHour,
        hoursRemaining: forecast.hoursRemaining,
        message: forecast.formattedEstimate,
        alertLevel: forecast.alertLevel,
        urgencyColor: forecast.urgencyColor,
        recommendation: forecast.recommendation
      };
    }).sort((a, b) => a.hoursRemaining - b.hoursRemaining);
  }
};
