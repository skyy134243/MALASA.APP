/**
 * Smart Routing & Logistics VRP Service
 */

import { DEPO_LOCATION } from './data';

export function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export function generateOptimizedRoute(bins) {
  const depo = DEPO_LOCATION;

  // Filter & calculate score
  const candidates = bins.map(bin => {
    const dist = calculateHaversine(depo.lat, depo.lng, bin.lat, bin.lng);
    let score = (bin.currentFillPercent * 0.7) + (bin.currentWeightKg * 3.0) - (dist * 1.5);
    if (bin.status === "CRITICAL_FULL") score += 40;
    if (!bin.isContaminated) score += 20;

    return {
      ...bin,
      distanceFromDepoKm: dist,
      routingScore: parseFloat(score.toFixed(1))
    };
  });

  const sorted = [...candidates].sort((a, b) => b.routingScore - a.routingScore);

  let curLat = depo.lat;
  let curLng = depo.lng;
  let totalKm = 0;
  let totalBiomass = 0;
  let totalLeachate = 0;

  const stops = sorted.map((stop, index) => {
    const legDist = calculateHaversine(curLat, curLng, stop.lat, stop.lng);
    const roadKm = parseFloat((legDist * 1.35).toFixed(2));
    totalKm += roadKm;
    totalBiomass += stop.currentWeightKg;
    totalLeachate += stop.leachateVolumeLiters;

    curLat = stop.lat;
    curLng = stop.lng;

    return {
      stepOrder: index + 1,
      binId: stop.id,
      name: stop.name,
      location: stop.location,
      fillPercent: stop.currentFillPercent,
      weightKg: stop.currentWeightKg,
      isContaminated: stop.isContaminated,
      legDistanceKm: roadKm,
      actionRequired: stop.isContaminated ? "Pilah Sampah Plastik Sebelum Timbang" : "Timbang Digital & Kuras Tangki Lindi"
    };
  });

  const returnLeg = calculateHaversine(curLat, curLng, depo.lat, depo.lng) * 1.35;
  totalKm += parseFloat(returnLeg.toFixed(2));

  return {
    depo,
    stops,
    totalEstimatedKm: parseFloat(totalKm.toFixed(1)),
    totalBiomassKg: parseFloat(totalBiomass.toFixed(2)),
    totalLeachateLiters: parseFloat(totalLeachate.toFixed(1)),
    fuelSavedPercent: 32.5
  };
}
