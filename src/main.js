/* ==========================================================================
   STRADE BIANCHE ROUTE PLANNER - MAIN CONTROLLER
   ========================================================================== */

import { MapManager } from './map.js';
import { RouteExplorerEngine } from './routeExplorer.js';
import { PlannerManager } from './planner.js';
import { FitParserEngine } from './fitParser.js';
import { AnalyticsManager } from './analysis.js';
import { StravaSyncEngine } from './stravaSync.js';

class FavoritesManager {
  constructor() {
    this.STORAGE_KEY_FAVS = 'STRADE_BIANCHE_FAVORITES_V1';
    this.STORAGE_KEY_FOLDERS = 'STRADE_BIANCHE_FOLDERS_V1';
    this.favorites = this.loadFavorites();
    this.folders = this.loadFolders();
    this.activeFolder = 'all';
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_FAVS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(this.STORAGE_KEY_FAVS, JSON.stringify(this.favorites));
    } catch (e) {}
  }

  loadFolders() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_FOLDERS);
      return stored ? JSON.parse(stored) : ['Gravel Toscana', 'Giri del Weekend', 'Salite Castelli'];
    } catch (e) {
      return ['Gravel Toscana', 'Giri del Weekend', 'Salite Castelli'];
    }
  }

  saveFolders() {
    try {
      localStorage.setItem(this.STORAGE_KEY_FOLDERS, JSON.stringify(this.folders));
    } catch (e) {}
  }

  isFavorite(routeId) {
    return this.favorites.some(r => r.id === routeId);
  }

  toggleFavorite(route, folderName = 'Giri del Weekend') {
    const idx = this.favorites.findIndex(r => r.id === route.id);
    if (idx !== -1) {
      this.favorites.splice(idx, 1);
    } else {
      const routeToSave = { ...route, folder: folderName, savedAt: new Date().toLocaleDateString('it-IT') };
      this.favorites.push(routeToSave);
    }
    this.saveFavorites();
    return this.isFavorite(route.id);
  }

  createFolder(name) {
    if (!name || this.folders.includes(name)) return;
    this.folders.push(name);
    this.saveFolders();
  }

  getFavoritesByFolder(folder = 'all') {
    if (folder === 'all') return this.favorites;
    return this.favorites.filter(r => r.folder === folder);
  }

  removeFavorite(routeId) {
    this.favorites = this.favorites.filter(r => r.id !== routeId);
    this.saveFavorites();
  }
}

function initApp() {
  const mapManager = new MapManager('map');
  const explorerEngine = new RouteExplorerEngine();
  const plannerManager = new PlannerManager();
  const fitParserEngine = new FitParserEngine();
  const analyticsManager = new AnalyticsManager();
  const favoritesManager = new FavoritesManager();
  const stravaSyncEngine = new StravaSyncEngine();

  let activeRoutes = [];
  let selectedRouteId = null;
  let customWaypoints = [];
  let currentRouteMode = 'oneway';
  let clickState = 'start';

  const routeCardsContainer = document.getElementById('routeCardsContainer');
  const btnExportGpx = document.getElementById('btnExportGpx');
  const btnQuickUpload = document.getElementById('btnQuickUpload');
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const elevationCanvas = document.getElementById('elevationChart');
  const elevationPanel = document.getElementById('elevationPanel');
  const btnToggleChart = document.getElementById('btnToggleChart');

  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = {
    explorer: document.getElementById('tabExplorer'),
    favorites: document.getElementById('tabFavorites'),
    analysis: document.getElementById('tabAnalysis')
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(tabPanes).forEach(key => {
        if (tabPanes[key]) tabPanes[key].style.display = (key === targetTab) ? 'block' : 'none';
      });

      // Espandi sempre la sidebar quando si clicca un tab nell'header
      const sidebarElem = document.getElementById('appSidebar');
      if (sidebarElem) {
        sidebarElem.classList.remove('collapsed');
      }

      mapManager.refreshMapSize();
    });
  });

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

  // Floating Search Overlay Elements
  const floatingSearchOverlay = document.getElementById('floatingSearchOverlay');
  const floatingInputStart = document.getElementById('floatingInputStart');
  const floatingInputEnd = document.getElementById('floatingInputEnd');
  const floatingStartAutocomplete = document.getElementById('floatingStartAutocomplete');
  const floatingEndAutocomplete = document.getElementById('floatingEndAutocomplete');
  const btnFloatingCalculate = document.getElementById('btnFloatingCalculate');

  // Setup Autocomplete per Floating Inputs (Unici input dell'app)
  setupAutocomplete(floatingInputStart, floatingStartAutocomplete);
  setupAutocomplete(floatingInputEnd, floatingEndAutocomplete);

  // Sync Selettori Modalità (Solo Andata, A/R, Anello)
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentRouteMode = btn.dataset.mode || 'oneway';

      modeBtns.forEach(b => {
        const isMatch = (b.dataset.mode || 'oneway') === currentRouteMode;
        b.classList.toggle('active', isMatch);
        b.style.background = isMatch ? 'var(--bg-pill-active)' : 'transparent';
        b.style.color = isMatch ? '#ffffff' : 'var(--text-muted)';
      });

      if (floatingInputEnd) {
        if (currentRouteMode === 'loop') {
          floatingInputEnd.placeholder = "Giro ad Anello (coincide con la partenza)";
          floatingInputEnd.value = floatingInputStart?.value ? `${floatingInputStart.value} (Anello)` : '';
          floatingInputEnd.disabled = true;
        } else {
          floatingInputEnd.placeholder = "Scrivi la destinazione...";
          if (floatingInputEnd.value.includes('(Anello)')) floatingInputEnd.value = '';
          floatingInputEnd.disabled = false;
        }
      }

      if (floatingInputStart?.value.trim()) {
        handleCalculateRoutes();
      }
    });
  });

  if (btnFloatingCalculate) {
    btnFloatingCalculate.addEventListener('click', () => {
      customWaypoints = [];
      clickState = 'start';
      handleCalculateRoutes();
    });
  }

  async function handleCalculateRoutes() {
    try {
      const startVal = floatingInputStart?.value.trim() || '';
      const endVal = (currentRouteMode === 'loop') ? startVal : (floatingInputEnd?.value.trim() || '');

      if (!startVal || (currentRouteMode !== 'loop' && !endVal)) {
        routeCardsContainer.innerHTML = `
          <div style="padding: 20px 14px; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <i class="fa-solid fa-map-location-dot" style="font-size: 1.8rem; color: var(--brand-primary); margin-bottom: 8px;"></i>
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 4px;">Scegli l'itinerario ciclistico</div>
            <div style="font-size: 0.76rem; line-height: 1.4; color: var(--text-muted);">
              Inserisci Partenza e Arrivo nel pannello per elaborare le opzioni di percorso.
            </div>
          </div>
        `;
        return;
      }

      let startCoords = null;
      let endCoords = null;

      if (floatingInputStart?.dataset.lat && floatingInputStart?.dataset.lng) {
        startCoords = [parseFloat(floatingInputStart.dataset.lat), parseFloat(floatingInputStart.dataset.lng)];
      }

      if (floatingInputEnd?.dataset.lat && floatingInputEnd?.dataset.lng && currentRouteMode !== 'loop') {
        endCoords = [parseFloat(floatingInputEnd.dataset.lat), parseFloat(floatingInputEnd.dataset.lng)];
      }

      // Se non sono presenti i dataset dall'autocomplete, esegui il geocoding del testo inserito
      if (!startCoords && startVal) {
        startCoords = await explorerEngine.geocodeLocation(startVal);
      }
      if (!endCoords && endVal && currentRouteMode !== 'loop') {
        endCoords = await explorerEngine.geocodeLocation(endVal);
      }

      routeCardsContainer.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--brand-primary); margin-bottom: 12px;"></i>
          <div style="font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Calcolo 5 opzioni stradali...</div>
          <div style="font-size: 0.78rem;">Elaborazione arterie OSRM & profilatura altimetrica</div>
        </div>
      `;

      activeRoutes = await explorerEngine.discoverRoutes(startVal, endVal, 45, startCoords, endCoords, customWaypoints, currentRouteMode);
      renderTechnicalSpecCards(activeRoutes);

      // APERTURA AUTOMATICA DELLA SIDEBAR PER MOSTRARE LE OPZIONI TROVATE
      if (appSidebar) {
        appSidebar.classList.remove('collapsed');
      }

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

  let activeInputTarget = 'start';
  if (floatingInputStart) {
    floatingInputStart.addEventListener('focus', () => { activeInputTarget = 'start'; });
  }
  if (floatingInputEnd) {
    floatingInputEnd.addEventListener('focus', () => { activeInputTarget = 'end'; });
  }

  // Selezione intelligente dei punti cliccando sulla mappa
  mapManager.onMapClick((latLng) => {
    const formattedCoord = `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`;
    
    // Se la partenza è vuota o l'utente ha il focus sul campo partenza
    if (!floatingInputStart?.value.trim() || activeInputTarget === 'start') {
      if (floatingInputStart) {
        floatingInputStart.value = formattedCoord;
        floatingInputStart.dataset.lat = latLng.lat;
        floatingInputStart.dataset.lng = latLng.lng;
      }
      activeInputTarget = 'end';
    } 
    // Se la destinazione è vuota o l'utente ha il focus sul campo destinazione
    else if (!floatingInputEnd?.value.trim() || activeInputTarget === 'end') {
      if (floatingInputEnd) {
        floatingInputEnd.value = formattedCoord;
        floatingInputEnd.dataset.lat = latLng.lat;
        floatingInputEnd.dataset.lng = latLng.lng;
      }
      activeInputTarget = 'waypoint';
    } 
    // Altrimenti aggiungi un waypoint intermedio
    else {
      customWaypoints.push([latLng.lat, latLng.lng]);
    }

    if (floatingInputStart?.value.trim() && (currentRouteMode === 'loop' || floatingInputEnd?.value.trim())) {
      handleCalculateRoutes();
    }
  });

  if (btnCalculateRoutes) {
    btnCalculateRoutes.addEventListener('click', () => {
      customWaypoints = [];
      clickState = 'start';
      handleCalculateRoutes();
    });
  }

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

    const diffBadge = document.getElementById('modalDifficultyBadge');
    if (diffBadge) {
      diffBadge.className = 'badge badge-low-traffic';
      diffBadge.textContent = route.difficulty;
    }

    const catBadge = document.getElementById('modalCategoryBadge');
    if (catBadge) {
      catBadge.className = 'badge badge-med-traffic';
      catBadge.textContent = route.categoryTag || 'Itinerario Ciclistico';
    }

    document.getElementById('modalDistVal').innerHTML = `${route.distanceKm} <span>km</span>`;
    document.getElementById('modalElevGainVal').innerHTML = `${route.elevationGainM} <span>m</span>`;
    document.getElementById('modalMaxGradeVal').textContent = `${route.maxGradePercent}%`;

    const maxEleElem = document.getElementById('modalMaxEleVal');
    if (maxEleElem) {
      maxEleElem.innerHTML = `${route.maxElevationM || 180} <span>m</span>`;
    }

    document.getElementById('modalSpeed20').textContent = route.timeEstimates.speed20;
    document.getElementById('modalSpeed25').textContent = route.timeEstimates.speed25;
    document.getElementById('modalSpeed30').textContent = route.timeEstimates.speed30;

    document.getElementById('modalStreetSummary').innerHTML = route.streetSummary || 'Strade provinciali e vicinali';

    routeDetailModal.classList.add('active');

    if (modalMultiMetricCanvas) {
      analyticsManager.renderPlannedRouteChart(modalMultiMetricCanvas, route.elevationProfile, route.color, (hoverIdx) => {
        const coord = route.coords[Math.min(hoverIdx, route.coords.length - 1)];
        if (coord) mapManager.updateHoverMarker(coord);
      });
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

  // Handle Bryton 420 Modal & Guide Tabs
  const btnBrytonGuide = document.getElementById('btnBrytonGuide');
  const brytonModal = document.getElementById('brytonModal');
  const btnCloseBrytonModal = document.getElementById('btnCloseBrytonModal');
  const btnCloseBrytonAction = document.getElementById('btnCloseBrytonAction');
  const btnBrytonDownloadGpx = document.getElementById('btnBrytonDownloadGpx');
  const brytonRouteName = document.getElementById('brytonRouteName');

  function openBrytonModal() {
    if (!brytonModal) return;
    if (plannerManager.selectedRoute) {
      if (brytonRouteName) brytonRouteName.textContent = plannerManager.selectedRoute.name;
    } else {
      if (brytonRouteName) brytonRouteName.textContent = "Seleziona una rotta sulla mappa prima di scaricare";
    }
    brytonModal.classList.add('active');
  }

  function closeBrytonModal() {
    if (brytonModal) brytonModal.classList.remove('active');
  }

  if (btnBrytonGuide) btnBrytonGuide.addEventListener('click', openBrytonModal);
  if (btnCloseBrytonModal) btnCloseBrytonModal.addEventListener('click', closeBrytonModal);
  if (btnCloseBrytonAction) btnCloseBrytonAction.addEventListener('click', closeBrytonModal);
  if (btnBrytonDownloadGpx) btnBrytonDownloadGpx.addEventListener('click', () => plannerManager.exportToGpx());
  if (brytonModal) {
    brytonModal.addEventListener('click', (e) => {
      if (e.target === brytonModal) closeBrytonModal();
    });
  }

  const brytonTabBtns = document.querySelectorAll('.bryton-tab-btn');
  const brytonTabContents = {
    app: document.getElementById('bTabApp'),
    usb: document.getElementById('bTabUsb'),
    start: document.getElementById('bTabStart')
  };

  brytonTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.btab;
      brytonTabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--text-muted)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--brand-primary)';
      btn.style.color = '#ffffff';

      Object.keys(brytonTabContents).forEach(key => {
        if (brytonTabContents[key]) brytonTabContents[key].style.display = (key === target) ? 'block' : 'none';
      });
    });
  });

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
  });

  if (btnExportGpx) {
    btnExportGpx.addEventListener('click', () => {
      plannerManager.exportToGpx();
    });
  }

  if (btnQuickUpload && fileInput) {
    btnQuickUpload.addEventListener('click', () => fileInput.click());
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        processWorkoutFile(e.target.files[0]);
      }
    });
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--brand-gold)';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        processWorkoutFile(e.dataTransfer.files[0]);
      }
    });
  }

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
      mapManager.renderRoutePolyline(metrics.coords, '#CE8946', true, 'user-workout');
      mapManager.fitBoundsToRoutes();

      analyticsManager.renderElevationChart(elevationCanvas, metrics.elevationProfile, '#CE8946');

      document.querySelector('.nav-btn[data-tab="analysis"]').click();

    } catch (err) {
      alert("Errore nella lettura del file del Bryton: " + err.message);
    }
  }

  const btnConnectStrava = document.getElementById('btnConnectStrava');
  if (btnConnectStrava) {
    btnConnectStrava.addEventListener('click', () => {
      const activities = stravaSyncEngine.connectStravaAccount();
      const listContainer = document.getElementById('stravaActivitiesList');
      if (listContainer) {
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
              Dispositivo: <strong style="color: var(--brand-primary);">${act.device}</strong>
            </div>
            <div class="spec-metrics-grid">
              <div class="metric-box"><div class="metric-val">${act.distanceKm} <span>km</span></div></div>
              <div class="metric-box"><div class="metric-val">${act.elevationGainM} <span>m</span></div></div>
              <div class="metric-box"><div class="metric-val">${act.avgSpeedKmH} <span>km/h</span></div></div>
            </div>
          `;
          listContainer.appendChild(item);
        });
      }
      alert("Account Strava collegato con successo! Sincronizzazione uscite Bryton completata.");
    });
  }

  const toggleChartPanel = (e) => {
    if (e) e.stopPropagation();
    const isCollapsed = elevationPanel.classList.toggle('collapsed');
    btnToggleChart.innerHTML = isCollapsed
      ? '<i class="fa-solid fa-chevron-up"></i> Espandi'
      : '<i class="fa-solid fa-chevron-down"></i> Minimizza';

    setTimeout(() => {
      if (elevationCanvas._chartInstance) {
        elevationCanvas._chartInstance.resize();
      }
    }, 280);
  };

  if (btnToggleChart) {
    btnToggleChart.addEventListener('click', toggleChartPanel);
  }

  // Cliccando sull'intestazione quando il pannello è minimizzato lo riapre
  const chartHeader = elevationPanel.querySelector('.chart-header');
  if (chartHeader) {
    chartHeader.addEventListener('click', (e) => {
      if (elevationPanel.classList.contains('collapsed')) {
        toggleChartPanel(e);
      }
    });
  }

  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const btnHeaderToggleSidebar = document.getElementById('btnHeaderToggleSidebar');
  const appSidebar = document.getElementById('appSidebar');

  const toggleSidebarAction = () => {
    if (appSidebar) {
      appSidebar.classList.toggle('collapsed');
      setTimeout(() => mapManager.refreshMapSize(), 230);
    }
  };

  if (btnToggleSidebar) btnToggleSidebar.addEventListener('click', toggleSidebarAction);
  if (btnHeaderToggleSidebar) btnHeaderToggleSidebar.addEventListener('click', toggleSidebarAction);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
