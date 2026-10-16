/**
 * Predictive Analytics & Fill Forecasting Service
 */

export function calculateForecast(bin) {
  const CRITICAL_FILL = 70.0;
  const CRITICAL_WEIGHT = 5.0;

  if (bin.currentFillPercent >= CRITICAL_FILL || bin.currentWeightKg >= CRITICAL_WEIGHT) {
    return {
      hoursRemaining: 0,
      formattedEstimate: "SEGERA PENUH / MELEBIHI KAPASITAS (0 Jam)",
      alertLevel: "CRITICAL",
      urgencyColor: "danger",
      recommendation: "Prioritas Utama Penjemputan Armada Pembudidaya"
    };
  }

  const rate = bin.fillRatePerHour || 1.5;
  const remaining = CRITICAL_FILL - bin.currentFillPercent;
  const hours = parseFloat((remaining / rate).toFixed(1));

  let alertLevel = "NORMAL";
  let urgencyColor = "success";
  let recommendation = "Kapasitas aman. Belum butuh penjemputan segera.";

  if (hours <= 4.0) {
    alertLevel = "HIGH_ALERT";
    urgencyColor = "warning";
    recommendation = `Tong diproyeksikan penuh dalam ${hours} jam. Masukkan ke dispatch order hari ini.`;
  } else if (hours <= 8.0) {
    alertLevel = "MODERATE";
    urgencyColor = "info";
    recommendation = `Tong diproyeksikan penuh sore/malam ini (${hours} jam lagi).`;
  }

  return {
    hoursRemaining: hours,
    formattedEstimate: `Estimasi penuh dalam ${hours} jam ke depan`,
    alertLevel,
    urgencyColor,
    recommendation
  };
}
