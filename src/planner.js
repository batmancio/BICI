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

    let gpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="BikeRoute Analytics - Bryton Rider 420"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${this.escapeXml(route.name)}</name>
    <desc>Percorso generato da BikeRoute Analytics. Distanza: ${route.distanceKm}km, D+: ${route.elevationGainM}m</desc>
    <time>${nowISO}</time>
  </metadata>
  <trk>
    <name>${this.escapeXml(route.name)}</name>
    <type>Cycling</type>
    <trkseg>
`;

    const coords = route.coords;
    const profile = route.elevationProfile;

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
