/* ==========================================================================
   BIKEROUTE TRACKER - CHART & ANALYTICS MANAGER (CHART.JS)
   ========================================================================== */

export class AnalyticsManager {
  constructor() {
    this.chartInstance = null;
  }

  renderElevationChart(containerCanvas, profileData, routeColor = '#0ea5e9', onPointHover = null) {
    if (!containerCanvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

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
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111b21',
            titleColor: '#e9edef',
            bodyColor: '#00a884',
            borderColor: '#222d34',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => `Distanza: ${items[0].label}`,
              label: (context) => `Quota: ${context.parsed.y} m s.l.m.`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#8696a0', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#8696a0', font: { size: 10 } }
          }
        },
        onHover: (event, activeElements) => {
          if (activeElements.length > 0 && onPointHover) {
            const index = activeElements[0].index;
            onPointHover(index);
          }
        }
      }
  renderMultiMetricChart(containerCanvas, profileData, routeColor = '#0ea5e9', workoutData = null) {
    if (!containerCanvas) return;

    const ctx = containerCanvas.getContext('2d');
    const labels = profileData.map(p => `${p.distanceKm}km`);
    const elevations = profileData.map(p => p.elevationM);

    // Stima o lettura telemetria reale (Velocità, Cadenza, Frequenza Cardiaca)
    const speeds = workoutData?.speeds || profileData.map((p, i) => Math.round(24 + Math.sin(i / 3) * 6 + Math.cos(i / 2) * 3));
    const cadences = workoutData?.cadences || profileData.map((p, i) => Math.round(82 + Math.sin(i / 2) * 12));
    const heartRates = workoutData?.heartRates || profileData.map((p, i) => Math.round(145 + (p.elevationM > 200 ? 20 : 0) + Math.sin(i / 4) * 10));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Quota (m)',
            data: elevations,
            borderColor: '#94a3b8', // Linea grigio/argento dello screenshot
            borderWidth: 1.5,
            yAxisID: 'y1',
            tension: 0.2,
            pointRadius: 0
          },
          {
            label: 'Velocità (km/h)',
            data: speeds,
            borderColor: '#f59e0b', // Linea gialla/arancio
            borderWidth: 1.5,
            yAxisID: 'y2',
            tension: 0.2,
            pointRadius: 0
          },
          {
            label: 'Cadenza (rpm)',
            data: cadences,
            borderColor: '#22c55e', // Linea verde brillante
            borderWidth: 1.2,
            yAxisID: 'y2',
            tension: 0.2,
            pointRadius: 0
          },
          {
            label: 'Frequenza C. (bpm)',
            data: heartRates,
            borderColor: '#3b82f6', // Linea blu
            borderWidth: 1.5,
            yAxisID: 'y1',
            tension: 0.2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            labels: { color: '#8696a0', font: { size: 10 }, boxWidth: 12 }
          },
          tooltip: {
            backgroundColor: '#111b21',
            titleColor: '#e9edef',
            borderColor: '#222d34',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#8696a0', font: { size: 9 } }
          },
          y1: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#8696a0', font: { size: 9 } },
            title: { display: true, text: 'Quota (m) / HR (bpm)', color: '#8696a0', font: { size: 9 } }
          },
          y2: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#8696a0', font: { size: 9 } },
            title: { display: true, text: 'Velocità (km/h) / Cadence (rpm)', color: '#8696a0', font: { size: 9 } }
          }
        }
      }
    });
  }
}
