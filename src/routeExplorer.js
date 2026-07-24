/* ==========================================================================
   BIKEROUTE TRACKER - ROUTE EXPLORER & TECHNICAL SPEC SHEET ENGINE
   ========================================================================== */

import { getInstantCitySuggestions, ITALIAN_CITIES } from './cityData.js';

export class RouteExplorerEngine {
  constructor() {
    this.knownCities = {};
    ITALIAN_CITIES.forEach(c => {
      this.knownCities[c.name.toLowerCase()] = [c.lat, c.lon];
    });
  }

  /**
   * Cerca suggerimenti indirizzo/città istantanei (da 1 carattere in su)
   */
  /**
   * Restituisce immediatamente i suggerimenti locali dalla lista città (0ms sync)
   */
  getInstantSuggestions(query) {
    return getInstantCitySuggestions(query);
  }

  /**
   * Cerca suggerimenti per indirizzi, vie, piazze o città (Komoot Photon + Nominatim + Local)
   */
  async searchAddressSuggestions(query) {
    if (!query || query.trim().length < 1) return [];
    const clean = query.trim();

    // 1. Suggerimenti istantanei locali
    const localMatches = getInstantCitySuggestions(clean);

    // 2. Geocoder Komoot Photon (ottimizzato per strade, numeri civici e punti di interesse ciclismo)
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=6&lang=it`;
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(photonUrl, { signal: controller.signal });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json();
        const photonSuggestions = (data.features || []).map(feat => {
          const props = feat.properties;
          const street = props.name || props.street || '';
          const city = props.city || props.town || props.village || props.county || '';
          const state = props.state || 'Italia';
          const labelParts = [];
          if (street) labelParts.push(street);
          if (city && city !== street) labelParts.push(city);
          if (state) labelParts.push(state);

          const fullLabel = labelParts.join(', ');
          return {
            displayName: fullLabel,
            cityName: street || city || fullLabel,
            lat: feat.geometry.coordinates[1],
            lon: feat.geometry.coordinates[0],
            isStreet: !!props.street || props.type === 'street' || props.osm_value === 'highway'
          };
        });

        // Unisci local + photon con priorità ai match locali esatti/iniziali
        const resultMap = new Map();
        localMatches.forEach(item => resultMap.set(item.displayName.toLowerCase(), item));
        photonSuggestions.forEach(item => {
          const k = item.displayName.toLowerCase();
          if (!resultMap.has(k)) resultMap.set(k, item);
        });

        return Array.from(resultMap.values()).slice(0, 8);
      }
    } catch (err) {
      // Fallback in caso di timeout o errore di rete
    }

    // 3. Fallback Nominatim
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&addressdetails=1&limit=5&countrycodes=it`;
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(nomUrl, { headers: { 'Accept-Language': 'it,en' }, signal: controller.signal });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json();
        const nomSuggestions = (data || []).map(item => ({
          displayName: item.display_name.split(',').slice(0, 3).join(','),
          cityName: item.display_name.split(',')[0],
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          isStreet: item.type === 'highway' || item.class === 'highway'
        }));

        const resultMap = new Map();
        localMatches.forEach(item => resultMap.set(item.displayName.toLowerCase(), item));
        nomSuggestions.forEach(item => {
          const k = item.displayName.toLowerCase();
          if (!resultMap.has(k)) resultMap.set(k, item);
        });
        return Array.from(resultMap.values()).slice(0, 8);
      }
    } catch (err) {
      // Fallback
    }

    return localMatches;
  }

  /**
   * Geocode via, piazza, o città string to [lat, lng] (Precisione a livello di via)
   */
  async geocodeLocation(query) {
    if (!query) return null;
    const cleanQuery = query.trim();

    // 1. Controllo coordinate dirette (es: "41.5956, 12.6525")
    const coordMatch = cleanQuery.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
    }

    // 2. Query Komoot Photon (Ricerca vie, numeri civici, piazze con priorità)
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=1&lang=it`;
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(photonUrl, { signal: controller.signal });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const coords = data.features[0].geometry.coordinates;
          return [coords[1], coords[0]]; // [lat, lng]
        }
      }
    } catch (err) {
      console.warn("Photon geocode fallback:", err);
    }

    // 3. Query OpenStreetMap Nominatim per vie specifiche
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=1`;
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(nomUrl, { headers: { 'Accept-Language': 'it,en' }, signal: controller.signal });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
      }
    } catch (err) {
      console.warn("Nominatim geocode fallback:", err);
    }

    // 4. Controllo SOLO UGUAGLIANZA ESATTA nella lista città locali (Nessun match parziale per non ignorare le vie!)
    const cleanLower = cleanQuery.toLowerCase();
    if (this.knownCities[cleanLower]) {
      return this.knownCities[cleanLower];
    }

    return null;
  }

  /**
   * Genera 5 opzioni stradali reali distinte con supporto a modalità (Solo Andata, A/R, Anello A->A) e sicurezza stradale
   */
  async discoverRoutes(startName, endName, targetKm = 45, explicitStartCoords = null, explicitEndCoords = null, customWaypoints = [], routeMode = 'oneway') {
    let startCoords = explicitStartCoords || await this.geocodeLocation(startName) || [41.5956, 12.6525]; // Aprilia
    let endCoords = (routeMode === 'loop') ? startCoords : (explicitEndCoords || await this.geocodeLocation(endName) || [41.7288, 12.6582]); // Albano

    let directDistKm = this.calculateHaversineDistance(startCoords, endCoords);
    if (routeMode === 'loop') {
      directDistKm = targetKm / 3;
    }

    const midLat = (routeMode === 'loop') ? startCoords[0] + 0.03 : (startCoords[0] + endCoords[0]) / 2;
    const midLng = (routeMode === 'loop') ? startCoords[1] + 0.03 : (startCoords[1] + endCoords[1]) / 2;

    const dLat = (routeMode === 'loop') ? 0.04 : endCoords[0] - startCoords[0];
    const dLng = (routeMode === 'loop') ? 0.04 : endCoords[1] - startCoords[1];

    const kmRatio = Math.max(1.0, targetKm / Math.max(10, directDistKm));
    const offsetScale = Math.min(0.25, 0.04 * kmRatio);

    // Vias per varianti
    const via2 = [midLat + dLng * offsetScale * 0.8 + 0.01, midLng - dLat * offsetScale * 0.8 - 0.01]; 
    const via3 = [midLat - dLng * offsetScale * 1.2 - 0.02, midLng + dLat * offsetScale * 1.2 + 0.02]; 
    const via4 = [midLat + dLng * offsetScale * 1.6 + 0.03, midLng - dLat * offsetScale * 1.6 - 0.02]; 
    const via5 = [midLat - dLng * offsetScale * 2.2 - 0.04, midLng + dLat * offsetScale * 2.2 + 0.04]; 

    // Chiamata OSRM con alternative nativa e waypoints personalizzati
    const [raw1, raw2, raw3, raw4, raw5] = await Promise.all([
      this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : null, true),
      this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via2]),
      this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via3]),
      this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via4]),
      this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via5])
    ]);

    // Estrarre eventuali rotte alternative ritornate nativamente da OSRM (raw1.alternatives)
    const alt1 = (raw1 && raw1.alternatives && raw1.alternatives[0]) ? raw1.alternatives[0] : null;
    const alt2 = (raw1 && raw1.alternatives && raw1.alternatives[1]) ? raw1.alternatives[1] : null;

    const route1Raw = raw1;
    const route2Raw = alt1 || raw2 || raw1;
    const route3Raw = alt2 || raw3 || raw1;
    const route4Raw = raw4 || raw1;
    const route5Raw = raw5 || raw1;

    // Palette colori ad alto contrasto per i tracciati
    const routes = await Promise.all([
      this.buildRouteObject('opt-1', 'Arteria Principale Diretta (OSRM)', '#0ea5e9', route1Raw, startCoords, endCoords, 'Strada Principale', routeMode),
      this.buildRouteObject('opt-2', 'Variante Secondaria Vicinale', '#10b981', route2Raw, startCoords, endCoords, 'Strade Vicinali', routeMode),
      this.buildRouteObject('opt-3', 'Percorso Collinare & Salite', '#a855f7', route3Raw, startCoords, endCoords, 'Salita & Tornanti', routeMode),
      this.buildRouteObject('opt-4', 'Tracciato Panoramico Esterno', '#f59e0b', route4Raw, startCoords, endCoords, 'Provinciali Panoramiche', routeMode),
      this.buildRouteObject('opt-5', 'Giro Esteso Fondo Pro', '#f43f5e', route5Raw, startCoords, endCoords, 'Percorso Lungo', routeMode)
    ]);

    return routes;
  }

  /**
   * Analizza i nomi delle strade e assegna un livello di warning per la sicurezza ciclistica
   */
  analyzeRoadSafety(streetNames = []) {
    if (!streetNames || streetNames.length === 0) {
      return {
        level: 'safe',
        badgeText: 'Tracciato Basso Traffico / Vicinale',
        badgeClass: 'badge-low-traffic',
        iconClass: 'fa-shield-halved'
      };
    }

    const fullText = streetNames.join(' ').toLowerCase();

    // Scansione per Strade Statali, Superstrade, Tangenziali, Pontina, SS
    const dangerRegex = /\b(ss\d*|ss\s*\d+|pontina|superstrada|tangenziale|autostrada|statale|nazionale)\b/i;
    const warningRegex = /\b(sp\d*|sp\s*\d+|provinciale|strada regionale|sr\d*)\b/i;

    if (dangerRegex.test(fullText)) {
      return {
        level: 'danger',
        badgeText: 'Attenzione: Strada Statale / Traffico Veloce',
        badgeClass: 'badge-high-traffic',
        iconClass: 'fa-triangle-exclamation'
      };
    }

    if (warningRegex.test(fullText)) {
      return {
        level: 'warning',
        badgeText: 'Strada Provinciale',
        badgeClass: 'badge-med-traffic',
        iconClass: 'fa-circle-info'
      };
    }

    return {
      level: 'safe',
      badgeText: 'Tracciato Basso Traffico / Vicinale',
      badgeClass: 'badge-low-traffic',
      iconClass: 'fa-shield-halved'
    };
  }

  async buildRouteObject(id, name, color, rawOsrm, startCoords, endCoords, categoryTag, routeMode = 'oneway') {
    let coords = [];
    let distanceKm = 0;
    let streetSummary = "Strade provinciali e vicinali";
    let rawStreetNames = [];

    if (rawOsrm && rawOsrm.coords && rawOsrm.coords.length > 1) {
      coords = rawOsrm.coords;
      distanceKm = parseFloat((rawOsrm.distanceMeters / 1000).toFixed(1));
      rawStreetNames = rawOsrm.streetNames || [];
      if (rawStreetNames.length > 0) {
        streetSummary = rawStreetNames.slice(0, 4).join(' → ');
      }
    } else {
      coords = this.generateFallbackPath(startCoords, endCoords, id);
      distanceKm = parseFloat((this.calculateHaversineDistance(startCoords, endCoords) * 1.3).toFixed(1));
    }

    // Gestione Andata e Ritorno
    if (routeMode === 'roundtrip' && coords.length > 1) {
      const reversedCoords = coords.slice().reverse();
      coords = [...coords, ...reversedCoords];
      distanceKm = parseFloat((distanceKm * 2).toFixed(1));
    }

    const roadSafety = this.analyzeRoadSafety(rawStreetNames);

    const { elevationProfile, elevationGainM, elevationLossM, maxGradePercent, avgGradePercent } =
      await this.fetchElevationProfile(coords, distanceKm);

    const speed20 = this.formatDuration(distanceKm / 20);
    const speed25 = this.formatDuration(distanceKm / 25);
    const speed30 = this.formatDuration(distanceKm / 30);

    let difficulty = 'Pianeggiante';
    if (elevationGainM > 550 || maxGradePercent > 8.0) {
      difficulty = 'Impegnativo / Salita';
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
      roadSafety,
      routeMode,
      timeEstimates: { speed20, speed25, speed30 },
      coords,
      elevationProfile,
      startCoords,
      endCoords
    };
  }

  /**
   * Esegue la chiamata all'API OSRM supportando alternative e waypoints multipli
   */
  async fetchOSRMRoute(startCoords, endCoords, viaCoordsList = null, requestAlternatives = false) {
    let waypoints = [startCoords];
    if (Array.isArray(viaCoordsList)) {
      waypoints.push(...viaCoordsList);
    }
    waypoints.push(endCoords);

    const waypointsStr = waypoints.map(pt => `${pt[1]},${pt[0]}`).join(';');
    const altParam = requestAlternatives ? '&alternatives=3' : '';

    // Multiple public routing endpoints (OpenStreetMap Germany Bike & Standard OSRM Driving)
    const endpoints = [
      `https://routing.openstreetmap.de/routed-bike/route/v1/biking/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}`,
      `https://router.project-osrm.org/route/v1/driving/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}`,
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}`
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const primary = data.routes[0];
            const primaryResult = {
              distanceMeters: primary.distance,
              durationSeconds: primary.duration,
              coords: primary.geometry.coordinates.map(coord => [coord[1], coord[0]]),
              streetNames: this.extractStreetNames(primary.legs),
              alternatives: []
            };

            if (data.routes.length > 1) {
              for (let i = 1; i < data.routes.length; i++) {
                const altRoute = data.routes[i];
                primaryResult.alternatives.push({
                  distanceMeters: altRoute.distance,
                  durationSeconds: altRoute.duration,
                  coords: altRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]),
                  streetNames: this.extractStreetNames(altRoute.legs)
                });
              }
            }

            return primaryResult;
          }
        }
      } catch (err) {
        console.warn("Attempted OSRM endpoint failed:", url, err.message);
      }
    }

    return null;
  }

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

  async fetchElevationProfile(coords, totalDistanceKm) {
    const defaultRes = {
      elevationProfile: this.generateEstimatedElevationProfile(totalDistanceKm, 160),
      elevationGainM: 160,
      elevationLossM: 155,
      maxGradePercent: 4.8,
      avgGradePercent: 1.5
    };

    if (!coords || coords.length < 2) return defaultRes;

    const sampleSize = Math.min(30, coords.length);
    const sampledCoords = [];
    const stepIndex = (coords.length - 1) / (sampleSize - 1);

    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.round(i * stepIndex);
      sampledCoords.push(coords[idx]);
    }

    const lats = sampledCoords.map(c => c[0].toFixed(4)).join(',');
    const lons = sampledCoords.map(c => c[1].toFixed(4)).join(',');

    try {
      const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
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
            elevationGainM: gainM || 140,
            elevationLossM: lossM || 135,
            maxGradePercent: Math.min(18, Math.max(1.5, maxGrade)),
            avgGradePercent: avgGrade
          };
        }
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
      const eleM = Math.round(140 + Math.sin(i / 5) * 45 + (i / steps) * (totalDPlus * 0.5));
      profile.push({ distanceKm: distKm, elevationM: eleM });
    }
    return profile;
  }

  generateFallbackPath(start, end, style) {
    const points = [];
    const steps = 45;
    
    let devLat = 0.015;
    let devLng = -0.015;
    if (style === 'opt-2') { devLat = 0.035; devLng = -0.035; }
    if (style === 'opt-3') { devLat = -0.045; devLng = 0.045; }
    if (style === 'opt-4') { devLat = 0.06; devLng = -0.06; }
    if (style === 'opt-5') { devLat = -0.075; devLng = 0.075; }

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Interpolazione curva bezier per creare forma stradale realistica
      const wave = Math.sin(t * Math.PI * 2) * 0.005;
      const mainCurve = Math.sin(t * Math.PI) * devLat;
      const sideCurve = Math.sin(t * Math.PI * 1.5) * devLng;

      const lat = (1 - t) * start[0] + t * end[0] + mainCurve + wave;
      const lng = (1 - t) * start[1] + t * end[1] + sideCurve - wave;
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
