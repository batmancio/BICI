/* ==========================================================================
   BIKEROUTE TRACKER - CHART & ANALYTICS MANAGER (CHART.JS)
   ========================================================================== */

export class AnalyticsManager {
  constructor() {
    this.chartInstance = null;
  }

  renderElevationChart(containerCanvas, profileData, routeColor, onPointHover = null) {
    if (!containerCanvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = containerCanvas.getContext('2d');
    const labels = profileData.map(p => `${p.distanceKm} km`);
    const elevations = profileData.map(p => p.elevationM);

    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, routeColor + '88');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Altimetria (metri)',
          data: elevations,
          borderColor: routeColor,
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#00f2fe',
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
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#00f2fe',
            borderColor: 'rgba(255, 255, 255, 0.1)',
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
            ticks: { color: '#64748b', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#64748b', font: { size: 10 } }
          }
        },
        onHover: (event, activeElements) => {
          if (activeElements.length > 0 && onPointHover) {
            const index = activeElements[0].index;
            onPointHover(index);
          }
        }
      }
    });
  }
}
