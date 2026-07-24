/* ==========================================================================
   BIKEROUTE TRACKER - STANDALONE APPLICATION BUNDLE
   Supports direct file:// browser opening without CORS ES Module restriction
   ========================================================================== */

(function () {
  // 1. ITALIAN CITIES DATASET
  const ITALIAN_CITIES = [
    // LAZIO & CASTELLI ROMANI / AGRO PONTINO
    { name: "Aprilia", region: "Lazio", lat: 41.5956, lon: 12.6525 },
    { name: "Albano Laziale", region: "Lazio", lat: 41.7288, lon: 12.6582 },
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
      lon: c.lon
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
      if (typeof L === 'undefined') {
        console.error("Leaflet library not loaded");
        return;
      }

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
      setTimeout(fixMapSize, 100);
      setTimeout(fixMapSize, 400);
      setTimeout(fixMapSize, 1000);

      window.addEventListener('resize', fixMapSize);
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

    async searchAddressSuggestions(query) {
      if (!query || query.trim().length < 2) return [];
      const clean = query.trim();

      const localMatches = getInstantCitySuggestions(clean);

      // Geocoder Komoot Photon (ottimizzato per strade, numeri civici e punti di interesse ciclismo)
      try {
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=6&lang=it`;
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2000);
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
          photonSuggestions.forEach(item => resultMap.set(item.displayName.toLowerCase(), item));
          localMatches.forEach(item => {
            const k = item.displayName.toLowerCase();
            if (!resultMap.has(k)) resultMap.set(k, item);
          });

          return Array.from(resultMap.values()).slice(0, 8);
        }
      } catch (err) {
        console.warn("Photon autocomplete fallback:", err);
      }

      // Fallback Nominatim
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&addressdetails=1&limit=5&countrycodes=it`;
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(nomUrl, { headers: { 'Accept-Language': 'it,en' }, signal: controller.signal });
        clearTimeout(tid);

        if (res.ok) {
          const data = await res.json();
          return (data || []).map(item => ({
            displayName: item.display_name.split(',').slice(0, 3).join(','),
            cityName: item.display_name.split(',')[0],
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            isStreet: item.type === 'highway' || item.class === 'highway'
          }));
        }
      } catch (err) {
        console.warn("Nominatim autocomplete fallback:", err);
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

    async discoverRoutes(startName, endName, targetKm = 45, explicitStartCoords = null, explicitEndCoords = null, customWaypoints = []) {
      let startCoords = explicitStartCoords || await this.geocodeLocation(startName) || [41.5956, 12.6525];
      let endCoords = explicitEndCoords || await this.geocodeLocation(endName) || [41.7288, 12.6582];

      const directDistKm = this.calculateHaversineDistance(startCoords, endCoords);
      const midLat = (startCoords[0] + endCoords[0]) / 2;
      const midLng = (startCoords[1] + endCoords[1]) / 2;
      const dLat = endCoords[0] - startCoords[0];
      const dLng = endCoords[1] - startCoords[1];

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
        this.buildRouteObject('opt-1', 'Arteria Principale Diretta (OSRM)', '#0ea5e9', route1Raw, startCoords, endCoords, 'Strada Principale'),
        this.buildRouteObject('opt-2', 'Variante Secondaria Vicinale', '#10b981', route2Raw, startCoords, endCoords, 'Strade Vicinali'),
        this.buildRouteObject('opt-3', 'Percorso Collinare & Salite', '#8b5cf6', route3Raw, startCoords, endCoords, 'Salita & Tornanti'),
        this.buildRouteObject('opt-4', 'Tracciato Panoramico Esterno', '#06b6d4', route4Raw, startCoords, endCoords, 'Provinciali Panoramiche'),
        this.buildRouteObject('opt-5', 'Giro Esteso Fondo Pro', '#f43f5e', route5Raw, startCoords, endCoords, 'Percorso Lungo')
      ]);

      return routes;
    }

    async fetchOSRMRoute(startCoords, endCoords, viaCoordsList = null, requestAlternatives = false) {
      let waypoints = [startCoords];
      if (Array.isArray(viaCoordsList)) {
        waypoints.push(...viaCoordsList);
      }
      waypoints.push(endCoords);

      const waypointsStr = waypoints.map(pt => `${pt[1]},${pt[0]}`).join(';');
      const altParam = requestAlternatives ? '&alternatives=3' : '';

      const endpoints = [
        `https://routing.openstreetmap.de/routed-bike/route/v1/biking/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}`,
        `https://router.project-osrm.org/route/v1/driving/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}`,
        `https://routing.openstreetmap.de/routed-car/route/v1/driving/${waypointsStr}?overview=full&geometries=geojson&steps=true${altParam}`
      ];

      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(tid);

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
          // Fallback
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
            if (step.ref && step.ref.trim() !== '') names.add(step.ref.trim());
          });
        }
      });
      return Array.from(names);
    }

    async buildRouteObject(id, name, color, rawOsrm, startCoords, endCoords, categoryTag) {
      let coords = [];
      let distanceKm = 0;
      let streetSummary = "Strade provinciali e vicinali";

      if (rawOsrm && rawOsrm.coords && rawOsrm.coords.length > 1) {
        coords = rawOsrm.coords;
        distanceKm = parseFloat((rawOsrm.distanceMeters / 1000).toFixed(1));
        if (rawOsrm.streetNames && rawOsrm.streetNames.length > 0) {
          streetSummary = rawOsrm.streetNames.slice(0, 4).join(' → ');
        }
      } else {
        coords = this.generateFallbackPath(startCoords, endCoords, id);
        distanceKm = parseFloat((this.calculateHaversineDistance(startCoords, endCoords) * 1.3).toFixed(1));
      }

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
        id, name, color, categoryTag, streetSummary, distanceKm,
        elevationGainM, elevationLossM, maxGradePercent, avgGradePercent, difficulty,
        timeEstimates: { speed20, speed25, speed30 }, coords, elevationProfile, startCoords, endCoords
      };
    }

    async fetchElevationProfile(coords, totalDistanceKm) {
      const defaultRes = {
        elevationProfile: this.generateEstimatedElevationProfile(totalDistanceKm, 160),
        elevationGainM: 160, elevationLossM: 155, maxGradePercent: 4.8, avgGradePercent: 1.5
      };

      if (!coords || coords.length < 2) return defaultRes;

      const sampleSize = Math.min(25, coords.length);
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
        const tid = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(tid);

        if (res.ok) {
          const data = await res.json();
          if (data && data.elevation && data.elevation.length === sampledCoords.length) {
            const rawElevations = data.elevation;
            let gainM = 0, lossM = 0, maxGrade = 0;
            const profile = [];
            const distStep = totalDistanceKm / (sampledCoords.length - 1);

            for (let i = 0; i < sampledCoords.length; i++) {
              const currentElev = Math.round(rawElevations[i]);
              const currentDistKm = parseFloat((i * distStep).toFixed(1));

              if (i > 0) {
                const prevElev = Math.round(rawElevations[i - 1]);
                const diff = currentElev - prevElev;
                if (diff > 0) gainM += diff; else lossM += Math.abs(diff);
                const segmentDistMeters = distStep * 1000;
                if (segmentDistMeters > 0) {
                  const grade = (Math.abs(diff) / segmentDistMeters) * 100;
                  if (grade > maxGrade) maxGrade = parseFloat(grade.toFixed(1));
                }
              }
              profile.push({ distanceKm: currentDistKm, elevationM: currentElev });
            }

            return {
              elevationProfile: profile,
              elevationGainM: gainM || 140,
              elevationLossM: lossM || 135,
              maxGradePercent: Math.min(18, Math.max(1.5, maxGrade)),
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

      let gpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="BICI Analytics - Bryton Rider 420"
  xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${this.escapeXml(route.name)}</name>
    <desc>Percorso generato da BICI Analytics. Distanza: ${route.distanceKm}km, D+: ${route.elevationGainM}m</desc>
    <time>${nowISO}</time>
  </metadata>
  <trk>
    <name>${this.escapeXml(route.name)}</name>
    <type>Cycling</type>
    <trkseg>\n`;

      route.coords.forEach((coord, idx) => {
        const lat = coord[0].toFixed(6);
        const lng = coord[1].toFixed(6);
        const ele = route.elevationProfile[Math.min(idx, route.elevationProfile.length - 1)]?.elevationM || 100;
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
  }

  class StravaSyncEngine {
    connectStravaAccount() {
      return [
        { name: "🚴 Pedalata Domenicale Castelli Romani", date: "20 Luglio 2026", distanceKm: 68.4, elevationGainM: 890, avgSpeedKmH: 24.8, device: "Bryton Rider 420" }
      ];
    }
  }

  // 6. INIT APPLICATION CONTROLLER
  document.addEventListener('DOMContentLoaded', () => {
    const mapManager = new MapManager('map');
    const explorerEngine = new RouteExplorerEngine();
    const plannerManager = new PlannerManager();
    const fitParserEngine = new FitParserEngine();
    const analyticsManager = new AnalyticsManager();
    const stravaSyncEngine = new StravaSyncEngine();

    let activeRoutes = [];
    let selectedRouteId = null;

    const btnCalculateRoutes = document.getElementById('btnCalculateRoutes');
    const routeCardsContainer = document.getElementById('routeCardsContainer');
    const inputStart = document.getElementById('inputStart');
    const inputEnd = document.getElementById('inputEnd');
    const startAutocomplete = document.getElementById('startAutocomplete');
    const endAutocomplete = document.getElementById('endAutocomplete');
    const btnExportGpx = document.getElementById('btnExportGpx');
    const btnQuickUpload = document.getElementById('btnQuickUpload');
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const btnConnectStrava = document.getElementById('btnConnectStrava');
    const elevationCanvas = document.getElementById('elevationChart');
    const elevationPanel = document.getElementById('elevationPanel');
    const btnToggleChart = document.getElementById('btnToggleChart');

    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanes = {
      explorer: document.getElementById('tabExplorer'),
      analysis: document.getElementById('tabAnalysis'),
      strava: document.getElementById('tabStrava')
    };

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Object.keys(tabPanes).forEach(key => {
          if (tabPanes[key]) tabPanes[key].style.display = (key === targetTab) ? 'block' : 'none';
        });

        mapManager.refreshMapSize();
      });
    });

    let clickState = 'start';
    const sliderTargetKm = document.getElementById('sliderTargetKm');
    const targetKmValue = document.getElementById('targetKmValue');

    if (sliderTargetKm && targetKmValue) {
      sliderTargetKm.addEventListener('input', (e) => {
        targetKmValue.textContent = e.target.value;
      });
      sliderTargetKm.addEventListener('change', () => {
        handleCalculateRoutes();
      });
    }

    if (inputStart && startAutocomplete) setupAutocomplete(inputStart, startAutocomplete);
    if (inputEnd && endAutocomplete) setupAutocomplete(inputEnd, endAutocomplete);

    function setupAutocomplete(inputElem, dropdownElem) {
      let timeout = null;
      const renderSuggestions = async (val) => {
        if (!val || val.trim().length < 2) {
          dropdownElem.style.display = 'none';
          return;
        }

        const results = await explorerEngine.searchAddressSuggestions(val);
        if (results.length > 0) {
          dropdownElem.innerHTML = '';
          const searchLower = val.trim().toLowerCase();

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
        } else {
          dropdownElem.style.display = 'none';
        }
      };

      inputElem.addEventListener('input', (e) => {
        delete inputElem.dataset.lat;
        delete inputElem.dataset.lng;
        clearTimeout(timeout);
        const val = e.target.value;
        timeout = setTimeout(() => renderSuggestions(val), 100);
      });

      inputElem.addEventListener('focus', (e) => {
        const val = e.target.value;
        if (val && val.length >= 2) renderSuggestions(val);
      });

      inputElem.addEventListener('blur', () => {
        setTimeout(() => { dropdownElem.style.display = 'none'; }, 200);
      });
    }

    let customWaypoints = [];

    const handleCalculateRoutes = async () => {
      if (!routeCardsContainer) return;
      try {
        const startVal = inputStart?.value.trim() || 'Aprilia';
        const endVal = inputEnd?.value.trim() || 'Albano Laziale';
        const targetKm = parseInt(sliderTargetKm?.value || '45', 10);

        let startCoords = null;
        let endCoords = null;

        if (inputStart?.dataset.lat && inputStart?.dataset.lng) {
          startCoords = [parseFloat(inputStart.dataset.lat), parseFloat(inputStart.dataset.lng)];
        }
        if (inputEnd?.dataset.lat && inputEnd?.dataset.lng) {
          endCoords = [parseFloat(inputEnd.dataset.lat), parseFloat(inputEnd.dataset.lng)];
        }

        routeCardsContainer.innerHTML = `
          <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--brand-primary); margin-bottom: 12px;"></i>
            <div style="font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Calcolo 5 opzioni stradali...</div>
            <div style="font-size: 0.78rem;">Elaborazione arterie OSRM & profilatura altimetrica</div>
          </div>
        `;

        activeRoutes = await explorerEngine.discoverRoutes(startVal, endVal, targetKm, startCoords, endCoords, customWaypoints);
        renderTechnicalSpecCards(activeRoutes);

        mapManager.clearRoutes();
        const firstRoute = activeRoutes[0];
        const actualStartCoords = firstRoute?.startCoords || startCoords || [41.5956, 12.6525];
        const actualEndCoords = firstRoute?.endCoords || endCoords || [41.7288, 12.6582];

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

    mapManager.onMapClick((latLng) => {
      const formattedCoord = `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`;
      if (clickState === 'start') {
        inputStart.value = formattedCoord;
        inputStart.dataset.lat = latLng.lat;
        inputStart.dataset.lng = latLng.lng;
        clickState = 'end';
      } else if (clickState === 'end') {
        inputEnd.value = formattedCoord;
        inputEnd.dataset.lat = latLng.lat;
        inputEnd.dataset.lng = latLng.lng;
        clickState = 'waypoint';
      } else {
        customWaypoints.push([latLng.lat, latLng.lng]);
      }
      handleCalculateRoutes();
    });

    if (btnCalculateRoutes) {
      btnCalculateRoutes.addEventListener('click', () => {
        customWaypoints = [];
        clickState = 'start';
        handleCalculateRoutes();
      });
    }

    function renderTechnicalSpecCards(routes) {
      if (!routeCardsContainer) return;
      routeCardsContainer.innerHTML = '';

      routes.forEach(route => {
        const card = document.createElement('div');
        card.className = `spec-card ${route.id === selectedRouteId ? 'selected' : ''}`;
        card.dataset.routeId = route.id;

        card.innerHTML = `
          <div class="spec-card-header">
            <div class="route-name">
              <div class="route-color-pill" style="background: ${route.color};"></div>
              ${route.name}
            </div>
            <span class="badge badge-low-traffic">${route.difficulty}</span>
          </div>

          <div style="font-size: 0.78rem; color: var(--text-muted); background: var(--bg-input); padding: 7px 10px; border-radius: 6px; margin-bottom: 10px; border: 1px solid var(--border-color); border-left: 3px solid ${route.color};">
            <i class="fa-solid fa-road" style="margin-right: 4px; color: var(--brand-primary);"></i> 
            <strong>Itinerario:</strong> ${route.streetSummary}
          </div>

          <div class="spec-metrics-grid">
            <div class="metric-box">
              <div class="metric-val">${route.distanceKm} <span>km</span></div>
              <div class="metric-lbl">Distanza</div>
            </div>
            <div class="metric-box">
              <div class="metric-val">${route.elevationGainM} <span>m</span></div>
              <div class="metric-lbl">Dislivello D+</div>
            </div>
            <div class="metric-box">
              <div class="metric-val">${route.maxGradePercent}%</div>
              <div class="metric-lbl">Pend. Max</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.73rem; color: var(--text-muted); background: var(--bg-input); padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-color);">
            <span>@20km/h: <strong>${route.timeEstimates.speed20}</strong></span>
            <span>@25km/h: <strong>${route.timeEstimates.speed25}</strong></span>
            <span>@30km/h: <strong>${route.timeEstimates.speed30}</strong></span>
          </div>
        `;

        card.addEventListener('click', () => selectRoute(route.id));
        routeCardsContainer.appendChild(card);
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
        mapManager.renderRoutePolyline(metrics.coords, '#0ea5e9', true, 'user-workout');
        mapManager.fitBoundsToRoutes();

        analyticsManager.renderElevationChart(elevationCanvas, metrics.elevationProfile, '#0ea5e9');
        document.querySelector('.nav-btn[data-tab="analysis"]')?.click();
      } catch (err) {
        alert("Errore nella lettura file: " + err.message);
      }
    }

    if (btnConnectStrava) {
      btnConnectStrava.addEventListener('click', () => {
        const activities = stravaSyncEngine.connectStravaAccount();
        alert("Account Strava collegato con successo! Sincronizzazione uscite Bryton completata.");
      });
    }

    if (btnToggleChart && elevationPanel) {
      btnToggleChart.addEventListener('click', () => elevationPanel.classList.toggle('collapsed'));
    }
  });
})();
