/* ==========================================================================
   BIKEROUTE TRACKER - MAIN APPLICATION CONTROLLER
   ========================================================================== */

import { MapManager } from './map.js';
import { RouteExplorerEngine } from './routeExplorer.js';
import { PlannerManager } from './planner.js';
import { FitParserEngine } from './fitParser.js';
import { AnalyticsManager } from './analysis.js';
import { StravaSyncEngine } from './stravaSync.js';

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
        tabPanes[key].style.display = (key === targetTab) ? 'block' : 'none';
      });
    });
  });

  const handleCalculateRoutes = async () => {
    const startVal = inputStart.value.trim() || 'Milano';
    const endVal = inputEnd.value.trim() || 'Como';

    const preferences = {
      traffic: document.querySelector('.switch-btn[data-traffic].active')?.getAttribute('data-traffic') || 'high',
      climb: document.querySelector('.switch-btn[data-climb].active')?.getAttribute('data-climb') || 'balanced',
      surface: document.querySelector('.switch-btn[data-surface].active')?.getAttribute('data-surface') || 'road'
    };

    activeRoutes = await explorerEngine.discoverRoutes(startVal, endVal, preferences);
    renderTechnicalSpecCards(activeRoutes);

    mapManager.clearRoutes();
    mapManager.addStartEndMarkers([45.4642, 9.1900], [45.8103, 9.0863]);

    activeRoutes.forEach(route => {
      mapManager.renderRoutePolyline(route.coords, route.color, false, route.id);
    });

    mapManager.fitBoundsToRoutes();

    if (activeRoutes.length > 0) {
      selectRoute(activeRoutes[0].id);
    }
  };

  btnCalculateRoutes.addEventListener('click', handleCalculateRoutes);

  function renderTechnicalSpecCards(routes) {
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
          <span class="badge ${route.badgeClass}">${route.difficulty}</span>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px;">
          <i class="fa-solid fa-shield-halved" style="color: ${route.color}"></i> ${route.trafficBadge}
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

        <div class="surface-breakdown">
          <div class="surface-bar-container">
            <div class="surface-segment surf-asphalt" style="width: ${route.surface.asphaltPercent}%;" title="Asfalto: ${route.surface.asphaltPercent}%"></div>
            <div class="surface-segment surf-cycleway" style="width: ${route.surface.cyclewayPercent}%;" title="Ciclabile: ${route.surface.cyclewayPercent}%"></div>
            <div class="surface-segment surf-gravel" style="width: ${route.surface.gravelPercent}%;" title="Sterrato: ${route.surface.gravelPercent}%"></div>
          </div>
          <div class="surface-legend">
            <div class="surface-item"><div class="dot" style="background: var(--brand-cyan);"></div> Asfalto ${route.surface.asphaltPercent}%</div>
            <div class="surface-item"><div class="dot" style="background: var(--brand-green);"></div> Ciclabile ${route.surface.cyclewayPercent}%</div>
            <div class="surface-item"><div class="dot" style="background: var(--brand-yellow);"></div> Sterrato ${route.surface.gravelPercent}%</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;">
          <span>⏱️ @20km/h: <strong>${route.timeEstimates.speed20}</strong></span>
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

    mapManager.highlightRoute(routeId, route.color);

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
      if (sortType === 'traffic') {
        activeRoutes.sort((a, b) => a.trafficLevel.localeCompare(b.trafficLevel));
      } else if (sortType === 'elevation') {
        activeRoutes.sort((a, b) => a.elevationGainM - b.elevationGainM);
      } else if (sortType === 'distance') {
        activeRoutes.sort((a, b) => a.distanceKm - b.distanceKm);
      }

      renderTechnicalSpecCards(activeRoutes);
    });
  });

  document.querySelectorAll('.switch-group').forEach(group => {
    group.querySelectorAll('.switch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        handleCalculateRoutes();
      });
    });
  });

  btnExportGpx.addEventListener('click', () => {
    plannerManager.exportToGpx();
  });

  btnQuickUpload.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      processWorkoutFile(e.target.files[0]);
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--brand-orange)';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      processWorkoutFile(e.dataTransfer.files[0]);
    }
  });

  async function processWorkoutFile(file) {
    try {
      const metrics = await fitParserEngine.parseWorkoutFile(file);

      document.getElementById('analysisResults').style.display = 'block';
      document.getElementById('workoutDate').textContent = metrics.date;
      document.getElementById('resDist').innerHTML = `${metrics.distanceKm} <span>km</span>`;
      document.getElementById('resElevation').innerHTML = `${metrics.elevationGainM} <span>m</span>`;
      document.getElementById('resAvgSpeed').innerHTML = `${metrics.avgSpeedKmH} <span>km/h</span>`;
      document.getElementById('resMaxSpeed').innerHTML = `${metrics.maxSpeedKmH} <span>km/h</span>`;
      document.getElementById('resAvgHR').innerHTML = `${metrics.avgHeartRateBpm} <span>bpm</span>`;
      document.getElementById('resCadence').innerHTML = `${metrics.avgCadenceRpm} <span>rpm</span>`;
      document.getElementById('resCalories').textContent = `${metrics.caloriesKcal} kcal`;
      document.getElementById('resEffort').textContent = metrics.effortRating;

      mapManager.clearRoutes();
      mapManager.renderRoutePolyline(metrics.coords, '#fc5200', true, 'user-workout');
      mapManager.fitBoundsToRoutes();

      analyticsManager.renderElevationChart(elevationCanvas, metrics.elevationProfile, '#fc5200');

      document.querySelector('.nav-btn[data-tab="analysis"]').click();

    } catch (err) {
      alert("Errore nella lettura del file del Bryton: " + err.message);
    }
  }

  btnConnectStrava.addEventListener('click', () => {
    const activities = stravaSyncEngine.connectStravaAccount();
    const listContainer = document.getElementById('stravaActivitiesList');
    listContainer.innerHTML = '';

    activities.forEach(act => {
      const item = document.createElement('div');
      item.className = 'spec-card';
      item.innerHTML = `
        <div class="spec-card-header">
          <div class="route-name" style="font-size: 0.95rem;">${act.name}</div>
          <span class="badge badge-low-traffic">${act.date}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
          Dispositivo: <strong style="color: var(--brand-orange);">${act.device}</strong>
        </div>
        <div class="spec-metrics-grid">
          <div class="metric-box"><div class="metric-val">${act.distanceKm} <span>km</span></div></div>
          <div class="metric-box"><div class="metric-val">${act.elevationGainM} <span>m</span></div></div>
          <div class="metric-box"><div class="metric-val">${act.avgSpeedKmH} <span>km/h</span></div></div>
        </div>
      `;
      listContainer.appendChild(item);
    });

    alert("Account Strava collegato con successo! Sincronizzazione uscite Bryton completata.");
  });

  btnToggleChart.addEventListener('click', () => {
    elevationPanel.classList.toggle('collapsed');
  });

  handleCalculateRoutes();
});
