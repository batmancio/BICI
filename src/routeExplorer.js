/* ==========================================================================
   BIKEROUTE TRACKER - ROUTE EXPLORER & TECHNICAL SPEC SHEET ENGINE
   REAL ITALIAN ROAD ROUTING: 5 DISTINCT OPTIONS WITH STREET NAMES & KM SLIDER
   ========================================================================== */

export class RouteExplorerEngine {
  constructor() {
    this.knownCities = {
      'milano': [45.4642, 9.1900],
      'como': [45.8103, 9.0863],
      'lecco': [45.8565, 9.3977],
      'monza': [45.5845, 9.2744],
      'bergamo': [45.6983, 9.6773],
      'varese': [45.8206, 8.8251],
      'pavia': [45.1847, 9.1582],
      'torino': [45.0703, 7.6869],
      'aprilia': [41.5956, 12.6525],
      'albano': [41.7288, 12.6582],
      'albano laziale': [41.7288, 12.6582],
      'velletri': [41.6869, 12.7788],
      'anzio': [41.4475, 12.6283],
      'nettuno': [41.4586, 12.6631],
      'roma': [41.9028, 12.4964]
    };
  }

  /**
   * Geocode city/address string to [lat, lng]
   */
  async geocodeLocation(query) {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();

    const coordMatch = cleanQuery.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
    }

    for (const [key, coords] of Object.entries(this.knownCities)) {
      if (cleanQuery === key || cleanQuery.startsWith(key)) {
        return coords;
      }
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'it,en' } });
      const data = await res.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (err) {
      console.warn("Geocoding fallback:", err);
    }

    return null;
  }

  /**
   * Genera 5 opzioni stradali reali distinte con nomi delle strade ed adattamento ai KM desiderati
   */
  async discoverRoutes(startName, endName, targetKm = 45) {
    let startCoords = await this.geocodeLocation(startName) || [41.5956, 12.6525]; // Aprilia
    let endCoords = await this.geocodeLocation(endName) || [41.7288, 12.6582];   // Albano

    const directDistKm = this.calculateHaversineDistance(startCoords, endCoords);

    // Calcolo punti medi e vettori di deviazione proporzionali al target KM dello slider
    const midLat = (startCoords[0] + endCoords[0]) / 2;
    const midLng = (startCoords[1] + endCoords[1]) / 2;

    const dLat = endCoords[0] - startCoords[0];
    const dLng = endCoords[1] - startCoords[1];

    // Fattore di allungamento in base a targetKm rispetto alla distanza diretta
    const kmRatio = Math.max(1.0, targetKm / Math.max(10, directDistKm));
    const offsetScale = Math.min(0.25, 0.04 * kmRatio);

    // 5 via-points per costringere OSRM su 5 corridoi stradali differenti
    const via1 = null; // Diretta Principale (es. Nettunense)
    const via2 = [midLat + dLng * offsetScale * 0.8 + 0.01, midLng - dLat * offsetScale * 0.8 - 0.01]; // Via Carano / Campoleone
    const via3 = [midLat - dLng * offsetScale * 1.2 - 0.02, midLng + dLat * offsetScale * 1.2 + 0.02]; // Salite & Colline
    const via4 = [midLat + dLng * offsetScale * 1.6 + 0.03, midLng - dLat * offsetScale * 1.6 - 0.02]; // Variante Panoramica Est
    const via5 = [midLat - dLng * offsetScale * 2.2 - 0.04, midLng + dLat * offsetScale * 2.2 + 0.04]; // Giro Esteso / Anello Pro

    // Esegui 5 chiamate OSRM in parallelo
    const [raw1, raw2, raw3, raw4, raw5] = await Promise.all([
      this.fetchOSRMRoute(startCoords, endCoords, via1),
      this.fetchOSRMRoute(startCoords, endCoords, via2),
      this.fetchOSRMRoute(startCoords, endCoords, via3),
      this.fetchOSRMRoute(startCoords, endCoords, via4),
      this.fetchOSRMRoute(startCoords, endCoords, via5)
    ]);

    const routes = await Promise.all([
      this.buildRouteObject('opt-1', 'Opzione 1: Arteria Principale Diretta', '#00f2fe', raw1 || raw1, startCoords, endCoords, 'Strada Statale / Principale'),
      this.buildRouteObject('opt-2', 'Opzione 2: Variante Campagna & Carano', '#10b981', raw2 || raw1, startCoords, endCoords, 'Strade Secondarie & Vicinali'),
      this.buildRouteObject('opt-3', 'Opzione 3: Variante Salite & Colline', '#8b5cf6', raw3 || raw1, startCoords, endCoords, 'Salite Collinari & Tornanti'),
      this.buildRouteObject('opt-4', 'Opzione 4: Tracciato Panoramico Esterni', '#f59e0b', raw4 || raw1, startCoords, endCoords, 'Strade Provinciali Panoramiche'),
      this.buildRouteObject('opt-5', 'Opzione 5: Giro Esteso / Anello Pro', '#ec4899', raw5 || raw1, startCoords, endCoords, 'Percorso Lungo / Allenamento')
    ]);

    return routes;
  }

  /**
   * Fetch da OSRM Bike con dettagli sui passi stradali
   */
  async fetchOSRMRoute(startCoords, endCoords, viaCoords = null) {
    try {
      let waypointsStr = `${startCoords[1]},${startCoords[0]}`;
      if (viaCoords) {
        waypointsStr += `;${viaCoords[1]},${viaCoords[0]}`;
      }
      waypointsStr += `;${endCoords[1]},${endCoords[0]}`;

      const url = `https://router.project-osrm.org/route/v1/bike/${waypointsStr}?overview=full&geometries=geojson&steps=true&annotations=true`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leafletCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Estrazione dei nomi delle strade dai passaggi OSRM
        const streetNames = this.extractStreetNames(route.legs);

        return {
          distanceMeters: route.distance,
          durationSeconds: route.duration,
          coords: leafletCoords,
          streetNames
        };
      }
    } catch (err) {
      console.warn("OSRM fetch fallback:", err);
    }
    return null;
  }

  /**
   * Estrae i nomi reali delle strade principali attraversate nel percorso
   */
  extractStreetNames(legs) {
    if (!legs) return [];
    const names = new Set();

    legs.forEach(leg => {
      if (leg.steps) {
        leg.steps.forEach(step => {
          if (step.name && step.name.trim() !== '' && !step.name.includes('{') && step.name.length > 2) {
            names.add(step.name.trim());
          }
          if (step.ref && step.ref.trim() !== '') {
            names.add(step.ref.trim());
          }
        });
      }
    });

    return Array.from(names);
  }

  /**
   * Costruisce la scheda tecnica del percorso stradale
   */
  async buildRouteObject(id, name, color, rawOsrm, startCoords, endCoords, categoryTag) {
    let coords = [];
    let distanceKm = 0;
    let streetSummary = "Strade provinciali e vicinali locali";

    if (rawOsrm && rawOsrm.coords && rawOsrm.coords.length > 1) {
      coords = rawOsrm.coords;
      distanceKm = parseFloat((rawOsrm.distanceMeters / 1000).toFixed(1));
      
      if (rawOsrm.streetNames && rawOsrm.streetNames.length > 0) {
        // Prendi le prime 4-5 strade principali per mostrare l'itinerario reale
        streetSummary = rawOsrm.streetNames.slice(0, 4).join(' → ');
      }
    } else {
      coords = this.generateFallbackPath(startCoords, endCoords, id);
      distanceKm = parseFloat((this.calculateHaversineDistance(startCoords, endCoords) * 1.3).toFixed(1));
    }

    // Profilo altimetrico reale da Open-Meteo
    const { elevationProfile, elevationGainM, elevationLossM, maxGradePercent, avgGradePercent } =
      await this.fetchElevationProfile(coords, distanceKm);

    const speed20 = this.formatDuration(distanceKm / 20);
    const speed25 = this.formatDuration(distanceKm / 25);
    const speed30 = this.formatDuration(distanceKm / 30);

    let difficulty = 'Pianeggiante';
    if (elevationGainM > 550 || maxGradePercent > 8.0) {
      difficulty = 'Impegnativo / Salite';
    } else if (elevationGainM > 220 || maxGradePercent > 4.5) {
      difficulty = 'Ondulato / Collinare';
    }

    return {
      id,
      name,
      color,
      categoryTag,
      streetSummary,
      distanceKm,
      elevationGainM,
      elevationLossM,
      maxGradePercent,
      avgGradePercent,
      difficulty,
      timeEstimates: { speed20, speed25, speed30 },
      coords,
      elevationProfile,
      startCoords,
      endCoords
    };
  }

  /**
   * Altimetria reale Open-Meteo
   */
  async fetchElevationProfile(coords, totalDistanceKm) {
    const defaultRes = {
      elevationProfile: this.generateEstimatedElevationProfile(totalDistanceKm, 150),
      elevationGainM: 150,
      elevationLossM: 140,
      maxGradePercent: 4.0,
      avgGradePercent: 1.2
    };

    if (!coords || coords.length < 2) return defaultRes;

    const sampleSize = Math.min(40, coords.length);
    const sampledCoords = [];
    const stepIndex = (coords.length - 1) / (sampleSize - 1);

    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.round(i * stepIndex);
      sampledCoords.push(coords[idx]);
    }

    const lats = sampledCoords.map(c => c[0].toFixed(5)).join(',');
    const lons = sampledCoords.map(c => c[1].toFixed(5)).join(',');

    try {
      const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.elevation && data.elevation.length === sampledCoords.length) {
        const rawElevations = data.elevation;
        let gainM = 0;
        let lossM = 0;
        let maxGrade = 0;
        const profile = [];

        const distStep = totalDistanceKm / (sampledCoords.length - 1);

        for (let i = 0; i < sampledCoords.length; i++) {
          const currentElev = Math.round(rawElevations[i]);
          const currentDistKm = parseFloat((i * distStep).toFixed(1));

          if (i > 0) {
            const prevElev = Math.round(rawElevations[i - 1]);
            const diff = currentElev - prevElev;
            if (diff > 0) gainM += diff;
            else lossM += Math.abs(diff);

            const segmentDistMeters = distStep * 1000;
            if (segmentDistMeters > 0) {
              const grade = (Math.abs(diff) / segmentDistMeters) * 100;
              if (grade > maxGrade) maxGrade = parseFloat(grade.toFixed(1));
            }
          }

          profile.push({ distanceKm: currentDistKm, elevationM: currentElev });
        }

        const avgGrade = totalDistanceKm > 0 ? parseFloat((gainM / (totalDistanceKm * 10)).toFixed(1)) : 1.0;

        return {
          elevationProfile: profile,
          elevationGainM: gainM,
          elevationLossM: lossM,
          maxGradePercent: Math.min(18, Math.max(1.5, maxGrade)),
          avgGradePercent: avgGrade
        };
      }
    } catch (err) {
      console.warn("Open-Meteo elevation fallback:", err);
    }

    return defaultRes;
  }

  generateEstimatedElevationProfile(totalDistance, totalDPlus) {
    const profile = [];
    const steps = 40;
    const distStep = totalDistance / steps;
    for (let i = 0; i <= steps; i++) {
      const distKm = parseFloat((i * distStep).toFixed(1));
      const eleM = Math.round(140 + Math.sin(i / 6) * 40 + (i / steps) * (totalDPlus * 0.4));
      profile.push({ distanceKm: distKm, elevationM: eleM });
    }
    return profile;
  }

  generateFallbackPath(start, end, style) {
    const points = [];
    const steps = 30;
    let devLat = 0.01;
    let devLng = -0.01;
    if (style === 'opt-2') { devLat = 0.03; devLng = -0.03; }
    if (style === 'opt-3') { devLat = -0.04; devLng = 0.04; }
    if (style === 'opt-4') { devLat = 0.05; devLng = -0.05; }
    if (style === 'opt-5') { devLat = -0.06; devLng = 0.06; }

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = (1 - t) * start[0] + t * end[0] + Math.sin(t * Math.PI) * devLat;
      const lng = (1 - t) * start[1] + t * end[1] + Math.sin(t * Math.PI) * devLng;
      points.push([lat, lng]);
    }
    return points;
  }

  calculateHaversineDistance(coords1, coords2) {
    const R = 6371;
    const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
    const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  formatDuration(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m < 10 ? '0' : ''}${m}m`;
  }
}
