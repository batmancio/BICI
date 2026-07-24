/* ==========================================================================
   BIKEROUTE TRACKER - CHART & ANALYTICS MANAGER (CHART.JS)
   ========================================================================== */

export class AnalyticsManager {
  constructor() {
    this.chartInstance = null;
  }

  renderElevationChart(containerCanvas, profileData, routeColor = '#fc5200', onPointHover = null) {
    if (!containerCanvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = containerCanvas.getContext('2d');
    const labels = profileData.map(p => `${p.distanceKm} km`);
    const elevations = profileData.map(p => p.elevationM);

    const gradient = ctx.createLinearGradient(0, 0, 0, 160);
    gradient.addColorStop(0, 'rgba(252, 82, 0, 0.35)');
    gradient.addColorStop(1, 'rgba(17, 23, 38, 0.0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Altimetria (metri)',
          data: elevations,
          borderColor: '#fc5200',
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#fc5200',
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
            backgroundColor: '#111726',
            titleColor: '#f8fafc',
            bodyColor: '#fc5200',
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
            grid: { color: 'rgba(255, 255, 255, 0.03)' },
            ticks: { color: '#64748b', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.03)' },
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
