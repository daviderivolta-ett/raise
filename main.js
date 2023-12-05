// Import modules
import CesiumViewer from './src/components/map.js';
import * as Cesium from 'cesium';

// Import methods
import { getPosition } from './src/utils/position.js';
import { filterTag, filterLayersByTagName } from './src/utils/filter.js';
import { fetchJsonData, fetchSvgIcon } from './src/settings.js';

// Import data
const CATEGORIES_URL = './json/categories.json';
const THEMES_URL = './json/themes.json';

// Import service worker
import './service-worker.js';

// Import web components
import './src/components/map.js';
import './src/components/drawer.js';
import './src/components/checkbox.js';
import './src/components/checkbox-list.js';
import './src/components/infobox.js';
import './src/components/accordion.js';
import './src/components/search.js';
import './src/components/drawer-toggle.js';
import './src/components/autocomplete.js';
import './src/components/opacity-slider.js';
import './src/components/activate-navigation-btn.js';
import './src/components/chip.js';
import './src/components/submit-tags-btn.js';
import './src/components/settings-icon.js';
import './src/components/zoom-button.js';
import './src/components/theme-icon.js';
import './src/components/navigation-btn.js';
import './src/components/close-navigation-btn.js';
import './src/components/snackbar.js';
import './src/components/center-position-btn.js';
import './src/components/path-drawer.js';
import './src/components/map-controls.js';
import './src/components/path-infobox.js';
import './src/components/play-info-btn.js';
import './src/components/goto-btn.js';
import './src/components/path-drawer-toggle.js';
import './src/components/rail.js';
import './src/components/info-drawer.js';
import './src/components/add-to-route-btn.js';
import './src/components/remove-btn.js';
import './src/components/empty-path-drawer-msg.js';
import './src/components/save-route-btn.js';
import './src/components/save-route-input.js';

// DOM nodes
const main = document.querySelector('main');
const drawer = document.querySelector('#drawer');
const searchBar = document.querySelector('app-searchbar');
const drawerTitle = document.querySelector('#drawer-title');
const drawerContent = document.querySelector('app-drawer-content');
const autocomplete = document.querySelector('app-autocomplete');
const pathDrawer = document.querySelector('app-path-drawer');
const pathDrawerToggle = document.querySelector('app-path-drawer-toggle');
const mapControls = document.querySelector('app-map-controls');
const rail = document.querySelector('app-rail');
const infoDrawer = document.querySelector('app-info-drawer');

// Map initialization
const map = new CesiumViewer();

// Map controls
mapControls.addEventListener('centerPosition', () => map.setCameraToUserPosition(position));
mapControls.addEventListener('zoomIn', () => map.viewer.camera.zoomIn(1000.0));
mapControls.addEventListener('zoomOut', () => map.viewer.camera.zoomOut(1000.0));

// Theme button
map.fetchThemes(THEMES_URL)
  .then(themes => rail.setAttribute('themes', JSON.stringify(themes)));

rail.addEventListener('themeChanged', (event) => {
  const theme = event.detail.newValue;
  map.changeTheme(theme);
});

// Local storage
let activeLayers = [];
if (localStorage.customRoute) {
  pathDrawerToggle.setAttribute('is-open', 'true');
  mapControls.setAttribute('is-route', 'true');
  let customRoute = JSON.parse(localStorage.customRoute);
  pathDrawer.setAttribute('route-name', customRoute.name);
  pathDrawer.setAttribute('features', JSON.stringify(customRoute.features));

  ////
  const customRouteFeatures = JSON.parse(localStorage.customRoute).features;
  let layers = [];
  customRouteFeatures.map(feature => layers.push(feature.layer));
  
  let seenLayers = {};
  
  layers.forEach(item => {
    if (!seenLayers[item]) {
      seenLayers[item] = true;
      activeLayers.push(item);
    }
  });
  ////
}

// Layer drawer creation
let jsonData;
try {
  let snackbar = document.createElement('app-snackbar');
  snackbar.setAttribute('type', 'loader');
  main.append(snackbar);

  jsonData = await fetchJsonData(CATEGORIES_URL);
  drawerContent.setAttribute('data', JSON.stringify(jsonData));

  ////
  drawerContent.setAttribute('active-layers', JSON.stringify(activeLayers));
  ////
} catch (error) {
  console.error('Errore durante il recupero dei dati JSON', error);

} finally {
  let snackbar = document.querySelector('app-snackbar[type="loader"]');
  snackbar.setAttribute('is-active', 'false');
}

// Rail behaviour
rail.addEventListener('drawerToggled', (event) => {
  if (event.detail.newValue == 'true') {
    infoDrawer.setAttribute('is-open', 'false');
    drawer.classList.add('drawer-open');
  } else {
    drawer.classList.remove('drawer-open');
  }
});

// Infobox Drawer
infoDrawer.addEventListener('goto', event => {
  const coordinates = event.detail;
  map.goto(coordinates);
});

infoDrawer.addEventListener('addToRoute', (event) => {
  let features = JSON.parse(pathDrawer.getAttribute('features'));
  let feature = event.detail.data;

  if (!features.some(obj => JSON.stringify(obj) === JSON.stringify(feature))) {
    features.push(feature);
  } else {
    let snackbar = document.createElement('app-snackbar');
    snackbar.setAttribute('type', 'temporary');
    snackbar.setAttribute('text', 'Tappa già presente nel percorso.')
    main.append(snackbar);
  }

  pathDrawer.setAttribute('features', JSON.stringify(features));
  pathDrawer.setAttribute('is-open', 'true');
});


// Click on map
map.viewer.screenSpaceEventHandler.setInputAction(async movement => {
  rail.setAttribute('is-open', 'false');
  const feature = map.onClick(movement, jsonData);

  if (feature == undefined) {
    infoDrawer.setAttribute('is-open', 'false');
    pathDrawer.setAttribute('is-open', 'false');
    return;
  }

  infoDrawer.setAttribute('data', `${JSON.stringify(feature)}`);
  infoDrawer.setAttribute('is-open', 'true');
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Cursor on map
map.viewer.screenSpaceEventHandler.setInputAction(movement => {
  map.mouseOver(movement);
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// Import cluster icons
const clusterIcons = [];
for (let i = 0; i <= 2; i++) {
  fetchSvgIcon(i + 2)
    .then(clusterIcon => clusterIcons.push(clusterIcon));
}

// Checkbox list behaviour
drawerContent.addEventListener('activeLayersChanged', async (event) => {
  try {
    let snackbar = document.createElement('app-snackbar');
    snackbar.setAttribute('type', 'loader');
    main.append(snackbar);

    pathDrawer.setAttribute('is-navigation', 'false');
    await map.handleCheckbox(event.detail.newValue, clusterIcons);
    // const activeLayers = event.detail.newValue;
    // mapControls.setAttribute('data', JSON.stringify(activeLayers));

  } catch (error) {
    console.error('Errore durante il recupero dei layer dal geoserver', error);

  } finally {
    let snackbar = document.querySelector('app-snackbar[type="loader"]');
    snackbar.setAttribute('is-active', 'false');
  }

});

// Get user position
let position;
try { position = await getPosition(); }
catch (error) { console.error(error); }

map.setCameraToUserPosition(position);
// map.setCamera();
map.createUserPin(position);

// Path drawer
pathDrawerToggle.addEventListener('togglePathDrawer', event => {
  const e = event.detail.newValue;
  pathDrawer.setAttribute('is-open', e + '');
});

pathDrawer.addEventListener('goto', event => {
  const coordinates = event.detail;
  map.goto(coordinates);
});

pathDrawer.addEventListener('pathDrawerStatusChanged', (event) => {
  const e = event.detail.newValue;
  mapControls.setAttribute('is-route', e + '');
  pathDrawerToggle.setAttribute('is-open', e + '');
});

pathDrawer.addEventListener('empty', () => rail.setAttribute('is-open', 'true'));

pathDrawer.addEventListener('selectedFeature', (e) => {
  const feature = e.detail.data;
  map.setCameraToPosition(feature.coordinates);
  infoDrawer.setAttribute('data', JSON.stringify(feature));
  infoDrawer.setAttribute('is-open', 'true');
});

pathDrawer.addEventListener('saveCustomRoute', (e) => {
  localStorage.setItem('customRoute', JSON.stringify(e.detail.customRoute));

  let snackbar = document.createElement('app-snackbar');
  snackbar.setAttribute('type', 'closable');
  snackbar.setAttribute('text', `Salvato percorso "${e.detail.customRoute.name}".`)
  main.append(snackbar);
});

pathDrawer.addEventListener('activateNavigation', (e) => {
  if (e.detail.isNavigation == 'true') {
    const features = e.detail.features;
    map.startNavigation(features);
  } else {
    const entities = map.viewer.entities;
    map.removeAllEntities(entities);
  }
});

// Search bar
searchBar.addEventListener('searchValueChanged', (event) => {
  const valueToSearch = event.detail.newValue.toLowerCase();
  drawerTitle.textContent = `Livelli per: ${valueToSearch}`;

  let dataToFilter = JSON.parse(JSON.stringify(jsonData));

  filterLayersByTagName(dataToFilter, valueToSearch);

  if (valueToSearch == '') {
    drawerContent.setAttribute('data', JSON.stringify(jsonData));
    drawerTitle.textContent = 'Categorie';
  } else {
    drawerContent.setAttribute('data', JSON.stringify(dataToFilter));

    if (!drawerContent.innerHTML) {
      const emptyMsg = document.createElement('p');
      emptyMsg.innerText = `Nessun livello trovato per ${valueToSearch}`;
      drawerContent.append(emptyMsg);
    }
  }

  if (valueToSearch.length >= 2) {
    const foundTags = filterTag(jsonData, valueToSearch);
    autocomplete.setAttribute('data', JSON.stringify(foundTags));
  } else {
    autocomplete.setAttribute('data', JSON.stringify(''));
  }
});

// Autocomplete behaviour
autocomplete.addEventListener('autocompleteSelected', (event) => {
  const choosenAutocomplete = event.detail.newValue;
  searchBar.setAttribute('value', choosenAutocomplete);
});

document.addEventListener('keydown', (event) => {
  autocomplete.setAttribute('last-key-pressed', event.key);
});