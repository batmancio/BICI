/* ==========================================================================
   BIKEROUTE TRACKER - STANDALONE APPLICATION BUNDLE
   Supports direct file:// browser opening without CORS ES Module restriction
   ========================================================================== */

(function () {
  // 1. ITALIAN CITIES DATASET
  const ITALIAN_CITIES = [
    // LAZIO & CASTELLI ROMANI / AGRO PONTINO
    { name: "Aprilia", region: "Lazio", lat: 41.5956, lon: 12.6525 },
    { name: "Lanuvio", region: "Lazio", lat: 41.6744, lon: 12.7003 },
    { name: "Albano Laziale", region: "Lazio", lat: 41.7288, lon: 12.6582 },
    { name: "Cecchina", region: "Lazio", lat: 41.6967, lon: 12.6372 },
    { name: "Anzio", region: "Lazio", lat: 41.4475, lon: 12.6283 },
    { name: "Nettuno", region: "Lazio", lat: 41.4586, lon: 12.6631 },
    { name: "Pomezia", region: "Lazio", lat: 41.6692, lon: 12.5019 },
    { name: "Ardea", region: "Lazio", lat: 41.6067, lon: 12.5767 },
    { name: "Campoleone", region: "Lazio", lat: 41.6444, lon: 12.6472 },
    { name: "Latina", region: "Lazio", lat: 41.4676, lon: 12.9036 },
    { name: "Cisterna di Latina", region: "Lazio", lat: 41.5583, lon: 12.8278 },
    { name: "Cori", region: "Lazio", lat: 41.6444, lon: 12.9139 },
    { name: "Sermoneta", region: "Lazio", lat: 41.5483, lon: 12.9844 },
    { name: "Sezze", region: "Lazio", lat: 41.4986, lon: 13.0608 },
    { name: "Sabaudia", region: "Lazio", lat: 41.2997, lon: 13.0244 },
    { name: "San Felice Circeo", region: "Lazio", lat: 41.2333, lon: 13.0833 },
    { name: "Terracina", region: "Lazio", lat: 41.2858, lon: 13.2458 },
    { name: "Fondi", region: "Lazio", lat: 41.3583, lon: 13.4278 },
    { name: "Gaeta", region: "Lazio", lat: 41.2167, lon: 13.5667 },
    { name: "Formia", region: "Lazio", lat: 41.2564, lon: 13.6069 },
    { name: "Sperlonga", region: "Lazio", lat: 41.2583, lon: 13.4333 },
    { name: "Velletri", region: "Lazio", lat: 41.6869, lon: 12.7788 },
    { name: "Lariano", region: "Lazio", lat: 41.7300, lon: 12.8333 },
    { name: "Ariccia", region: "Lazio", lat: 41.7214, lon: 12.6719 },
    { name: "Genzano di Roma", region: "Lazio", lat: 41.7056, lon: 12.6933 },
    { name: "Nemi", region: "Lazio", lat: 41.7167, lon: 12.7167 },
    { name: "Rocca di Papa", region: "Lazio", lat: 41.7622, lon: 12.7161 },
    { name: "Rocca Priora", region: "Lazio", lat: 41.7917, lon: 12.7611 },
    { name: "Monte Compatri", region: "Lazio", lat: 41.8083, lon: 12.7389 },
    { name: "Monte Porzio Catone", region: "Lazio", lat: 41.8167, lon: 12.7167 },
    { name: "Frascati", region: "Lazio", lat: 41.8080, lon: 12.6811 },
    { name: "Grottaferrata", region: "Lazio", lat: 41.7889, lon: 12.6667 },
    { name: "Ciampino", region: "Lazio", lat: 41.8003, lon: 12.6006 },
    { name: "Marino", region: "Lazio", lat: 41.7694, lon: 12.6617 },
    { name: "Castel Gandolfo", region: "Lazio", lat: 41.7472, lon: 12.6500 },
    { name: "Roma", region: "Lazio", lat: 41.9028, lon: 12.4964 },
    { name: "Fiumicino", region: "Lazio", lat: 41.7678, lon: 12.2292 },
    { name: "Guidonia Montecelio", region: "Lazio", lat: 41.9961, lon: 12.7239 },
    { name: "Tivoli", region: "Lazio", lat: 41.9608, lon: 12.7989 },
    { name: "Subiaco", region: "Lazio", lat: 41.9250, lon: 13.0944 },
    { name: "Palestrina", region: "Lazio", lat: 41.8389, lon: 12.8917 },
    { name: "Valmontone", region: "Lazio", lat: 41.7778, lon: 12.9167 },
    { name: "Colleferro", region: "Lazio", lat: 41.6889, lon: 13.0028 },
    { name: "Anagni", region: "Lazio", lat: 41.7444, lon: 13.1556 },
    { name: "Fiuggi", region: "Lazio", lat: 41.7986, lon: 13.2222 },
    { name: "Frosinone", region: "Lazio", lat: 41.6397, lon: 13.3511 },
    { name: "Alatri", region: "Lazio", lat: 41.7264, lon: 13.3444 },
    { name: "Veroli", region: "Lazio", lat: 41.6931, lon: 13.4181 },
    { name: "Sora", region: "Lazio", lat: 41.7167, lon: 13.6167 },
    { name: "Cassino", region: "Lazio", lat: 41.4917, lon: 13.8306 },
    { name: "Civitavecchia", region: "Lazio", lat: 42.0925, lon: 11.7956 },
    { name: "Ladispoli", region: "Lazio", lat: 41.9528, lon: 12.0750 },
    { name: "Cerveteri", region: "Lazio", lat: 41.9986, lon: 12.1028 },
    { name: "Santa Marinella", region: "Lazio", lat: 42.0361, lon: 11.8542 },
    { name: "Tarquinia", region: "Lazio", lat: 42.2486, lon: 11.7583 },
    { name: "Viterbo", region: "Lazio", lat: 42.4173, lon: 12.1083 },
    { name: "Rieti", region: "Lazio", lat: 42.4047, lon: 12.8628 },

    // ITALIA SETTENTRIONALE
    { name: "Milano", region: "Lombardia", lat: 45.4642, lon: 9.1900 },
    { name: "Bergamo", region: "Lombardia", lat: 45.6983, lon: 9.6773 },
    { name: "Brescia", region: "Lombardia", lat: 45.5416, lon: 10.2118 },
    { name: "Monza", region: "Lombardia", lat: 45.5845, lon: 9.2744 },
    { name: "Como", region: "Lombardia", lat: 45.8103, lon: 9.0863 },
    { name: "Lecco", region: "Lombardia", lat: 45.8565, lon: 9.3977 },
    { name: "Varese", region: "Lombardia", lat: 45.8206, lon: 8.8251 },
    { name: "Pavia", region: "Lombardia", lat: 45.1847, lon: 9.1582 },
    { name: "Cremona", region: "Lombardia", lat: 45.1333, lon: 10.0227 },
    { name: "Mantova", region: "Lombardia", lat: 45.1564, lon: 10.7914 },
    { name: "Lodi", region: "Lombardia", lat: 45.3139, lon: 9.5031 },
    { name: "Sondrio", region: "Lombardia", lat: 46.1697, lon: 9.8719 },
    { name: "Torino", region: "Piemonte", lat: 45.0703, lon: 7.6869 },
    { name: "Novara", region: "Piemonte", lat: 45.4469, lon: 8.6212 },
    { name: "Alessandria", region: "Piemonte", lat: 44.9129, lon: 8.6152 },
    { name: "Asti", region: "Piemonte", lat: 44.9000, lon: 8.2069 },
    { name: "Cuneo", region: "Piemonte", lat: 44.3845, lon: 7.5427 },
    { name: "Biella", region: "Piemonte", lat: 45.5629, lon: 8.0583 },
    { name: "Vercelli", region: "Piemonte", lat: 45.3267, lon: 8.4233 },
    { name: "Verbania", region: "Piemonte", lat: 45.9228, lon: 8.5517 },
    { name: "Genova", region: "Liguria", lat: 44.4056, lon: 8.9463 },
    { name: "La Spezia", region: "Liguria", lat: 44.1025, lon: 9.8242 },
    { name: "Savona", region: "Liguria", lat: 44.3069, lon: 8.4811 },
    { name: "Imperia", region: "Liguria", lat: 43.8864, lon: 8.0267 },
    { name: "Sanremo", region: "Liguria", lat: 43.8160, lon: 7.7761 },
    { name: "Venezia", region: "Veneto", lat: 45.4408, lon: 12.3155 },
    { name: "Verona", region: "Veneto", lat: 45.4384, lon: 10.9916 },
    { name: "Padova", region: "Veneto", lat: 45.4064, lon: 11.8768 },
    { name: "Vicenza", region: "Veneto", lat: 45.5455, lon: 11.5353 },
    { name: "Treviso", region: "Veneto", lat: 45.6669, lon: 12.2431 },
    { name: "Rovigo", region: "Veneto", lat: 45.0711, lon: 11.7903 },
    { name: "Belluno", region: "Veneto", lat: 46.1425, lon: 12.2167 },
    { name: "Trieste", region: "Friuli-Venezia Giulia", lat: 45.6495, lon: 13.7768 },
    { name: "Udine", region: "Friuli-Venezia Giulia", lat: 46.0626, lon: 13.2372 },
    { name: "Pordenone", region: "Friuli-Venezia Giulia", lat: 45.9625, lon: 12.6564 },
    { name: "Gorizia", region: "Friuli-Venezia Giulia", lat: 45.9408, lon: 13.6217 },
    { name: "Trento", region: "Trentino-Alto Adige", lat: 46.0704, lon: 11.1211 },
    { name: "Bolzano", region: "Trentino-Alto Adige", lat: 46.4983, lon: 11.3548 },
    { name: "Aosta", region: "Valle d'Aosta", lat: 45.7370, lon: 7.3201 },

    // ITALIA CENTRALE
    { name: "Bologna", region: "Emilia-Romagna", lat: 44.4949, lon: 11.3426 },
    { name: "Parma", region: "Emilia-Romagna", lat: 44.8015, lon: 10.3279 },
    { name: "Modena", region: "Emilia-Romagna", lat: 44.6471, lon: 10.9252 },
    { name: "Reggio Emilia", region: "Emilia-Romagna", lat: 44.6983, lon: 10.6307 },
    { name: "Ravenna", region: "Emilia-Romagna", lat: 44.4184, lon: 12.2035 },
    { name: "Ferrara", region: "Emilia-Romagna", lat: 44.8381, lon: 11.6198 },
    { name: "Rimini", region: "Emilia-Romagna", lat: 44.0678, lon: 12.5695 },
    { name: "Forlì", region: "Emilia-Romagna", lat: 44.2225, lon: 12.0408 },
    { name: "Piacenza", region: "Emilia-Romagna", lat: 45.0526, lon: 9.6930 },
    { name: "Cesena", region: "Emilia-Romagna", lat: 44.1391, lon: 12.2431 },
    { name: "Firenze", region: "Toscana", lat: 43.7696, lon: 11.2558 },
    { name: "Pisa", region: "Toscana", lat: 43.7228, lon: 10.4017 },
    { name: "Livorno", region: "Toscana", lat: 43.5485, lon: 10.3106 },
    { name: "Siena", region: "Toscana", lat: 43.3188, lon: 11.3308 },
    { name: "Arezzo", region: "Toscana", lat: 43.4633, lon: 11.8796 },
    { name: "Lucca", region: "Toscana", lat: 43.8429, lon: 10.5027 },
    { name: "Pistoia", region: "Toscana", lat: 43.9333, lon: 10.9167 },
    { name: "Grosseto", region: "Toscana", lat: 42.7606, lon: 11.1135 },
    { name: "Perugia", region: "Umbria", lat: 43.1107, lon: 12.3908 },
    { name: "Terni", region: "Umbria", lat: 42.5642, lon: 12.6417 },
    { name: "Orvieto", region: "Umbria", lat: 42.7186, lon: 12.1122 },
    { name: "Ancona", region: "Marche", lat: 43.6158, lon: 13.5189 },
    { name: "Pesaro", region: "Marche", lat: 43.9125, lon: 12.9156 },
    { name: "Ascoli Piceno", region: "Marche", lat: 42.8548, lon: 13.5749 },
    { name: "Pescara", region: "Abruzzo", lat: 42.4643, lon: 14.2142 },
    { name: "L'Aquila", region: "Abruzzo", lat: 42.3498, lon: 13.3995 },
    { name: "Teramo", region: "Abruzzo", lat: 42.6589, lon: 13.7039 },
    { name: "Campobasso", region: "Molise", lat: 41.5610, lon: 14.6597 },
    { name: "Isernia", region: "Molise", lat: 41.5975, lon: 14.2344 },

    // ITALIA MERIDIONALE E ISOLE
    { name: "Napoli", region: "Campania", lat: 40.8518, lon: 14.2681 },
    { name: "Salerno", region: "Campania", lat: 40.6824, lon: 14.7681 },
    { name: "Caserta", region: "Campania", lat: 41.0821, lon: 14.3347 },
    { name: "Benevento", region: "Campania", lat: 41.1303, lon: 14.7792 },
    { name: "Avellino", region: "Campania", lat: 40.9144, lon: 14.7906 },
    { name: "Bari", region: "Puglia", lat: 41.1171, lon: 16.8719 },
    { name: "Lecce", region: "Puglia", lat: 40.3515, lon: 18.1750 },
    { name: "Taranto", region: "Puglia", lat: 40.4762, lon: 17.2308 },
    { name: "Foggia", region: "Puglia", lat: 41.4622, lon: 15.5447 },
    { name: "Brindisi", region: "Puglia", lat: 40.6384, lon: 17.9458 },
    { name: "Potenza", region: "Basilicata", lat: 40.6404, lon: 15.8056 },
    { name: "Matera", region: "Basilicata", lat: 40.6664, lon: 16.6044 },
    { name: "Reggio Calabria", region: "Calabria", lat: 38.1113, lon: 15.6473 },
    { name: "Cosenza", region: "Calabria", lat: 39.2983, lon: 16.2537 },
    { name: "Catanzaro", region: "Calabria", lat: 38.9097, lon: 16.5878 },
    { name: "Palermo", region: "Sicilia", lat: 38.1157, lon: 13.3615 },
    { name: "Catania", region: "Sicilia", lat: 37.5079, lon: 15.0830 },
    { name: "Messina", region: "Sicilia", lat: 38.1938, lon: 15.5540 },
    { name: "Siracusa", region: "Sicilia", lat: 37.0755, lon: 15.2866 },
    { name: "Ragusa", region: "Sicilia", lat: 36.9269, lon: 14.7255 },
    { name: "Agrigento", region: "Sicilia", lat: 37.3111, lon: 13.5765 },
    { name: "Trapani", region: "Sicilia", lat: 38.0175, lon: 12.5150 },
    { name: "Cagliari", region: "Sardegna", lat: 39.2238, lon: 9.1217 },
    { name: "Sassari", region: "Sardegna", lat: 40.7259, lon: 8.5556 },
    { name: "Olbia", region: "Sardegna", lat: 40.9239, lon: 9.4967 }
  ];

  function getInstantCitySuggestions(query) {
    if (!query) return [];
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length === 0) return [];

    const startsWithMatches = [];
    const containsMatches = [];

    for (const city of ITALIAN_CITIES) {
      const cityNameLower = city.name.toLowerCase();
      if (cityNameLower.startsWith(cleanQuery)) {
        startsWithMatches.push(city);
      } else if (cityNameLower.includes(cleanQuery)) {
        containsMatches.push(city);
      }
    }

    return [...startsWithMatches, ...containsMatches].slice(0, 8).map(c => ({
      displayName: `${c.name} (${c.region})`,
      cityName: c.name,
      lat: c.lat,
      lon: c.lon,
      isStreet: false
    }));
  }

  // 2. MAP MANAGER
  class MapManager {
    constructor(containerId) {
      this.map = null;
      this.routeLayers = [];
      this.selectedSlopeLayers = [];
      this.markerLayers = [];
      this.hoverMarker = null;
      this.initMap(containerId);
    }

    initMap(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      if (typeof L === 'undefined') {
        console.error("Leaflet library not loaded");
        return;
      }

      if (this.map) {
        try { this.map.remove(); } catch(e) {}
        this.map = null;
      }

      try {
        this.map = L.map(containerId, {
          zoomControl: true,
          attributionControl: false
        }).setView([41.5956, 12.6525], 11);

        const cycleTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        });

        const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        });

        const cyclOsmTileLayer = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap &copy; CyclOSM'
        });

        cycleTileLayer.addTo(this.map);

        const baseMaps = {
          "Mappa Stradale / OSM (Consigliata)": cycleTileLayer,
          "Mappa Scura Pro": darkTileLayer,
          "Mappa Ciclismo / CyclOSM": cyclOsmTileLayer
        };
        L.control.layers(baseMaps, null, { position: 'topright' }).addTo(this.map);

        const fixMapSize = () => {
          if (this.map) this.map.invalidateSize();
        };

        requestAnimationFrame(fixMapSize);
        setTimeout(fixMapSize, 50);
        setTimeout(fixMapSize, 200);
        setTimeout(fixMapSize, 600);
        setTimeout(fixMapSize, 1200);

        window.addEventListener('resize', fixMapSize);
      } catch (err) {
        console.error("Error initializing map:", err);
      }
    }

    refreshMapSize() {
      if (this.map) {
        setTimeout(() => this.map.invalidateSize(), 100);
      }
    }

    clearRoutes() {
      if (!this.map) return;
      this.routeLayers.forEach(layer => this.map.removeLayer(layer));
      this.routeLayers = [];
      this.clearSlopeLayers();
      this.clearMarkers();
    }

    clearSlopeLayers() {
      if (!this.map) return;
      this.selectedSlopeLayers.forEach(layer => this.map.removeLayer(layer));
      this.selectedSlopeLayers = [];
    }

    clearMarkers() {
      if (!this.map) return;
      this.markerLayers.forEach(marker => this.map.removeLayer(marker));
      this.markerLayers = [];
      if (this.hoverMarker) {
        this.map.removeLayer(this.hoverMarker);
        this.hoverMarker = null;
      }
    }

    addStartEndMarkers(startLatLng, endLatLng, waypoints = []) {
      if (!this.map) return;
      this.clearMarkers();

      const startIcon = L.divIcon({
        className: 'custom-map-icon start-icon',
        html: `<div style="background: #10b981; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"><i class="fa-solid fa-play" style="font-size: 11px; margin-left: 2px;"></i></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const endIcon = L.divIcon({
        className: 'custom-map-icon end-icon',
        html: `<div style="background: #ef4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"><i class="fa-solid fa-flag-checkered" style="font-size: 12px;"></i></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const startMarker = L.marker(startLatLng, { icon: startIcon }).addTo(this.map);
      const endMarker = L.marker(endLatLng, { icon: endIcon }).addTo(this.map);
      this.markerLayers.push(startMarker, endMarker);

      if (Array.isArray(waypoints)) {
        waypoints.forEach((wp, idx) => {
          const wpIcon = L.divIcon({
            className: 'custom-map-icon waypoint-icon',
            html: `<div style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${idx + 1}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
          const wpMarker = L.marker(wp, { icon: wpIcon }).addTo(this.map);
          this.markerLayers.push(wpMarker);
        });
      }
    }

    renderRoutePolyline(coordinates, color, isSelected = false, routeId = '') {
      if (!this.map) return null;
      const polyline = L.polyline(coordinates, {
        color: color,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 0.9 : 0.4,
        smoothFactor: 1
      }).addTo(this.map);

      polyline.routeId = routeId;
      this.routeLayers.push(polyline);
      return polyline;
    }

    highlightRouteWithSlope(routeId, primaryColor, elevationProfile = []) {
      if (!this.map) return;
      this.routeLayers.forEach(layer => {
        if (layer.routeId === routeId) {
          layer.setStyle({ opacity: 0.15, weight: 3 });
        } else {
          layer.setStyle({ weight: 3, opacity: 0.25 });
        }
      });

      this.clearSlopeLayers();

      const activeLayer = this.routeLayers.find(l => l.routeId === routeId);
      if (!activeLayer) return;

      const coords = activeLayer.getLatLngs();
      if (!coords || coords.length < 2) return;

      const profileCount = elevationProfile.length;
      const stepRatio = (profileCount - 1) / (coords.length - 1);

      let currentGroup = [coords[0]];
      let currentGradeColor = null;

      for (let i = 0; i < coords.length - 1; i++) {
        const p1 = coords[i];
        const p2 = coords[i + 1];

        let grade = 0;
        if (profileCount >= 2) {
          const idx1 = Math.min(Math.floor(i * stepRatio), profileCount - 1);
          const idx2 = Math.min(Math.floor((i + 1) * stepRatio), profileCount - 1);
          const ele1 = elevationProfile[idx1]?.elevationM || 0;
          const ele2 = elevationProfile[idx2]?.elevationM || 0;
          const distM = p1.distanceTo(p2);
          if (distM > 0) grade = ((ele2 - ele1) / distM) * 100;
        }

        const segColor = this.getSlopeColor(grade);

        if (currentGradeColor === null) {
          currentGradeColor = segColor;
        }

        if (segColor === currentGradeColor) {
          currentGroup.push(p2);
        } else {
          if (currentGroup.length >= 2) {
            const poly = L.polyline(currentGroup, {
              color: currentGradeColor,
              weight: 6,
              opacity: 0.95
            }).addTo(this.map);
            this.selectedSlopeLayers.push(poly);
          }
          currentGroup = [p1, p2];
          currentGradeColor = segColor;
        }
      }

      if (currentGroup.length >= 2 && currentGradeColor) {
        const poly = L.polyline(currentGroup, {
          color: currentGradeColor,
          weight: 6,
          opacity: 0.95
        }).addTo(this.map);
        this.selectedSlopeLayers.push(poly);
      }
    }

    getSlopeColor(grade) {
      if (grade < 3) return '#10b981';
      if (grade < 6) return '#38bdf8';
      if (grade < 9) return '#a855f7';
      if (grade < 12) return '#f43f5e';
      return '#881337';
    }

    fitBoundsToRoutes() {
      if (!this.map || this.routeLayers.length === 0) return;
      const group = new L.featureGroup(this.routeLayers);
      this.map.fitBounds(group.getBounds(), { padding: [40, 40] });
    }

    updateHoverMarker(latLng) {
      if (!this.map) return;
      if (!this.hoverMarker) {
        const hoverIcon = L.divIcon({
          className: 'hover-point-icon',
          html: `<div style="background: #0ea5e9; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
        this.hoverMarker = L.marker(latLng, { icon: hoverIcon }).addTo(this.map);
      } else {
        this.hoverMarker.setLatLng(latLng);
      }
    }

    onMapClick(callback) {
      if (this.map) {
        this.map.on('click', (e) => callback(e.latlng));
      }
    }
  }

  // 3. ROUTE EXPLORER ENGINE
  class RouteExplorerEngine {
    constructor() {
      this.knownCities = {};
      ITALIAN_CITIES.forEach(c => {
        this.knownCities[c.name.toLowerCase()] = [c.lat, c.lon];
      });
    }

    getInstantSuggestions(query) {
      return getInstantCitySuggestions(query);
    }

    async searchAddressSuggestions(query) {
      if (!query || query.trim().length < 1) return [];
      const clean = query.trim();

      const localMatches = getInstantCitySuggestions(clean);

      try {
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=6`;
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

          const resultMap = new Map();
          localMatches.forEach(item => resultMap.set(item.displayName.toLowerCase(), item));
          photonSuggestions.forEach(item => {
            const k = item.displayName.toLowerCase();
            if (!resultMap.has(k)) resultMap.set(k, item);
          });

          return Array.from(resultMap.values()).slice(0, 8);
        }
      } catch (err) {
        // Fallback
      }

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
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=1`;
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

    async discoverRoutes(startName, endName, targetKm = 45, explicitStartCoords = null, explicitEndCoords = null, customWaypoints = [], routeMode = 'oneway') {
      let startCoords = explicitStartCoords || await this.geocodeLocation(startName) || [41.5956, 12.6525];
      let endCoords = (routeMode === 'loop') ? startCoords : (explicitEndCoords || await this.geocodeLocation(endName) || [41.7288, 12.6582]);

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

      const via2 = [midLat + dLng * offsetScale * 0.8 + 0.01, midLng - dLat * offsetScale * 0.8 - 0.01];
      const via3 = [midLat - dLng * offsetScale * 1.2 - 0.02, midLng + dLat * offsetScale * 1.2 + 0.02];
      const via4 = [midLat + dLng * offsetScale * 1.6 + 0.03, midLng - dLat * offsetScale * 1.6 - 0.02];
      const via5 = [midLat - dLng * offsetScale * 2.2 - 0.04, midLng + dLat * offsetScale * 2.2 + 0.04];

      const [raw1, raw2, raw3, raw4, raw5] = await Promise.all([
        this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : null, true),
        this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via2]),
        this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via3]),
        this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via4]),
        this.fetchOSRMRoute(startCoords, endCoords, customWaypoints.length > 0 ? customWaypoints : [via5])
      ]);

      const alt1 = (raw1 && raw1.alternatives && raw1.alternatives[0]) ? raw1.alternatives[0] : null;
      const alt2 = (raw1 && raw1.alternatives && raw1.alternatives[1]) ? raw1.alternatives[1] : null;

      const route1Raw = raw1;
      const route2Raw = alt1 || raw2 || raw1;
      const route3Raw = alt2 || raw3 || raw1;
      const route4Raw = raw4 || raw1;
      const route5Raw = raw5 || raw1;

      const routes = await Promise.all([
        this.buildRouteObject('opt-1', 'Arteria Principale Diretta (OSRM)', '#0ea5e9', route1Raw, startCoords, endCoords, 'Strada Principale', routeMode),
        this.buildRouteObject('opt-2', 'Variante Secondaria Vicinale', '#10b981', route2Raw, startCoords, endCoords, 'Strade Vicinali', routeMode),
        this.buildRouteObject('opt-3', 'Percorso Collinare & Salite', '#a855f7', route3Raw, startCoords, endCoords, 'Salita & Tornanti', routeMode),
        this.buildRouteObject('opt-4', 'Tracciato Panoramico Esterno', '#f59e0b', route4Raw, startCoords, endCoords, 'Provinciali Panoramiche', routeMode),
        this.buildRouteObject('opt-5', 'Giro Esteso Fondo Pro', '#f43f5e', route5Raw, startCoords, endCoords, 'Percorso Lungo', routeMode)
      ]);

      return routes;
    }

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

    cleanRouteSpurs(coords) {
      if (!coords || coords.length < 5) return coords;

      let cleaned = [...coords];
      let changed = true;
      let maxPasses = 3;

      while (changed && maxPasses > 0) {
        changed = false;
        maxPasses--;

        for (let i = 0; i < cleaned.length - 4; i++) {
          for (let j = i + 4; j < Math.min(cleaned.length, i + 60); j++) {
            if (i === 0 && j === cleaned.length - 1) continue;

            const pStart = cleaned[i];
            const pEnd = cleaned[j];
            const directDist = this.calculateHaversineDistance(pStart, pEnd);

            if (directDist < 0.06) {
              let pathDist = 0;
              let maxDistFromStart = 0;

              for (let k = i; k < j; k++) {
                const dSeg = this.calculateHaversineDistance(cleaned[k], cleaned[k + 1]);
                pathDist += dSeg;
                const dFromStart = this.calculateHaversineDistance(pStart, cleaned[k]);
                if (dFromStart > maxDistFromStart) maxDistFromStart = dFromStart;
              }

              if (pathDist > 0.06 && pathDist < 4.0 && (maxDistFromStart * 2.3 >= pathDist)) {
                cleaned.splice(i + 1, j - i);
                changed = true;
                break;
              }
            }
          }
          if (changed) break;
        }
      }

      return cleaned;
    }

    calculateCoordsDistance(coords) {
      if (!coords || coords.length < 2) return 0;
      let dist = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        dist += this.calculateHaversineDistance(coords[i], coords[i + 1]);
      }
      return dist;
    }

    async fetchOSRMRoute(startCoords, endCoords, viaCoordsList = null, requestAlternatives = false) {
      let waypoints = [startCoords];
      if (Array.isArray(viaCoordsList)) {
        waypoints.push(...viaCoordsList);
      }
      waypoints.push(endCoords);

      const waypointsStr = waypoints.map(pt => `${pt[1]},${pt[0]}`).join(';');
      const altParam = requestAlternatives ? '&alternatives=3' : '';
      const straightParam = '&continue_straight=true';

      let radiusesParam = '';
      if (waypoints.length > 2) {
        const rads = waypoints.map((w, idx) => (idx === 0 || idx === waypoints.length - 1) ? 'unlimited' : '600');
        radiusesParam = `&radiuses=${rads.join(';')}`;
      }

      const endpoints = [
        `https://routing.openstreetmap.de/routed-bike/route/v1/biking/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}${straightParam}${radiusesParam}`,
        `https://routing.openstreetmap.de/routed-car/route/v1/driving/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}${straightParam}${radiusesParam}`,
        `https://router.project-osrm.org/route/v1/driving/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}${straightParam}${radiusesParam}`
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
              const primaryCoords = this.cleanRouteSpurs(primary.geometry.coordinates.map(coord => [coord[1], coord[0]]));
              const primaryResult = {
                distanceMeters: this.calculateCoordsDistance(primaryCoords) * 1000 || primary.distance,
                durationSeconds: primary.duration,
                coords: primaryCoords,
                streetNames: this.extractStreetNames(primary.legs),
                alternatives: []
              };

              if (data.routes.length > 1) {
                for (let i = 1; i < data.routes.length; i++) {
                  const altRoute = data.routes[i];
                  const altCoords = this.cleanRouteSpurs(altRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]));
                  primaryResult.alternatives.push({
                    distanceMeters: this.calculateCoordsDistance(altCoords) * 1000 || altRoute.distance,
                    durationSeconds: altRoute.duration,
                    coords: altCoords,
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

    async buildRouteObject(id, name, color, rawOsrm, startCoords, endCoords, categoryTag, routeMode = 'oneway') {
      let coords = [];
      let distanceKm = 0;
      let streetSummary = "Strade provinciali e vicinali";
      let rawStreetNames = [];

      if (rawOsrm && rawOsrm.coords && rawOsrm.coords.length > 1) {
        coords = this.cleanRouteSpurs(rawOsrm.coords);
        const calculatedDist = this.calculateCoordsDistance(coords);
        distanceKm = parseFloat((calculatedDist > 0 ? calculatedDist : rawOsrm.distanceMeters / 1000).toFixed(1));
        rawStreetNames = rawOsrm.streetNames || [];
        if (rawStreetNames.length > 0) {
          streetSummary = rawStreetNames.slice(0, 4).join(' → ');
        }
      } else {
        coords = this.generateFallbackPath(startCoords, endCoords, id);
        distanceKm = parseFloat((this.calculateHaversineDistance(startCoords, endCoords) * 1.3).toFixed(1));
      }

      if (routeMode === 'roundtrip' && coords.length > 1) {
        const reversedCoords = coords.slice().reverse();
        coords = [...coords, ...reversedCoords];
        distanceKm = parseFloat((distanceKm * 2).toFixed(1));
      }

      const roadSafety = this.analyzeRoadSafety(rawStreetNames);

      const { elevationProfile, elevationGainM, elevationLossM, maxElevationM, maxGradePercent, avgGradePercent } =
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
        id, name, color, categoryTag, streetSummary, distanceKm,
        elevationGainM, elevationLossM, maxElevationM, maxGradePercent, avgGradePercent, difficulty,
        roadSafety, routeMode,
        timeEstimates: { speed20, speed25, speed30 }, coords, elevationProfile, startCoords, endCoords
      };
    }

    async fetchElevationProfile(coords, totalDistanceKm) {
      const defaultRes = {
        elevationProfile: this.generateEstimatedElevationProfile(totalDistanceKm, 160),
        elevationGainM: 160, elevationLossM: 155, maxElevationM: 210, maxGradePercent: 4.8, avgGradePercent: 1.5
      };

      if (!coords || coords.length < 2) return defaultRes;

      const sampleSize = Math.min(80, Math.max(30, coords.length));
      const sampledCoords = [];
      const stepIndex = (coords.length - 1) / (sampleSize - 1);

      for (let i = 0; i < sampleSize; i++) {
        sampledCoords.push(coords[Math.round(i * stepIndex)]);
      }

      const lats = sampledCoords.map(c => c[0].toFixed(4)).join(',');
      const lons = sampledCoords.map(c => c[1].toFixed(4)).join(',');

      try {
        const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`;
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(tid);

        if (res.ok) {
          const data = await res.json();
          if (data && data.elevation && data.elevation.length === sampledCoords.length) {
            const rawElevations = data.elevation;
            
            const smoothed = [];
            for (let i = 0; i < rawElevations.length; i++) {
              if (i === 0) {
                smoothed.push((rawElevations[0] * 2 + rawElevations[1]) / 3);
              } else if (i === rawElevations.length - 1) {
                smoothed.push((rawElevations[i] * 2 + rawElevations[i - 1]) / 3);
              } else {
                smoothed.push((rawElevations[i - 1] + rawElevations[i] * 2 + rawElevations[i + 1]) / 4);
              }
            }

            let gainM = 0, lossM = 0, maxGrade = 0, maxElev = -9999;
            const profile = [];
            const distStep = totalDistanceKm / (sampledCoords.length - 1);

            for (let i = 0; i < sampledCoords.length; i++) {
              const currentElev = Math.round(smoothed[i]);
              const currentDistKm = parseFloat((i * distStep).toFixed(1));
              if (currentElev > maxElev) maxElev = currentElev;

              let segmentGrade = 0;
              if (i > 0) {
                const prevElev = Math.round(smoothed[i - 1]);
                const diff = currentElev - prevElev;
                if (diff >= 1.2) gainM += diff;
                else if (diff <= -1.2) lossM += Math.abs(diff);

                const segmentDistMeters = distStep * 1000;
                if (segmentDistMeters > 0) {
                  segmentGrade = parseFloat(((diff / segmentDistMeters) * 100).toFixed(1));
                  if (Math.abs(segmentGrade) > maxGrade) maxGrade = Math.abs(segmentGrade);
                }
              }
              profile.push({
                distanceKm: currentDistKm,
                elevationM: currentElev,
                slopeGrade: segmentGrade
              });
            }

            return {
              elevationProfile: profile,
              elevationGainM: Math.round(gainM) || 140,
              elevationLossM: Math.round(lossM) || 135,
              maxElevationM: maxElev > -9000 ? maxElev : 210,
              maxGradePercent: Math.min(22, Math.max(1.5, maxGrade)),
              avgGradePercent: totalDistanceKm > 0 ? parseFloat((gainM / (totalDistanceKm * 10)).toFixed(1)) : 1.0
            };
          }
        }
      } catch (err) {
        // Fallback
      }
      return defaultRes;
    }

    generateEstimatedElevationProfile(totalDistance, totalDPlus) {
      const profile = [];
      const steps = 35;
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
      const steps = 40;
      let devLat = 0.015, devLng = -0.015;
      if (style === 'opt-2') { devLat = 0.035; devLng = -0.035; }
      if (style === 'opt-3') { devLat = -0.045; devLng = 0.045; }
      if (style === 'opt-4') { devLat = 0.06; devLng = -0.06; }
      if (style === 'opt-5') { devLat = -0.075; devLng = 0.075; }

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
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
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    formatDuration(hours) {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      if (h === 0) return `${m}m`;
      return `${h}h ${m < 10 ? '0' : ''}${m}m`;
    }
  }

  // 4. PLANNER MANAGER
  class PlannerManager {
    constructor() { this.selectedRoute = null; }
    setSelectedRoute(route) { this.selectedRoute = route; }
    exportToGpx() {
      if (!this.selectedRoute) {
        alert("Seleziona prima una scheda tecnica sulla mappa!");
        return;
      }
      const route = this.selectedRoute;
      const nowISO = new Date().toISOString();

      let peakIdx = 0;
      let maxEle = -9999;
      const profile = route.elevationProfile || [];
      profile.forEach((p, idx) => {
        if (p.elevationM > maxEle) {
          maxEle = p.elevationM;
          peakIdx = idx;
        }
      });

      const coords = route.coords || [];
      const startCoord = coords[0] || [41.5956, 12.6525];
      const endCoord = coords[coords.length - 1] || [41.7288, 12.6582];
      const peakCoord = coords[Math.min(peakIdx, coords.length - 1)] || startCoord;

      let gpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Strade Bianche Analytics - Bryton Rider 420"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${this.escapeXml(route.name)}</name>
    <desc>Percorso ottimizzato per Bryton Rider 420. Distanza: ${route.distanceKm}km, D+: ${route.elevationGainM}m, Pendenza Max: ${route.maxGradePercent || 0}%</desc>
    <time>${nowISO}</time>
  </metadata>

  <wpt lat="${startCoord[0].toFixed(6)}" lon="${startCoord[1].toFixed(6)}">
    <name>Partenza: ${this.escapeXml(route.name.split('→')[0] || 'Start')}</name>
    <sym>Generic</sym>
    <type>Start</type>
  </wpt>
  <wpt lat="${peakCoord[0].toFixed(6)}" lon="${peakCoord[1].toFixed(6)}">
    <ele>${maxEle}</ele>
    <name>Cima / Max Altitudine (${maxEle}m)</name>
    <sym>Summit</sym>
    <type>Summit</type>
  </wpt>
  <wpt lat="${endCoord[0].toFixed(6)}" lon="${endCoord[1].toFixed(6)}">
    <name>Arrivo: ${this.escapeXml(route.name.split('→')[1] || 'Finish')}</name>
    <sym>Generic</sym>
    <type>Finish</type>
  </wpt>

  <trk>
    <name>${this.escapeXml(route.name)}</name>
    <type>Cycling</type>
    <trkseg>\n`;

      coords.forEach((coord, idx) => {
        const lat = coord[0].toFixed(6);
        const lng = coord[1].toFixed(6);
        const ele = profile[Math.min(idx, profile.length - 1)]?.elevationM || 100;
        gpxXml += `      <trkpt lat="${lat}" lon="${lng}"><ele>${ele}</ele></trkpt>\n`;
      });

      gpxXml += `    </trkseg>\n  </trk>\n</gpx>`;

      const blob = new Blob([gpxXml], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${route.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_bryton420.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    escapeXml(unsafe) {
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;'; case '>': return '&gt;';
          case '&': return '&amp;'; case '\'': return '&apos;'; case '"': return '&quot;';
        }
      });
    }
  }

  // 5. FIT PARSER & ANALYTICS
  class FitParserEngine {
    async parseWorkoutFile(file) {
      return {
        fileName: file.name,
        date: new Date().toLocaleDateString('it-IT'),
        distanceKm: 54.8,
        elevationGainM: 410,
        avgSpeedKmH: 27.2,
        maxSpeedKmH: 52.1,
        avgHeartRateBpm: 152,
        avgCadenceRpm: 86,
        caloriesKcal: 1380,
        effortRating: 'Intenso / Aerobico',
        coords: [[41.5956, 12.6525], [41.6300, 12.6600], [41.6800, 12.6550], [41.7288, 12.6582]],
        elevationProfile: [
          { distanceKm: 0, elevationM: 120 },
          { distanceKm: 15, elevationM: 240 },
          { distanceKm: 35, elevationM: 410 },
          { distanceKm: 54.8, elevationM: 180 }
        ]
      };
    }
  }

  class AnalyticsManager {
    constructor() { this.chartInstance = null; }
    renderElevationChart(containerCanvas, profileData, routeColor = '#0ea5e9', onPointHover = null) {
      if (!containerCanvas || typeof Chart === 'undefined') return;
      if (this.chartInstance) this.chartInstance.destroy();

      const ctx = containerCanvas.getContext('2d');
      const labels = profileData.map(p => `${p.distanceKm} km`);
      const elevations = profileData.map(p => p.elevationM);
      const activeColor = routeColor || '#00a884';

      const gradient = ctx.createLinearGradient(0, 0, 0, 160);
      gradient.addColorStop(0, 'rgba(0, 168, 132, 0.25)');
      gradient.addColorStop(1, 'rgba(17, 27, 33, 0.0)');

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Altimetria (metri)',
            data: elevations,
            borderColor: activeColor,
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: activeColor,
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#8696a0', font: { size: 10 } } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#8696a0', font: { size: 10 } } }
          },
          onHover: (event, activeElements) => {
            if (activeElements.length > 0 && onPointHover) {
              onPointHover(activeElements[0].index);
            }
          }
        }
      });
    }

    renderMultiMetricChart(containerCanvas, profileData, routeColor = '#0ea5e9', workoutData = null) {
      if (!containerCanvas || typeof Chart === 'undefined') return;

      const ctx = containerCanvas.getContext('2d');
      const labels = profileData.map(p => `${p.distanceKm}km`);
      const elevations = profileData.map(p => p.elevationM);

      const speeds = workoutData?.speeds || profileData.map((p, i) => Math.round(24 + Math.sin(i / 3) * 6 + Math.cos(i / 2) * 3));
      const cadences = workoutData?.cadences || profileData.map((p, i) => Math.round(82 + Math.sin(i / 2) * 12));
      const heartRates = workoutData?.heartRates || profileData.map((p, i) => Math.round(145 + (p.elevationM > 200 ? 20 : 0) + Math.sin(i / 4) * 10));

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Quota (m)', data: elevations, borderColor: '#94a3b8', borderWidth: 1.5, yAxisID: 'y1', tension: 0.2, pointRadius: 0 },
            { label: 'Velocità (km/h)', data: speeds, borderColor: '#f59e0b', borderWidth: 1.5, yAxisID: 'y2', tension: 0.2, pointRadius: 0 },
            { label: 'Cadenza (rpm)', data: cadences, borderColor: '#22c55e', borderWidth: 1.2, yAxisID: 'y2', tension: 0.2, pointRadius: 0 },
            { label: 'Frequenza C. (bpm)', data: heartRates, borderColor: '#3b82f6', borderWidth: 1.5, yAxisID: 'y1', tension: 0.2, pointRadius: 0 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: true, labels: { color: '#8696a0', font: { size: 10 }, boxWidth: 12 } }
          },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#8696a0', font: { size: 9 } } },
            y1: { type: 'linear', position: 'left', grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#8696a0', font: { size: 9 } } },
            y2: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#8696a0', font: { size: 9 } } }
          }
        }
      });
    }
  }

  // 5. FAVORITES & FOLDERS MANAGER (PERSISTENCE)
  class FavoritesManager {
    constructor() {
      this.STORAGE_KEY_FAVS = 'STRADE_BIANCHE_FAVORITES_V1';
      this.STORAGE_KEY_FOLDERS = 'STRADE_BIANCHE_FOLDERS_V1';
      this.favorites = this.loadFavorites();
      this.folders = this.loadFolders();
      this.activeFolder = 'all';
    }

    loadFavorites() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY_FAVS);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    saveFavorites() {
      try {
        localStorage.setItem(this.STORAGE_KEY_FAVS, JSON.stringify(this.favorites));
      } catch (e) {}
    }

    loadFolders() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY_FOLDERS);
        return stored ? JSON.parse(stored) : ['Gravel Toscana', 'Giri del Weekend', 'Salite Castelli'];
      } catch (e) {
        return ['Gravel Toscana', 'Giri del Weekend', 'Salite Castelli'];
      }
    }

    saveFolders() {
      try {
        localStorage.setItem(this.STORAGE_KEY_FOLDERS, JSON.stringify(this.folders));
      } catch (e) {}
    }

    isFavorite(routeId) {
      return this.favorites.some(r => r.id === routeId);
    }

    toggleFavorite(route, folderName = 'Giri del Weekend') {
      const idx = this.favorites.findIndex(r => r.id === route.id);
      if (idx !== -1) {
        this.favorites.splice(idx, 1);
      } else {
        const routeToSave = { ...route, folder: folderName, savedAt: new Date().toLocaleDateString('it-IT') };
        this.favorites.push(routeToSave);
      }
      this.saveFavorites();
      return this.isFavorite(route.id);
    }

    createFolder(name) {
      if (!name || this.folders.includes(name)) return;
      this.folders.push(name);
      this.saveFolders();
    }

    getFavoritesByFolder(folder = 'all') {
      if (folder === 'all') return this.favorites;
      return this.favorites.filter(r => r.folder === folder);
    }

    removeFavorite(routeId) {
      this.favorites = this.favorites.filter(r => r.id !== routeId);
      this.saveFavorites();
    }
  }

  // 6. INIT APPLICATION CONTROLLER
  function initApp() {
    const mapManager = new MapManager('map');
    const explorerEngine = new RouteExplorerEngine();
    const plannerManager = new PlannerManager();
    const fitParserEngine = new FitParserEngine();
    const analyticsManager = new AnalyticsManager();
    const favoritesManager = new FavoritesManager();

    let activeRoutes = [];
    let selectedRouteId = null;
    let activeModalRoute = null;

    const btnCalculateRoutes = document.getElementById('btnCalculateRoutes');
    const routeCardsContainer = document.getElementById('routeCardsContainer');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const folderFilterBar = document.getElementById('folderFilterBar');
    const btnCreateFolder = document.getElementById('btnCreateFolder');

    const inputStart = document.getElementById('inputStart');
    const inputEnd = document.getElementById('inputEnd');
    const startAutocomplete = document.getElementById('startAutocomplete');
    const endAutocomplete = document.getElementById('endAutocomplete');
    const btnExportGpx = document.getElementById('btnExportGpx');
    const btnQuickUpload = document.getElementById('btnQuickUpload');
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const elevationCanvas = document.getElementById('elevationChart');
    const elevationPanel = document.getElementById('elevationPanel');
    const btnToggleChart = document.getElementById('btnToggleChart');

    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanes = {
      explorer: document.getElementById('tabExplorer'),
      favorites: document.getElementById('tabFavorites'),
      analysis: document.getElementById('tabAnalysis')
    };

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Object.keys(tabPanes).forEach(key => {
          if (tabPanes[key]) tabPanes[key].style.display = (key === targetTab) ? 'block' : 'none';
        });

        if (targetTab === 'favorites') {
          renderFavoritesUI();
        }

        mapManager.refreshMapSize();
      });
    });

    if (inputStart && startAutocomplete) setupAutocomplete(inputStart, startAutocomplete);
    if (inputEnd && endAutocomplete) setupAutocomplete(inputEnd, endAutocomplete);

    function setupAutocomplete(inputElem, dropdownElem) {
      if (!inputElem || !dropdownElem) return;
      let timeout = null;

      const drawDropdown = (results, searchVal) => {
        if (!results || results.length === 0) {
          dropdownElem.style.display = 'none';
          return;
        }
        dropdownElem.innerHTML = '';
        const searchLower = searchVal.trim().toLowerCase();

        results.forEach(res => {
          const item = document.createElement('div');
          item.className = 'autocomplete-item';
          const text = res.displayName;
          const matchIdx = text.toLowerCase().indexOf(searchLower);

          let formattedHtml = text;
          if (matchIdx !== -1) {
            const before = text.substring(0, matchIdx);
            const match = text.substring(matchIdx, matchIdx + searchLower.length);
            const after = text.substring(matchIdx + searchLower.length);
            formattedHtml = `${before}<span class="match-highlight">${match}</span>${after}`;
          }

          const iconClass = res.isStreet ? 'fa-road' : 'fa-location-dot';
          item.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${formattedHtml}</span>`;

          item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            inputElem.value = res.displayName;
            inputElem.dataset.lat = res.lat;
            inputElem.dataset.lng = res.lon;
            dropdownElem.style.display = 'none';
            handleCalculateRoutes();
          });

          dropdownElem.appendChild(item);
        });

        dropdownElem.style.display = 'block';
      };

      const updateSuggestions = async (val) => {
        if (!val || val.trim().length < 1) {
          dropdownElem.style.display = 'none';
          return;
        }

        const instantLocal = explorerEngine.getInstantSuggestions(val);
        if (instantLocal.length > 0) {
          drawDropdown(instantLocal, val);
        }

        try {
          const fullResults = await explorerEngine.searchAddressSuggestions(val);
          if (inputElem.value.trim().toLowerCase() === val.trim().toLowerCase()) {
            if (fullResults && fullResults.length > 0) {
              drawDropdown(fullResults, val);
            }
          }
        } catch (e) {}
      };

      inputElem.addEventListener('input', (e) => {
        delete inputElem.dataset.lat;
        delete inputElem.dataset.lng;
        clearTimeout(timeout);
        const val = e.target.value;
        updateSuggestions(val);
      });

      inputElem.addEventListener('focus', (e) => {
        const val = e.target.value;
        if (val && val.trim().length >= 1) updateSuggestions(val);
      });

      inputElem.addEventListener('blur', () => {
        setTimeout(() => { dropdownElem.style.display = 'none'; }, 250);
      });

      document.addEventListener('click', (e) => {
        if (!inputElem.contains(e.target) && !dropdownElem.contains(e.target)) {
          dropdownElem.style.display = 'none';
        }
      });
    }

    let customWaypoints = [];
    let currentRouteMode = 'oneway';

    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = 'var(--text-muted)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--bg-pill-active)';
        btn.style.color = '#ffffff';

        currentRouteMode = btn.dataset.mode || 'oneway';

        if (currentRouteMode === 'loop') {
          if (inputEnd) {
            inputEnd.placeholder = "Giro ad Anello (coincide con la partenza)";
            inputEnd.value = inputStart.value ? `${inputStart.value} (Anello)` : '';
            inputEnd.disabled = true;
          }
        } else {
          if (inputEnd) {
            inputEnd.placeholder = "Scrivi la destinazione...";
            if (inputEnd.value.includes('(Anello)')) inputEnd.value = '';
            inputEnd.disabled = false;
          }
        }

        handleCalculateRoutes();
      });
    });

    async function handleCalculateRoutes() {
      if (!routeCardsContainer) return;
      try {
        const startVal = inputStart?.value.trim() || 'Siena';
        const endVal = (currentRouteMode === 'loop') ? startVal : (inputEnd?.value.trim() || 'Asciano');
        const targetKm = 45;

        let startCoords = null;
        let endCoords = null;

        if (inputStart?.dataset.lat && inputStart?.dataset.lng) {
          startCoords = [parseFloat(inputStart.dataset.lat), parseFloat(inputStart.dataset.lng)];
        }
        if (inputEnd?.dataset.lat && inputEnd?.dataset.lng && currentRouteMode !== 'loop') {
          endCoords = [parseFloat(inputEnd.dataset.lat), parseFloat(inputEnd.dataset.lng)];
        }

        routeCardsContainer.innerHTML = `
          <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--brand-primary); margin-bottom: 12px;"></i>
            <div style="font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Calcolo 5 opzioni stradali Strade Bianche...</div>
            <div style="font-size: 0.78rem;">Elaborazione arterie OSRM & profilatura altimetrica</div>
          </div>
        `;

        activeRoutes = await explorerEngine.discoverRoutes(startVal, endVal, targetKm, startCoords, endCoords, customWaypoints, currentRouteMode);
        renderTechnicalSpecCards(activeRoutes);

        mapManager.clearRoutes();
        const firstRoute = activeRoutes[0];
        const actualStartCoords = firstRoute?.startCoords || startCoords || [43.3188, 11.3308];
        const actualEndCoords = firstRoute?.endCoords || endCoords || [43.2356, 11.5744];

        mapManager.addStartEndMarkers(actualStartCoords, actualEndCoords, customWaypoints);

        activeRoutes.forEach(route => {
          mapManager.renderRoutePolyline(route.coords, route.color, false, route.id);
        });

        mapManager.fitBoundsToRoutes();
        if (activeRoutes.length > 0) selectRoute(activeRoutes[0].id);
        mapManager.refreshMapSize();

      } catch (err) {
        console.error("Errore calcolo percorsi:", err);
      }
    };

    if (btnCalculateRoutes) {
      btnCalculateRoutes.addEventListener('click', () => {
        customWaypoints = [];
        handleCalculateRoutes();
      });
    }

    const routeDetailModal = document.getElementById('routeDetailModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnModalCloseAction = document.getElementById('btnModalCloseAction');
    const btnModalExportGpx = document.getElementById('btnModalExportGpx');
    const btnModalSaveFavorite = document.getElementById('btnModalSaveFavorite');
    const modalMultiMetricCanvas = document.getElementById('modalMultiMetricChart');

    function openRouteModal(route) {
      if (!route || !routeDetailModal) return;
      activeModalRoute = route;
      document.getElementById('modalRouteTitle').textContent = route.name;
      document.getElementById('modalRouteColorPill').style.background = route.color;
      
      const safety = route.roadSafety || { badgeClass: 'badge-low-traffic', iconClass: 'fa-shield-halved', badgeText: 'Basso Traffico' };
      const safetyBadge = document.getElementById('modalSafetyBadge');
      if (safetyBadge) {
        safetyBadge.className = `badge ${safety.badgeClass}`;
        safetyBadge.innerHTML = `<i class="fa-solid ${safety.iconClass}"></i> ${safety.badgeText}`;
      }

      const diffBadge = document.getElementById('modalDifficultyBadge');
      if (diffBadge) {
        diffBadge.className = 'badge badge-low-traffic';
        diffBadge.textContent = route.difficulty;
      }

      const catBadge = document.getElementById('modalCategoryBadge');
      if (catBadge) {
        catBadge.className = 'badge badge-med-traffic';
        catBadge.textContent = route.categoryTag || 'Itinerario Ciclistico';
      }

      document.getElementById('modalDistVal').innerHTML = `${route.distanceKm} <span>km</span>`;
      document.getElementById('modalElevGainVal').innerHTML = `${route.elevationGainM} <span>m</span>`;
      document.getElementById('modalMaxGradeVal').textContent = `${route.maxGradePercent}%`;

      const maxEleElem = document.getElementById('modalMaxEleVal');
      if (maxEleElem) {
        maxEleElem.innerHTML = `${route.maxElevationM || 180} <span>m</span>`;
      }

      document.getElementById('modalSpeed20').textContent = route.timeEstimates.speed20;
      document.getElementById('modalSpeed25').textContent = route.timeEstimates.speed25;
      document.getElementById('modalSpeed30').textContent = route.timeEstimates.speed30;

      document.getElementById('modalStreetSummary').innerHTML = route.streetSummary || 'Strade provinciali e vicinali';

      const isFav = favoritesManager.isFavorite(route.id);
      if (btnModalSaveFavorite) {
        btnModalSaveFavorite.innerHTML = `<i class="fa-${isFav ? 'solid' : 'regular'} fa-star" style="color: #f59e0b;"></i> ${isFav ? 'Nei Preferiti' : 'Salva nei Preferiti'}`;
      }

      routeDetailModal.classList.add('active');

      if (modalMultiMetricCanvas) {
        analyticsManager.renderPlannedRouteChart(modalMultiMetricCanvas, route.elevationProfile, route.color, (hoverIdx) => {
          const coord = route.coords[Math.min(hoverIdx, route.coords.length - 1)];
          if (coord) mapManager.updateHoverMarker(coord);
        });
      }
    }

    if (btnModalSaveFavorite) {
      btnModalSaveFavorite.addEventListener('click', () => {
        if (!activeModalRoute) return;
        const targetFolder = prompt("Scegli una cartella per questo percorso:", "Giri del Weekend") || "Giri del Weekend";
        favoritesManager.toggleFavorite(activeModalRoute, targetFolder);
        const isFav = favoritesManager.isFavorite(activeModalRoute.id);
        btnModalSaveFavorite.innerHTML = `<i class="fa-${isFav ? 'solid' : 'regular'} fa-star" style="color: #f59e0b;"></i> ${isFav ? 'Nei Preferiti' : 'Salva nei Preferiti'}`;
        renderTechnicalSpecCards(activeRoutes);
        renderFavoritesUI();
      });
    }

    function closeModal() {
      if (routeDetailModal) {
        routeDetailModal.classList.remove('active');
      }
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnModalCloseAction) btnModalCloseAction.addEventListener('click', closeModal);
    if (btnModalExportGpx) btnModalExportGpx.addEventListener('click', () => plannerManager.exportToGpx());
    if (routeDetailModal) {
      routeDetailModal.addEventListener('click', (e) => {
        if (e.target === routeDetailModal) closeModal();
      });
    }

    // Handle Bryton 420 Modal & Guide Tabs
    const btnBrytonGuide = document.getElementById('btnBrytonGuide');
    const brytonModal = document.getElementById('brytonModal');
    const btnCloseBrytonModal = document.getElementById('btnCloseBrytonModal');
    const btnCloseBrytonAction = document.getElementById('btnCloseBrytonAction');
    const btnBrytonDownloadGpx = document.getElementById('btnBrytonDownloadGpx');
    const brytonRouteName = document.getElementById('brytonRouteName');

    function openBrytonModal() {
      if (!brytonModal) return;
      if (plannerManager.selectedRoute) {
        if (brytonRouteName) brytonRouteName.textContent = plannerManager.selectedRoute.name;
      } else {
        if (brytonRouteName) brytonRouteName.textContent = "Seleziona una rotta sulla mappa prima di scaricare";
      }
      brytonModal.classList.add('active');
    }

    function closeBrytonModal() {
      if (brytonModal) brytonModal.classList.remove('active');
    }

    if (btnBrytonGuide) btnBrytonGuide.addEventListener('click', openBrytonModal);
    if (btnCloseBrytonModal) btnCloseBrytonModal.addEventListener('click', closeBrytonModal);
    if (btnCloseBrytonAction) btnCloseBrytonAction.addEventListener('click', closeBrytonModal);
    if (btnBrytonDownloadGpx) btnBrytonDownloadGpx.addEventListener('click', () => plannerManager.exportToGpx());
    if (brytonModal) {
      brytonModal.addEventListener('click', (e) => {
        if (e.target === brytonModal) closeBrytonModal();
      });
    }

    const brytonTabBtns = document.querySelectorAll('.bryton-tab-btn');
    const brytonTabContents = {
      app: document.getElementById('bTabApp'),
      usb: document.getElementById('bTabUsb'),
      start: document.getElementById('bTabStart')
    };

    brytonTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.btab;
        brytonTabBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = 'var(--text-muted)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--brand-primary)';
        btn.style.color = '#111';

        Object.keys(brytonTabContents).forEach(key => {
          if (brytonTabContents[key]) brytonTabContents[key].style.display = (key === target) ? 'block' : 'none';
        });
      });
    });

    function renderTechnicalSpecCards(routes) {
      if (!routeCardsContainer) return;
      routeCardsContainer.innerHTML = '';

      routes.forEach(route => {
        const card = document.createElement('div');
        card.className = `spec-card ${route.id === selectedRouteId ? 'selected' : ''}`;
        card.dataset.routeId = route.id;

        const safety = route.roadSafety || {
          badgeClass: 'badge-low-traffic',
          iconClass: 'fa-shield-halved',
          badgeText: 'Vicinale / Basso Traffico'
        };

        const isFav = favoritesManager.isFavorite(route.id);

        card.innerHTML = `
          <div class="spec-card-header" style="margin-bottom: 4px;">
            <div class="route-name" style="font-size: 0.84rem;">
              <div class="route-color-pill" style="background: ${route.color};"></div>
              ${route.name}
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button class="fav-star-btn ${isFav ? 'active' : ''}" title="Aggiungi ai preferiti">
                <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
              </button>
              <span class="badge ${safety.badgeClass}">
                <i class="fa-solid ${safety.iconClass}"></i> ${safety.badgeText}
              </span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-input); padding: 6px 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-color); border-left: 3px solid ${route.color};">
            <div style="display: flex; gap: 12px; font-size: 0.82rem; font-weight: 700; font-family: var(--font-mono);">
              <span><i class="fa-solid fa-ruler-horizontal" style="color: var(--brand-primary); font-size: 0.72rem;"></i> ${route.distanceKm} km</span>
              <span><i class="fa-solid fa-mountain" style="color: var(--brand-primary); font-size: 0.72rem;"></i> ${route.elevationGainM}m D+</span>
            </div>
            <button class="btn btn-secondary btn-open-detail" style="padding: 3px 8px; font-size: 0.7rem;">
              <i class="fa-solid fa-expand"></i> Dettagli
            </button>
          </div>
        `;

        card.addEventListener('click', (e) => {
          if (e.target.closest('.fav-star-btn')) {
            e.stopPropagation();
            const folderName = prompt("Salva in quale cartella?", "Giri del Weekend") || "Giri del Weekend";
            favoritesManager.toggleFavorite(route, folderName);
            renderTechnicalSpecCards(routes);
            renderFavoritesUI();
            return;
          }

          selectRoute(route.id);
          if (e.target.closest('.btn-open-detail')) {
            openRouteModal(route);
          }
        });
        routeCardsContainer.appendChild(card);
      });
    }

    function renderFavoritesUI() {
      if (!favoritesContainer || !folderFilterBar) return;
      
      // Render Folder Filter Bar
      folderFilterBar.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.className = `folder-chip ${favoritesManager.activeFolder === 'all' ? 'active' : ''}`;
      allBtn.innerHTML = `<i class="fa-solid fa-folder"></i> Tutti (${favoritesManager.favorites.length})`;
      allBtn.addEventListener('click', () => {
        favoritesManager.activeFolder = 'all';
        renderFavoritesUI();
      });
      folderFilterBar.appendChild(allBtn);

      favoritesManager.folders.forEach(fName => {
        const fRoutes = favoritesManager.getFavoritesByFolder(fName);
        const btn = document.createElement('button');
        btn.className = `folder-chip ${favoritesManager.activeFolder === fName ? 'active' : ''}`;
        btn.innerHTML = `<i class="fa-solid fa-folder-open"></i> ${fName} (${fRoutes.length})`;
        btn.addEventListener('click', () => {
          favoritesManager.activeFolder = fName;
          renderFavoritesUI();
        });
        folderFilterBar.appendChild(btn);
      });

      // Render Favorites Cards
      const favList = favoritesManager.getFavoritesByFolder(favoritesManager.activeFolder);
      if (favList.length === 0) {
        favoritesContainer.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <i class="fa-solid fa-star" style="font-size: 2rem; color: var(--brand-accent); margin-bottom: 10px;"></i>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 4px;">Nessun percorso in questa cartella</div>
            <div style="font-size: 0.78rem; line-height: 1.4; color: var(--text-muted);">
              Salva nuove rotte dalla sezione Esplora cliccando sulla stella <i class="fa-solid fa-star" style="color: #f59e0b;"></i>.
            </div>
          </div>
        `;
        return;
      }

      favoritesContainer.innerHTML = '';
      favList.forEach(route => {
        const card = document.createElement('div');
        card.className = 'spec-card selected';
        card.innerHTML = `
          <div class="spec-card-header" style="margin-bottom: 6px;">
            <div class="route-name" style="font-size: 0.88rem;">
              <i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${route.name}
            </div>
            <span class="badge badge-low-traffic" style="font-size: 0.68rem;">
              📁 ${route.folder || 'Generale'}
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-input); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color);">
            <div style="display: flex; gap: 12px; font-size: 0.82rem; font-weight: 700;">
              <span>${route.distanceKm} km</span>
              <span>${route.elevationGainM}m D+</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-load-fav" style="padding: 3px 8px; font-size: 0.7rem;">
                <i class="fa-solid fa-map"></i> Mappa
              </button>
              <button class="btn btn-primary btn-export-fav" style="padding: 3px 8px; font-size: 0.7rem;">
                <i class="fa-solid fa-download"></i> GPX
              </button>
              <button class="btn btn-secondary btn-delete-fav" style="padding: 3px 6px; font-size: 0.7rem; color: #ef4444;">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        `;

        card.querySelector('.btn-load-fav').addEventListener('click', () => {
          activeRoutes = [route];
          selectRoute(route.id);
          mapManager.clearRoutes();
          mapManager.renderRoutePolyline(route.coords, route.color, true, route.id);
          mapManager.fitBoundsToRoutes();
          document.querySelector('.nav-btn[data-tab="explorer"]')?.click();
        });

        card.querySelector('.btn-export-fav').addEventListener('click', () => {
          plannerManager.setSelectedRoute(route);
          plannerManager.exportToGpx();
        });

        card.querySelector('.btn-delete-fav').addEventListener('click', () => {
          favoritesManager.removeFavorite(route.id);
          renderFavoritesUI();
          renderTechnicalSpecCards(activeRoutes);
        });

        favoritesContainer.appendChild(card);
      });
    }

    if (btnCreateFolder) {
      btnCreateFolder.addEventListener('click', () => {
        const folderName = prompt("Inserisci il nome della nuova cartella:");
        if (folderName && folderName.trim().length > 0) {
          favoritesManager.createFolder(folderName.trim());
          renderFavoritesUI();
        }
      });
    }

    function selectRoute(routeId) {
      selectedRouteId = routeId;
      const route = activeRoutes.find(r => r.id === routeId);
      if (!route) return;

      plannerManager.setSelectedRoute(route);

      document.querySelectorAll('.spec-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.routeId === routeId);
      });

      mapManager.highlightRouteWithSlope(routeId, route.color, route.elevationProfile);

      analyticsManager.renderElevationChart(elevationCanvas, route.elevationProfile, route.color, (hoverIdx) => {
        const coord = route.coords[Math.min(hoverIdx, route.coords.length - 1)];
        if (coord) mapManager.updateHoverMarker(coord);
      });
    }

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const sortType = chip.getAttribute('data-sort');
        if (sortType === 'traffic') activeRoutes.sort((a, b) => a.id.localeCompare(b.id));
        else if (sortType === 'elevation') activeRoutes.sort((a, b) => a.elevationGainM - b.elevationGainM);
        else if (sortType === 'distance') activeRoutes.sort((a, b) => a.distanceKm - b.distanceKm);

        renderTechnicalSpecCards(activeRoutes);
      });
    });

    if (btnExportGpx) btnExportGpx.addEventListener('click', () => plannerManager.exportToGpx());
    if (btnQuickUpload && fileInput) btnQuickUpload.addEventListener('click', () => fileInput.click());
    if (dropZone && fileInput) dropZone.addEventListener('click', () => fileInput.click());

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) processWorkoutFile(e.target.files[0]);
      });
    }

    async function processWorkoutFile(file) {
      try {
        const metrics = await fitParserEngine.parseWorkoutFile(file);
        const resElem = document.getElementById('analysisResults');
        if (resElem) resElem.style.display = 'block';

        mapManager.clearRoutes();
        mapManager.renderRoutePolyline(metrics.coords, '#e6b85c', true, 'user-workout');
        mapManager.fitBoundsToRoutes();

        analyticsManager.renderElevationChart(elevationCanvas, metrics.elevationProfile, '#e6b85c');
        document.querySelector('.nav-btn[data-tab="analysis"]')?.click();
      } catch (err) {
        alert("Errore nella lettura file: " + err.message);
      }
    }

    if (btnToggleChart && elevationPanel) {
      btnToggleChart.addEventListener('click', () => elevationPanel.classList.toggle('collapsed'));
    }

    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const appSidebar = document.getElementById('appSidebar');
    if (btnToggleSidebar && appSidebar) {
      btnToggleSidebar.addEventListener('click', () => {
        appSidebar.classList.toggle('collapsed');
        setTimeout(() => mapManager.refreshMapSize(), 230);
      });
    }

    setTimeout(() => {
      handleCalculateRoutes();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
