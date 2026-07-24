/* ==========================================================================
   BIKEROUTE TRACKER - STRAVA API CLOUD SYNC MODULE
   ========================================================================== */

export class StravaSyncEngine {
  constructor() {
    this.isConnected = false;
  }

  connectStravaAccount() {
    this.isConnected = true;
    return this.getMockStravaActivities();
  }

  getMockStravaActivities() {
    return [
      {
        id: 101,
        name: "🚴 Pedalata Domenicale in Grigna & Vallassina",
        date: "20 Luglio 2026",
        distanceKm: 68.4,
        elevationGainM: 890,
        movingTime: "2h 45m",
        avgSpeedKmH: 24.8,
        device: "Bryton Rider 420 (via Bryton Active)"
      },
      {
        id: 102,
        name: "⚡ Allenamento Interval Training Basso Lago",
        date: "17 Luglio 2026",
        distanceKm: 42.1,
        elevationGainM: 210,
        movingTime: "1h 22m",
        avgSpeedKmH: 30.7,
        device: "Bryton Rider 420 (via Bryton Active)"
      }
    ];
  }
}
