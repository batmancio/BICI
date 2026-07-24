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
  const startAutocomplete = document.getElementById('startAutocomplete');
  const endAutocomplete = document.getElementById('endAutocomplete');
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

  let clickState = 'start';

  // Slider target KM
  const sliderTargetKm = document.getElementById('sliderTargetKm');
  const targetKmValue = document.getElementById('targetKmValue');

  if (sliderTargetKm && targetKmValue) {
    sliderTargetKm.addEventListener('input', (e) => {
      targetKmValue.textContent = e.target.value;
    });

    sliderTargetKm.addEventListener('change', () => {
      handleCalculateRoutes();
    });
  }

  // Setup Autocomplete per Input Partenza & Arrivo
  setupAutocomplete(inputStart, startAutocomplete);
  setupAutocomplete(inputEnd, endAutocomplete);

  function setupAutocomplete(inputElem, dropdownElem) {
    let timeout = null;
    inputElem.addEventListener('input', (e) => {
      clearTimeout(timeout);
      const val = e.target.value.trim();
      if (val.length < 2) {
        dropdownElem.style.display = 'none';
        return;
      }
      timeout = setTimeout(async () => {
        const results = await explorerEngine.searchAddressSuggestions(val);
        if (results.length > 0) {
          dropdownElem.innerHTML = '';
          results.forEach(res => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = res.displayName;
            item.addEventListener('click', () => {
              inputElem.value = res.displayName;
              dropdownElem.style.display = 'none';
              handleCalculateRoutes();
            });
            dropdownElem.appendChild(item);
          });
          dropdownElem.style.display = 'block';
        } else {
          dropdownElem.style.display = 'none';
        }
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (!inputElem.contains(e.target) && !dropdownElem.contains(e.target)) {
        dropdownElem.style.display = 'none';
      }
    });
  }

  const handleCalculateRoutes = async () => {
    const startVal = inputStart.value.trim() || 'Aprilia';
    const endVal = inputEnd.value.trim() || 'Albano Laziale';
    const targetKm = parseInt(sliderTargetKm?.value || '45', 10);

    routeCardsContainer.innerHTML = `
      <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--brand-orange); margin-bottom: 12px;"></i>
        <div style="font-weight: 600; color: white; margin-bottom: 4px;">Calcolo 5 opzioni stradali...</div>
        <div style="font-size: 0.78rem;">Elaborazione arterie OSRM & profilatura altimetrica</div>
      </div>
    `;

    activeRoutes = await explorerEngine.discoverRoutes(startVal, endVal, targetKm);
    renderTechnicalSpecCards(activeRoutes);

    mapManager.clearRoutes();

    const firstRoute = activeRoutes[0];
    const startCoords = firstRoute?.startCoords || [41.5956, 12.6525];
    const endCoords = firstRoute?.endCoords || [41.7288, 12.6582];

    mapManager.addStartEndMarkers(startCoords, endCoords);

    activeRoutes.forEach(route => {
      mapManager.renderRoutePolyline(route.coords, route.color, false, route.id);
    });

    mapManager.fitBoundsToRoutes();

    if (activeRoutes.length > 0) {
      selectRoute(activeRoutes[0].id);
    }
  };

  // Selezione punti cliccando sulla mappa
  mapManager.onMapClick((latLng) => {
    const formattedCoord = `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`;
    if (clickState === 'start') {
      inputStart.value = formattedCoord;
      clickState = 'end';
    } else {
      inputEnd.value = formattedCoord;
      clickState = 'start';
    }
    handleCalculateRoutes();
  });

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
          <span class="badge badge-low-traffic">${route.difficulty}</span>
        </div>

        <div style="font-size: 0.78rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 7px 10px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid ${route.color};">
          <i class="fa-solid fa-road" style="margin-right: 4px; color: var(--brand-orange);"></i> 
          <strong>Itinerario:</strong> ${route.streetSummary}
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

        <div style="display: flex; justify-content: space-between; font-size: 0.73rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 6px;">
          <span>@20km/h: <strong>${route.timeEstimates.speed20}</strong></span>
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

    // Renderizza la traccia selezionata con i colori per PENDENZA (%)
    mapManager.highlightRouteWithSlope(routeId, route.color, route.elevationProfile);

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
        activeRoutes.sort((a, b) => a.id.localeCompare(b.id));
      } else if (sortType === 'elevation') {
        activeRoutes.sort((a, b) => a.elevationGainM - b.elevationGainM);
      } else if (sortType === 'distance') {
        activeRoutes.sort((a, b) => a.distanceKm - b.distanceKm);
      }

      renderTechnicalSpecCards(activeRoutes);
    });
  }

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
          <div class="route-name" style="font-size: 0.9rem;">${act.name}</div>
          <span class="badge badge-low-traffic">${act.date}</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
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
