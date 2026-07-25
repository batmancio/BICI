/* ==========================================================================
   BIKEROUTE TRACKER - CHART & ANALYTICS MANAGER (CHART.JS)
   ========================================================================== */

export class AnalyticsManager {
  constructor() {
    this.chartInstance = null;
  }

  renderElevationChart(containerCanvas, profileData, routeColor = '#0066FF', onPointHover = null) {
    if (!containerCanvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = containerCanvas.getContext('2d');
    const labels = profileData.map(p => `${p.distanceKm} km`);
    const elevations = profileData.map(p => p.elevationM);

    const activeColor = routeColor || '#0066FF';

    const gradient = ctx.createLinearGradient(0, 0, 0, 160);
    gradient.addColorStop(0, activeColor + '33');
    gradient.addColorStop(1, activeColor + '00');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Altimetria (metri)',
          data: elevations,
          borderColor: activeColor,
          borderWidth: 2.5,
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
        layout: {
          padding: { top: 4, bottom: 6, left: 6, right: 12 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#1a1d20',
            bodyColor: activeColor,
            borderColor: '#e2e8f0',
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
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 10, maxRotation: 0, padding: 2 }
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 } }
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

  renderPlannedRouteChart(containerCanvas, profileData, routeColor = '#0066FF', onPointHover = null) {
    if (!containerCanvas) return;

    if (containerCanvas._chartInstance) {
      containerCanvas._chartInstance.destroy();
      containerCanvas._chartInstance = null;
    }

    const ctx = containerCanvas.getContext('2d');
    const labels = profileData.map(p => `${p.distanceKm}km`);
    const elevations = profileData.map(p => p.elevationM);
    const slopes = profileData.map(p => p.slopeGrade || 0);

    const activeColor = routeColor || '#0066FF';

    const gradient = ctx.createLinearGradient(0, 0, 0, 160);
    gradient.addColorStop(0, activeColor + '33');
    gradient.addColorStop(1, activeColor + '00');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Quota Altimetrica (m s.l.m.)',
            data: elevations,
            borderColor: activeColor,
            borderWidth: 2.5,
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: activeColor,
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2,
            yAxisID: 'yElevation'
          },
          {
            label: 'Pendenza Stimata (%)',
            data: slopes,
            borderColor: '#c85a32',
            borderWidth: 1.5,
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#c85a32',
            yAxisID: 'ySlope'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        layout: {
          padding: { top: 4, bottom: 6, left: 6, right: 12 }
        },
        plugins: {
          legend: {
            display: true,
            labels: { color: '#64748b', font: { size: 10 }, boxWidth: 12 }
          },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#1a1d20',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              title: (items) => `Km percorsi: ${items[0].label}`,
              label: (context) => {
                if (context.datasetIndex === 0) {
                  return `Quota: ${context.parsed.y} m s.l.m.`;
                } else {
                  const val = context.parsed.y;
                  return `Pendenza: ${val >= 0 ? '+' : ''}${val}%`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 10, maxRotation: 0, padding: 2 }
          },
          yElevation: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 } },
            title: { display: true, text: 'Quota (m)', color: '#64748b', font: { size: 9 } }
          },
          ySlope: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
              color: '#c85a32',
              font: { size: 9 },
              callback: (val) => `${val}%`
            },
            title: { display: true, text: 'Pendenza (%)', color: '#c85a32', font: { size: 9 } }
          }
        },
        onHover: (event, activeElements) => {
          if (activeElements && activeElements.length > 0 && onPointHover) {
            const index = activeElements[0].index;
            onPointHover(index);
          }
        }
      }
    });

    containerCanvas._chartInstance = chart;
  }

  renderMultiMetricChart(containerCanvas, profileData, routeColor = '#0ea5e9', workoutData = null) {
    if (!containerCanvas) return;

    if (containerCanvas._chartInstance) {
      containerCanvas._chartInstance.destroy();
      containerCanvas._chartInstance = null;
    }

    const ctx = containerCanvas.getContext('2d');
    const labels = profileData.map(p => `${p.distanceKm}km`);
    const elevations = profileData.map(p => p.elevationM);

    // Usa SOLO telemetria reale se presente nel file di allenamento caricato
    if (!workoutData) {
      this.renderPlannedRouteChart(containerCanvas, profileData, routeColor);
      return;
    }

    const speeds = workoutData.speeds || [];
    const cadences = workoutData.cadences || [];
    const heartRates = workoutData.heartRates || [];

    const datasets = [
      {
        label: 'Quota (m)',
        data: elevations,
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        yAxisID: 'y1',
        tension: 0.2,
        pointRadius: 0
      }
    ];

    if (speeds.length > 0) {
      datasets.push({
        label: 'Velocità (km/h)',
        data: speeds,
        borderColor: '#f59e0b',
        borderWidth: 1.5,
        yAxisID: 'y2',
        tension: 0.2,
        pointRadius: 0
      });
    }

    if (cadences.length > 0) {
      datasets.push({
        label: 'Cadenza (rpm)',
        data: cadences,
        borderColor: '#22c55e',
        borderWidth: 1.2,
        yAxisID: 'y2',
        tension: 0.2,
        pointRadius: 0
      });
    }

    if (heartRates.length > 0) {
      datasets.push({
        label: 'Frequenza C. (bpm)',
        data: heartRates,
        borderColor: '#3b82f6',
        borderWidth: 1.5,
        yAxisID: 'y1',
        tension: 0.2,
        pointRadius: 0
      });
    }

    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        layout: {
          padding: { top: 4, bottom: 6, left: 6, right: 12 }
        },
        plugins: {
          legend: {
            display: true,
            labels: { color: '#64748b', font: { size: 10 }, boxWidth: 12 }
          },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#1a1d20',
            borderColor: '#e2e8f0',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 10, maxRotation: 0, padding: 2 }
          },
          y1: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 } },
            title: { display: true, text: 'Quota (m) / HR (bpm)', color: '#64748b', font: { size: 9 } }
          },
          y2: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#64748b', font: { size: 9 } },
            title: { display: true, text: 'Velocità (km/h) / Cadence (rpm)', color: '#64748b', font: { size: 9 } }
          }
        }
      }
    });

    containerCanvas._chartInstance = chart;
  }
}
