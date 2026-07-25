import { ElevationEngine } from './src/elevationEngine.js';

console.log("=== TEST ELEVATION ENGINE ===");

// 1. Sintesi tracciato ideale: Salita costante da 100m a 500m (D+ teorico = 400m), poi discesa a 200m (D- teorico = 300m)
const idealPoints = [];
const numPoints = 100;
for (let i = 0; i <= numPoints; i++) {
  const dist = (i / numPoints) * 50; // 50 km totali
  let ele = 100;
  if (i <= 50) {
    ele = 100 + (i / 50) * 400; // da 100m a 500m
  } else {
    ele = 500 - ((i - 50) / 50) * 300; // da 500m a 200m
  }
  idealPoints.push({ distanceKm: dist, elevationM: ele });
}

// 2. Sintesi tracciato rumoroso: stesso percorso ideale ma con RUMORE GPS casuale (+/- 3m ad ogni punto)
const noisyPoints = idealPoints.map(p => {
  const noise = (Math.sin(p.distanceKm * 10) * 2.5) + (Math.cos(p.distanceKm * 25) * 1.5);
  return {
    distanceKm: p.distanceKm,
    elevationM: p.elevationM + noise
  };
});

// 3. Calcolo dislivello GREZZO (vecchio metodo fitParser)
let rawGain = 0;
for (let i = 1; i < noisyPoints.length; i++) {
  const diff = noisyPoints[i].elevationM - noisyPoints[i - 1].elevationM;
  if (diff > 0) rawGain += diff;
}

// 4. Calcolo dislivello con ElevationEngine (nuovo metodo ad isteresi + smoothing)
const resultIdeal = ElevationEngine.processElevationProfile(idealPoints, { minThresholdM: 2.0, isRawGpx: false });
const resultNoisy = ElevationEngine.processElevationProfile(noisyPoints, { minThresholdM: 2.0, isRawGpx: true });

console.log(`[Tracciato Ideale]  D+ Reale Teorico: 400m | D+ Calcolato: ${resultIdeal.elevationGainM}m`);
console.log(`[Tracciato Rumoroso] D+ Grezzo senza filtro: ${Math.round(rawGain)}m (SOVRASTIMA ENORME)`);
console.log(`[Tracciato Rumoroso] D+ ElevationEngine: ${resultNoisy.elevationGainM}m (FILTRATO ACCURATO)`);
console.log("=============================");
