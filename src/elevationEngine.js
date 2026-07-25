/* ==========================================================================
   BIKEROUTE TRACKER - UNIFIED ELEVATION ENGINE
   Algoritmo avanzato di profilatura altimetrica, smoothing e calcolo D+
   con soglia ad isteresi (Deadband Filter) basato su benchmark Strava/GIS
   ========================================================================== */

export class ElevationEngine {
  /**
   * Calcola dislivello positivo, negativo, profilo altimetrico e pendenze
   * @param {Array<{elevationM: number, distanceKm: number}>} points - Array di punti con altitudine e distanza
   * @param {Object} options - Opzioni di configurazione (minThresholdM, smoothingWindow)
   */
  static processElevationProfile(points, options = {}) {
    if (!points || points.length === 0) {
      return {
        elevationGainM: 0,
        elevationLossM: 0,
        maxElevationM: 0,
        minElevationM: 0,
        maxGradePercent: 0,
        avgGradePercent: 0,
        elevationProfile: []
      };
    }

    const {
      minThresholdM = 2.0,       // Soglia minima di isteresi in metri (Strava standard ~2m-3m)
      smoothingPasses = 2,       // Numero di passaggi di smoothing gaussiano/pesato
      isRawGpx = false           // Se true, applica un filtro più aggressivo contro il rumore GPS
    } = options;

    // 1. Estrazione quote grezze e rimozione outlier evidenti
    const rawElevations = points.map(p => typeof p.elevationM === 'number' && !isNaN(p.elevationM) ? p.elevationM : 0);
    const cleanedElevations = this.cleanOutliers(rawElevations);

    // 2. Applicazione dello Smoothing (Filtro passa-basso pesato 5-point binomial kernel)
    let smoothed = [...cleanedElevations];
    const passes = isRawGpx ? smoothingPasses + 1 : smoothingPasses;
    for (let p = 0; p < passes; p++) {
      smoothed = this.applyFivePointSmoothing(smoothed);
    }

    // 3. Calcolo Dislivello Positivo e Negativo con Soglia ad Isteresi (Deadband / Peak-Valley)
    const effectiveThreshold = isRawGpx ? Math.max(minThresholdM, 2.5) : minThresholdM;
    let gainM = 0;
    let lossM = 0;

    if (smoothed.length > 1) {
      let lastTurnEle = smoothed[0];
      let currentDirection = 0; // 0 = piano, +1 = salita, -1 = discesa

      for (let i = 1; i < smoothed.length; i++) {
        const ele = smoothed[i];
        const deltaFromTurn = ele - lastTurnEle;

        if (currentDirection === 0) {
          if (deltaFromTurn >= effectiveThreshold) {
            gainM += deltaFromTurn;
            lastTurnEle = ele;
            currentDirection = 1;
          } else if (deltaFromTurn <= -effectiveThreshold) {
            lossM += Math.abs(deltaFromTurn);
            lastTurnEle = ele;
            currentDirection = -1;
          }
        } else if (currentDirection === 1) {
          if (ele > lastTurnEle) {
            // Continua la salita
            gainM += (ele - lastTurnEle);
            lastTurnEle = ele;
          } else if (deltaFromTurn <= -effectiveThreshold) {
            // Inversione di marcia confermata -> Inizia la discesa
            lossM += Math.abs(deltaFromTurn);
            lastTurnEle = ele;
            currentDirection = -1;
          }
        } else if (currentDirection === -1) {
          if (ele < lastTurnEle) {
            // Continua la discesa
            lossM += Math.abs(lastTurnEle - ele);
            lastTurnEle = ele;
          } else if (deltaFromTurn >= effectiveThreshold) {
            // Inversione di marcia confermata -> Inizia la salita
            gainM += deltaFromTurn;
            lastTurnEle = ele;
            currentDirection = 1;
          }
        }
      }
    }

    // 4. Costruzione del profilo finale e calcolo pendenze (%)
    let maxElev = -Infinity;
    let minElev = Infinity;
    let maxGrade = 0;
    const profile = [];

    for (let i = 0; i < points.length; i++) {
      const ele = Math.round(smoothed[i]);
      const distKm = parseFloat((points[i].distanceKm || 0).toFixed(1));

      if (ele > maxElev) maxElev = ele;
      if (ele < minElev) minElev = ele;

      let slopeGrade = 0;
      if (i > 0) {
        const prevEle = smoothed[i - 1];
        const prevDistKm = points[i - 1].distanceKm || 0;
        const distMeters = (distKm - prevDistKm) * 1000;

        if (distMeters > 5) { // Evita divisioni per distanze quasi nulle tra trackpoint vicini
          const eleDiff = smoothed[i] - prevEle;
          slopeGrade = parseFloat(((eleDiff / distMeters) * 100).toFixed(1));
          // Limitiamo la pendenza istantanea a valori fisicamente realistici per il ciclismo (-30% / +30%)
          if (Math.abs(slopeGrade) > 30) {
            slopeGrade = slopeGrade > 0 ? 30 : -30;
          }
          if (Math.abs(slopeGrade) > maxGrade) {
            maxGrade = Math.abs(slopeGrade);
          }
        }
      }

      profile.push({
        distanceKm: distKm,
        elevationM: ele,
        slopeGrade: slopeGrade
      });
    }

    const totalDistKm = points[points.length - 1]?.distanceKm || 0;
    const avgGrade = totalDistKm > 0 ? parseFloat((gainM / (totalDistKm * 10)).toFixed(1)) : 0;

    return {
      elevationGainM: Math.round(gainM),
      elevationLossM: Math.round(lossM),
      maxElevationM: maxElev === -Infinity ? 0 : maxElev,
      minElevationM: minElev === Infinity ? 0 : minElev,
      maxGradePercent: parseFloat(maxGrade.toFixed(1)),
      avgGradePercent: avgGrade,
      elevationProfile: profile
    };
  }

  /**
   * Rimuove outlier e saltelli impropri nei dati di altitudine (spikes GPS)
   */
  static cleanOutliers(elevations) {
    if (elevations.length < 3) return [...elevations];
    const cleaned = [...elevations];

    for (let i = 1; i < cleaned.length - 1; i++) {
      const prev = cleaned[i - 1];
      const curr = cleaned[i];
      const next = cleaned[i + 1];

      // Se il punto corrente differisce da entrambi i vicini di oltre 40m (spike spuro)
      if (Math.abs(curr - prev) > 40 && Math.abs(curr - next) > 40) {
        cleaned[i] = (prev + next) / 2;
      }
    }

    return cleaned;
  }

  /**
   * Filtro passa-basso pesato a 5 punti con kernel [1/16, 4/16, 6/16, 4/16, 1/16]
   */
  static applyFivePointSmoothing(arr) {
    const len = arr.length;
    if (len < 5) return arr;

    const result = new Array(len);
    // Trattamento bordi
    result[0] = arr[0];
    result[1] = (arr[0] * 2 + arr[1] * 2 + arr[2]) / 5;
    result[len - 2] = (arr[len - 3] + arr[len - 2] * 2 + arr[len - 1] * 2) / 5;
    result[len - 1] = arr[len - 1];

    for (let i = 2; i < len - 2; i++) {
      result[i] = (arr[i - 2] + arr[i - 1] * 4 + arr[i] * 6 + arr[i + 1] * 4 + arr[i + 2]) / 16;
    }

    return result;
  }
}
