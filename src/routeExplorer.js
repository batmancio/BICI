/* ==========================================================================
   BIKEROUTE TRACKER - ROUTE EXPLORER & TECHNICAL SPEC SHEET ENGINE
   ========================================================================== */

export class RouteExplorerEngine {
  constructor() {
    this.defaultOrigin = [45.4642, 9.1900]; // Milano
    this.defaultDestination = [45.8103, 9.0863]; // Como
  }

  async discoverRoutes(startName, endName, preferences) {
    const routes = [
      {
        id: 'route-quiet',
        name: 'Variante 1: Panoramica & Basso Traffico',
        color: '#10b981',
        trafficLevel: 'low',
        trafficBadge: 'Traffico Basso (Ciclabili & Strade Vicinali)',
        badgeClass: 'badge-low-traffic',
        distanceKm: 48.5,
        elevationGainM: 320,
        elevationLossM: 280,
        maxGradePercent: 6.5,
        avgGradePercent: 1.8,
        difficulty: 'Intermedio',
        surface: {
          asphaltPercent: 75,
          gravelPercent: 10,
          cyclewayPercent: 15
        },
        roadTypes: {
          secondary: 65,
          cycleway: 25,
          provincial: 10
        },
        timeEstimates: {
          speed20: '2h 25m',
          speed25: '1h 56m',
          speed30: '1h 37m'
        },
        coords: this.generatePathCoordinates(this.defaultOrigin, this.defaultDestination, 'quiet'),
        elevationProfile: this.generateElevationProfile(48.5, 320, 'quiet')
      },
      {
        id: 'route-flat',
        name: 'Variante 2: Diretta Pianeggiante',
        color: '#00f2fe',
        trafficLevel: 'medium',
        trafficBadge: 'Traffico Medio (Strade Secondarie)',
        badgeClass: 'badge-med-traffic',
        distanceKm: 44.2,
        elevationGainM: 140,
        elevationLossM: 110,
        maxGradePercent: 3.2,
        avgGradePercent: 0.9,
        difficulty: 'Principiante',
        surface: {
          asphaltPercent: 95,
          gravelPercent: 0,
          cyclewayPercent: 5
        },
        roadTypes: {
          secondary: 85,
          cycleway: 5,
          provincial: 10
        },
        timeEstimates: {
          speed20: '2h 12m',
          speed25: '1h 46m',
          speed30: '1h 28m'
        },
        coords: this.generatePathCoordinates(this.defaultOrigin, this.defaultDestination, 'flat'),
        elevationProfile: this.generateElevationProfile(44.2, 140, 'flat')
      },
      {
        id: 'route-gpm',
        name: 'Variante 3: Sfida GPM & Salite Pro',
        color: '#8b5cf6',
        trafficLevel: 'low',
        trafficBadge: 'Traffico Basso (Strade di Montagna)',
        badgeClass: 'badge-low-traffic',
        distanceKm: 52.8,
        elevationGainM: 780,
        elevationLossM: 740,
        maxGradePercent: 11.5,
        avgGradePercent: 3.4,
        difficulty: 'Avanzato / Pro',
        surface: {
          asphaltPercent: 90,
          gravelPercent: 10,
          cyclewayPercent: 0
        },
        roadTypes: {
          secondary: 70,
          cycleway: 0,
          provincial: 30
        },
        timeEstimates: {
          speed20: '2h 38m',
          speed25: '2h 06m',
          speed30: '1h 45m'
        },
        coords: this.generatePathCoordinates(this.defaultOrigin, this.defaultDestination, 'gpm'),
        elevationProfile: this.generateElevationProfile(52.8, 780, 'gpm')
      }
    ];

    return routes;
  }

  generatePathCoordinates(start, end, style) {
    const points = [];
    const steps = 60;
    
    let deviationLat = 0;
    let deviationLng = 0;
    if (style === 'quiet') { deviationLat = 0.04; deviationLng = -0.05; }
    if (style === 'flat') { deviationLat = -0.02; deviationLng = 0.02; }
    if (style === 'gpm') { deviationLat = 0.08; deviationLng = 0.06; }

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = (1 - t) * start[0] + t * end[0] + Math.sin(t * Math.PI) * deviationLat;
      const lng = (1 - t) * start[1] + t * end[1] + Math.sin(t * Math.PI) * deviationLng;
      points.push([lat, lng]);
    }
    return points;
  }

  generateElevationProfile(totalDistance, totalDPlus, style) {
    const profile = [];
    const steps = 50;
    const distStep = totalDistance / steps;
    let currentElev = 120;

    for (let i = 0; i <= steps; i++) {
      const distKm = parseFloat((i * distStep).toFixed(1));
      let bump = 0;

      if (style === 'quiet') {
        bump = Math.sin(i / 5) * 15 + (i > 20 && i < 35 ? Math.sin((i - 20) / 15 * Math.PI) * 180 : 0);
      } else if (style === 'flat') {
        bump = Math.sin(i / 8) * 8;
      } else if (style === 'gpm') {
        if (i >= 10 && i <= 30) {
          bump = Math.sin((i - 10) / 20 * Math.PI) * 450;
        } else if (i >= 35 && i <= 45) {
          bump = Math.sin((i - 35) / 10 * Math.PI) * 250;
        }
      }

      const eleM = Math.round(Math.max(100, currentElev + bump));
      profile.push({ distanceKm: distKm, elevationM: eleM });
    }
    return profile;
  }
}
