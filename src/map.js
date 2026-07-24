/* ==========================================================================
   BIKEROUTE TRACKER - MAP MANAGER (LEAFLET.JS)
   ========================================================================== */

export class MapManager {
  constructor(containerId) {
    this.map = null;
    this.routeLayers = [];
    this.markerLayers = [];
    this.hoverMarker = null;
    this.initMap(containerId);
  }

  initMap(containerId) {
    this.map = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView([45.4642, 9.1900], 11);

    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    });

    const cycleTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    darkTileLayer.addTo(this.map);

    const baseMaps = {
      "Mappa Scura (Consigliata)": darkTileLayer,
      "Mappa Stradale / Ciclabile": cycleTileLayer
    };
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(this.map);
  }

  clearRoutes() {
    this.routeLayers.forEach(layer => this.map.removeLayer(layer));
    this.routeLayers = [];
    this.clearMarkers();
  }

  clearMarkers() {
    this.markerLayers.forEach(marker => this.map.removeLayer(marker));
    this.markerLayers = [];
    if (this.hoverMarker) {
      this.map.removeLayer(this.hoverMarker);
      this.hoverMarker = null;
    }
  }

  addStartEndMarkers(startLatLng, endLatLng) {
    this.clearMarkers();

    const startIcon = L.divIcon({
      className: 'custom-map-icon start-icon',
      html: `<div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"><i class="fa-solid fa-play" style="font-size: 12px; margin-left: 2px;"></i></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const endIcon = L.divIcon({
      className: 'custom-map-icon end-icon',
      html: `<div style="background: #ef4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"><i class="fa-solid fa-flag-checkered" style="font-size: 14px;"></i></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const startMarker = L.marker(startLatLng, { icon: startIcon }).addTo(this.map);
    const endMarker = L.marker(endLatLng, { icon: endIcon }).addTo(this.map);

    this.markerLayers.push(startMarker, endMarker);
  }

  renderRoutePolyline(coordinates, color, isSelected = false, routeId = '') {
    const polyline = L.polyline(coordinates, {
      color: color,
      weight: isSelected ? 6 : 4,
      opacity: isSelected ? 0.95 : 0.45,
      smoothFactor: 1
    }).addTo(this.map);

    polyline.routeId = routeId;
    this.routeLayers.push(polyline);
    return polyline;
  }

  highlightRoute(routeId, primaryColor) {
    this.routeLayers.forEach(layer => {
      if (layer.routeId === routeId) {
        layer.setStyle({ weight: 7, opacity: 1, color: primaryColor });
        layer.bringToFront();
      } else {
        layer.setStyle({ weight: 4, opacity: 0.3 });
      }
    });
  }

  fitBoundsToRoutes() {
    if (this.routeLayers.length === 0) return;
    const group = new L.featureGroup(this.routeLayers);
    this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
  }

  updateHoverMarker(latLng) {
    if (!this.hoverMarker) {
      const hoverIcon = L.divIcon({
        className: 'hover-point-icon',
        html: `<div style="background: #00f2fe; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px #00f2fe;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
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
