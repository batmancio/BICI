/* ==========================================================================
   BIKEROUTE TRACKER - MAIN APPLICATION CONTROLLER
   ========================================================================== */

import { MapManager } from './map.js';
import { RouteExplorerEngine } from './routeExplorer.js';
import { PlannerManager } from './planner.js';
import { FitParserEngine } from './fitParser.js';
import { AnalyticsManager } from './analysis.js';
import { StravaSyncEngine } from './stravaSync.js';

function initApp() {
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

      mapManager.refreshMapSize();
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

  // Setup Autocomplete per Input Partenza & Arrivo (Istantaneo da 1 carattere + Arricchimento online)
  setupAutocomplete(inputStart, startAutocomplete);
  setupAutocomplete(inputEnd, endAutocomplete);

  function setupAutocomplete(inputElem, dropdownElem) {
    if (!inputElem || !dropdownElem) return;
    let timeout = null;

    const drawDropdown = (results, searchVal) => {
      if (!results || results.length === 0) {
        dropdownElem.style.display = 'none';
        return;
      }
      dropdownElem.innerHTML = '';
      const searchLower = searchVal.trim().toLowerCase();

      results.forEach(res => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';

        const text = res.displayName;
        const lowerText = text.toLowerCase();
        const matchIdx = lowerText.indexOf(searchLower);

        let formattedHtml = text;
        if (matchIdx !== -1) {
          const before = text.substring(0, matchIdx);
          const match = text.substring(matchIdx, matchIdx + searchLower.length);
          const after = text.substring(matchIdx + searchLower.length);
          formattedHtml = `${before}<span class="match-highlight">${match}</span>${after}`;
        }

        const iconClass = res.isStreet ? 'fa-road' : 'fa-location-dot';
        item.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${formattedHtml}</span>`;

        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          inputElem.value = res.displayName;
          inputElem.dataset.lat = res.lat;
          inputElem.dataset.lng = res.lon;
          dropdownElem.style.display = 'none';
          handleCalculateRoutes();
        });

        dropdownElem.appendChild(item);
      });

      dropdownElem.style.display = 'block';
    };

    const updateSuggestions = async (val) => {
      if (!val || val.trim().length < 1) {
        dropdownElem.style.display = 'none';
        return;
      }

      // 1. MOSTRA IMMEDIATAMENTE I SUGGERIMENTI LOCALI (0ms)
      const instantLocal = explorerEngine.getInstantSuggestions(val);
      if (instantLocal.length > 0) {
        drawDropdown(instantLocal, val);
      }

      // 2. ARRICCHIMENTO ONLINE IN BACKGROUND
      try {
        const fullResults = await explorerEngine.searchAddressSuggestions(val);
        if (inputElem.value.trim().toLowerCase() === val.trim().toLowerCase()) {
          if (fullResults && fullResults.length > 0) {
            drawDropdown(fullResults, val);
          }
        }
      } catch (e) {
        // Fallback silente: i dati locali sono già visibili
      }
    };

    inputElem.addEventListener('input', (e) => {
      delete inputElem.dataset.lat;
      delete inputElem.dataset.lng;
      clearTimeout(timeout);
      const val = e.target.value;
      updateSuggestions(val);
    });

    inputElem.addEventListener('focus', (e) => {
      const val = e.target.value;
      if (val && val.trim().length >= 1) {
        updateSuggestions(val);
      }
    });

    inputElem.addEventListener('blur', () => {
      setTimeout(() => {
        dropdownElem.style.display = 'none';
      }, 250);
    });

    document.addEventListener('click', (e) => {
      if (!inputElem.contains(e.target) && !dropdownElem.contains(e.target)) {
        dropdownElem.style.display = 'none';
      }
    });
  }

  let customWaypoints = [];
  let currentRouteMode = 'oneway';

  // Modalità di percorso (Solo Andata, A/R, Anello)
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--text-muted)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--bg-pill-active)';
      btn.style.color = '#ffffff';

      currentRouteMode = btn.dataset.mode || 'oneway';

      if (currentRouteMode === 'loop') {
        if (inputEnd) {
          inputEnd.placeholder = "Giro ad Anello (coincide con la partenza)";
          inputEnd.value = inputStart.value ? `${inputStart.value} (Anello)` : '';
          inputEnd.disabled = true;
        }
      } else {
        if (inputEnd) {
          inputEnd.placeholder = "Scrivi la destinazione...";
          if (inputEnd.value.includes('(Anello)')) inputEnd.value = '';
          inputEnd.disabled = false;
        }
      }

      handleCalculateRoutes();
    });
  });

  async function handleCalculateRoutes() {
    try {
      const startVal = inputStart.value.trim() || 'Aprilia';
      const endVal = (currentRouteMode === 'loop') ? startVal : (inputEnd.value.trim() || 'Albano Laziale');
      const targetKm = parseInt(sliderTargetKm?.value || '45', 10);

      let startCoords = null;
      let endCoords = null;

      if (inputStart?.dataset.lat && inputStart?.dataset.lng) {
        startCoords = [parseFloat(inputStart.dataset.lat), parseFloat(inputStart.dataset.lng)];
      }
      if (inputEnd?.dataset.lat && inputEnd?.dataset.lng && currentRouteMode !== 'loop') {
        endCoords = [parseFloat(inputEnd.dataset.lat), parseFloat(inputEnd.dataset.lng)];
      }

      routeCardsContainer.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--brand-primary); margin-bottom: 12px;"></i>
          <div style="font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Calcolo 5 opzioni stradali...</div>
          <div style="font-size: 0.78rem;">Elaborazione arterie OSRM & profilatura altimetrica</div>
        </div>
      `;

      activeRoutes = await explorerEngine.discoverRoutes(startVal, endVal, targetKm, startCoords, endCoords, customWaypoints, currentRouteMode);
      renderTechnicalSpecCards(activeRoutes);

      mapManager.clearRoutes();

      const firstRoute = activeRoutes[0];
      const actualStartCoords = firstRoute?.startCoords || startCoords || [41.5956, 12.6525];
      const actualEndCoords = firstRoute?.endCoords || endCoords || [41.7288, 12.6582];

      mapManager.addStartEndMarkers(actualStartCoords, actualEndCoords, customWaypoints);

      activeRoutes.forEach(route => {
        mapManager.renderRoutePolyline(route.coords, route.color, false, route.id);
      });

      mapManager.fitBoundsToRoutes();

      if (activeRoutes.length > 0) {
        selectRoute(activeRoutes[0].id);
      }

      mapManager.refreshMapSize();
    } catch (err) {
      console.error("Errore calcolo percorsi:", err);
      routeCardsContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #ef4444; background: rgba(239,68,68,0.1); border-radius: 8px; border: 1px solid rgba(239,68,68,0.3);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.6rem; margin-bottom: 8px;"></i>
          <div style="font-weight: 700; font-size: 0.9rem;">Impossibile completare il calcolo</div>
          <div style="font-size: 0.78rem; margin-top: 4px; color: var(--text-muted);">Verifica la connessione o inserisci due località valide.</div>
        </div>
      `;
    }
  };

  // Selezione punti cliccando sulla mappa
  mapManager.onMapClick((latLng) => {
    const formattedCoord = `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`;
    if (clickState === 'start') {
      inputStart.value = formattedCoord;
      inputStart.dataset.lat = latLng.lat;
      inputStart.dataset.lng = latLng.lng;
      clickState = 'end';
    } else if (clickState === 'end') {
      inputEnd.value = formattedCoord;
      inputEnd.dataset.lat = latLng.lat;
      inputEnd.dataset.lng = latLng.lng;
      clickState = 'waypoint';
    } else {
      customWaypoints.push([latLng.lat, latLng.lng]);
    }
    handleCalculateRoutes();
  });

  btnCalculateRoutes.addEventListener('click', () => {
    customWaypoints = [];
    clickState = 'start';
    handleCalculateRoutes();
  });

  const routeDetailModal = document.getElementById('routeDetailModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnModalCloseAction = document.getElementById('btnModalCloseAction');
  const btnModalExportGpx = document.getElementById('btnModalExportGpx');
  const modalMultiMetricCanvas = document.getElementById('modalMultiMetricChart');

  function openRouteModal(route) {
    if (!route || !routeDetailModal) return;
    document.getElementById('modalRouteTitle').textContent = route.name;
    document.getElementById('modalRouteColorPill').style.background = route.color;
    
    const safety = route.roadSafety || { badgeClass: 'badge-low-traffic', iconClass: 'fa-shield-halved', badgeText: 'Basso Traffico' };
    const safetyBadge = document.getElementById('modalSafetyBadge');
    if (safetyBadge) {
      safetyBadge.className = `badge ${safety.badgeClass}`;
      safetyBadge.innerHTML = `<i class="fa-solid ${safety.iconClass}"></i> ${safety.badgeText}`;
    }

    document.getElementById('modalDifficultyBadge').textContent = route.difficulty;
    document.getElementById('modalCategoryBadge').textContent = route.categoryTag || 'Itinerario Ciclistico';

    document.getElementById('modalDistVal').innerHTML = `${route.distanceKm} <span>km</span>`;
    document.getElementById('modalElevGainVal').innerHTML = `${route.elevationGainM} <span>m</span>`;
    document.getElementById('modalMaxGradeVal').textContent = `${route.maxGradePercent}%`;

    document.getElementById('modalSpeed20').textContent = route.timeEstimates.speed20;
    document.getElementById('modalSpeed25').textContent = route.timeEstimates.speed25;
    document.getElementById('modalSpeed30').textContent = route.timeEstimates.speed30;

    document.getElementById('modalStreetSummary').innerHTML = route.streetSummary || 'Strade provinciali e vicinali';

    routeDetailModal.classList.add('active');

    if (modalMultiMetricCanvas) {
      analyticsManager.renderMultiMetricChart(modalMultiMetricCanvas, route.elevationProfile, route.color);
    }
  }

  function closeModal() {
    if (routeDetailModal) {
      routeDetailModal.classList.remove('active');
    }
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnModalCloseAction) btnModalCloseAction.addEventListener('click', closeModal);
  if (btnModalExportGpx) btnModalExportGpx.addEventListener('click', () => plannerManager.exportToGpx());
  if (routeDetailModal) {
    routeDetailModal.addEventListener('click', (e) => {
      if (e.target === routeDetailModal) closeModal();
    });
  }

  function renderTechnicalSpecCards(routes) {
    routeCardsContainer.innerHTML = '';

    routes.forEach(route => {
      const card = document.createElement('div');
      card.className = `spec-card ${route.id === selectedRouteId ? 'selected' : ''}`;
      card.dataset.routeId = route.id;

      const safety = route.roadSafety || {
        badgeClass: 'badge-low-traffic',
        iconClass: 'fa-shield-halved',
        badgeText: 'Vicinale / Basso Traffico'
      };

      card.innerHTML = `
        <div class="spec-card-header" style="margin-bottom: 6px;">
          <div class="route-name" style="font-size: 0.88rem;">
            <div class="route-color-pill" style="background: ${route.color}; width: 10px; height: 10px;"></div>
            ${route.name}
          </div>
          <span class="badge ${safety.badgeClass}" style="font-size: 0.68rem; padding: 2px 7px;">
            <i class="fa-solid ${safety.iconClass}"></i> ${safety.badgeText}
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-input); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); border-left: 3px solid ${route.color};">
          <div style="display: flex; gap: 14px; font-size: 0.85rem; font-weight: 700;">
            <span><i class="fa-solid fa-ruler-horizontal" style="color: var(--brand-primary); font-size: 0.75rem;"></i> ${route.distanceKm} km</span>
            <span><i class="fa-solid fa-mountain" style="color: var(--brand-primary); font-size: 0.75rem;"></i> ${route.elevationGainM}m D+</span>
          </div>
          <button class="btn btn-secondary btn-open-detail" style="padding: 4px 10px; font-size: 0.72rem; border-radius: 4px;">
            <i class="fa-solid fa-expand"></i> Dettagli
          </button>
        </div>
      `;

      card.addEventListener('click', (e) => {
        selectRoute(route.id);
        if (e.target.closest('.btn-open-detail')) {
          openRouteModal(route);
        }
      });
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
      mapManager.renderRoutePolyline(metrics.coords, '#0ea5e9', true, 'user-workout');
      mapManager.fitBoundsToRoutes();

      analyticsManager.renderElevationChart(elevationCanvas, metrics.elevationProfile, '#0ea5e9');

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

  // Calcolo iniziale automatico dei percorsi all'avvio dell'applicazione
  setTimeout(() => {
    handleCalculateRoutes();
  }, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
