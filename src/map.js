/* ==========================================================================
   BIKEROUTE TRACKER - MAP MANAGER (LEAFLET.JS)
   INCLUDES SLOPE GRADIENT POLYLINE & ATHLETIC MARKERS
   ========================================================================== */

export class MapManager {
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

      // Mappa Stradale OSM Standard
      const cycleTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      });

      // Mappa Scura CARTO Rastertiles
      const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      });

      // Mappa Ciclismo CyclOSM
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
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    }
  }

  clearRoutes() {
    this.routeLayers.forEach(layer => this.map.removeLayer(layer));
    this.routeLayers = [];
    this.clearSlopeLayers();
    this.clearMarkers();
  }

  clearSlopeLayers() {
    this.selectedSlopeLayers.forEach(layer => this.map.removeLayer(layer));
    this.selectedSlopeLayers = [];
  }

  clearMarkers() {
    this.markerLayers.forEach(marker => this.map.removeLayer(marker));
    this.markerLayers = [];
    if (this.hoverMarker) {
      this.map.removeLayer(this.hoverMarker);
      this.hoverMarker = null;
    }
  }

  addStartEndMarkers(startLatLng, endLatLng, waypoints = []) {
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

    // Renderizza eventuali Waypoint intermedi
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

  /**
   * Renderizza la rotta selezionata scomposta in segmenti colorati per PENDENZA (%)
   */
  highlightRouteWithSlope(routeId, primaryColor, elevationProfile = []) {
    // Nascondi o abbassa opacità per gli altri layer
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

    // Raggruppa punti adiacenti con lo stesso colore di pendenza per evitare il blocco del DOM
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
        if (distM > 0) {
          grade = ((ele2 - ele1) / distM) * 100;
        }
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
    if (grade < 3) return '#10b981';      // Emerald Mint (<3%)
    if (grade < 6) return '#38bdf8';      // Soft Sky Azure (3-6%)
    if (grade < 9) return '#a855f7';      // Lavender Indigo (6-9%)
    if (grade < 12) return '#f43f5e';     // Soft Crimson Rose (9-12%)
    return '#881337';                     // Deep Burgundy (>12%)
  }

  fitBoundsToRoutes() {
    if (this.routeLayers.length === 0) return;
    const group = new L.featureGroup(this.routeLayers);
    this.map.fitBounds(group.getBounds(), { padding: [40, 40] });
  }

  updateHoverMarker(latLng) {
    if (!this.hoverMarker) {
      const hoverIcon = L.divIcon({
        className: 'hover-point-icon',
        html: `<div style="background: #0066FF; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
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
      this.map.on('click', (e) => {
        callback(e.latlng);
      });
    }
  }
}
