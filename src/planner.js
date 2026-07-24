/* ==========================================================================
   BIKEROUTE TRACKER - ROUTE PLANNER & BRYTON 420 GPX EXPORTER
   ========================================================================== */

export class PlannerManager {
  constructor() {
    this.selectedRoute = null;
  }

  setSelectedRoute(route) {
    this.selectedRoute = route;
  }

  exportToGpx() {
    if (!this.selectedRoute) {
      alert("Seleziona prima una scheda tecnica sulla mappa!");
      return;
    }

    const route = this.selectedRoute;
    const nowISO = new Date().toISOString();

    // Trova il punto di massima altitudine e pendenza max per i POI del Bryton 420
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

  <!-- POI WAYPOINTS PER BRYTON RIDER 420 (Dist. da POI & Salita a POI) -->
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
    <trkseg>
`;

    coords.forEach((coord, idx) => {
      const lat = coord[0].toFixed(6);
      const lng = coord[1].toFixed(6);
      const ele = profile[Math.min(idx, profile.length - 1)]?.elevationM || 100;

      gpxXml += `      <trkpt lat="${lat}" lon="${lng}">\n`;
      gpxXml += `        <ele>${ele}</ele>\n`;
      gpxXml += `      </trkpt>\n`;
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
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }
}

