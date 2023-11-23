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
import './src/components/close-navigation-btn.js';
import './src/components/snackbar.js';
import './src/components/center-position-btn.js';
import './src/components/path-drawer.js';
import './src/components/map-controls.js';
import './src/components/path-infobox.js';

// DOM nodes
const main = document.querySelector('main');
const drawerToggle = document.querySelector('app-drawer-toggle');
const drawer = document.querySelector('#drawer');
const searchBar = document.querySelector('app-searchbar');
const drawerTitle = document.querySelector('#drawer-title');
const drawerContent = document.querySelector('app-drawer-content');
const autocomplete = document.querySelector('app-autocomplete');
const pathDrawer = document.querySelector('app-path-drawer');
const mapControls = document.querySelector('app-map-controls');

// Map initialization
const map = new CesiumViewer();

// Get user position
let position;
try { position = await getPosition(); }
catch (error) { console.error(error); }

map.setCameraToUserPosition(position);
// map.setCamera();
map.createUserPin(position);

// Accordions creation
let jsonData;
try {
  let snackbar = document.createElement('app-snackbar');
  snackbar.setAttribute('type', 'loader');
  main.append(snackbar);

  jsonData = await fetchJsonData(CATEGORIES_URL);
  drawerContent.setAttribute('data', JSON.stringify(jsonData));

} catch (error) {
  console.error('Errore durante il recupero dei dati JSON', error);

} finally {
  let snackbar = document.querySelector('app-snackbar[type="loader"]');
  snackbar.setAttribute('is-active', 'false');
}

// Map controls
mapControls.addEventListener('centerPosition', () => map.setCameraToUserPosition(position));
mapControls.addEventListener('zoomIn', () => map.viewer.camera.zoomIn(1000.0));
mapControls.addEventListener('zoomOut', () => map.viewer.camera.zoomOut(1000.0));

// Theme button
const changeThemeBtn = document.querySelector('app-theme-icon');

map.fetchThemes(THEMES_URL)
  .then(themes => changeThemeBtn.setAttribute('themes', JSON.stringify(themes)));

changeThemeBtn.addEventListener('themeChanged', (event) => {
  const theme = event.detail.newValue;
  map.changeTheme(theme);
});

// Import cluster icons
const clusterIcons = [];
for (let i = 0; i <= 2; i++) {
  fetchSvgIcon(i + 2)
    .then(clusterIcon => clusterIcons.push(clusterIcon));
}

// Toggle drawer behaviour
drawerToggle.addEventListener('drawerToggled', (event) => {
  if (event.detail.newValue == 'true') {
    drawer.classList.add('drawer-open');
  } else {
    drawer.classList.remove('drawer-open');
  }
});

// Click on map
let infoboxCounter = 0;
map.viewer.screenSpaceEventHandler.setInputAction(async movement => {
  map.onClick(movement, jsonData, main, drawerToggle, infoboxCounter, isNavigation);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Checkbox list behaviour
drawerContent.addEventListener('activeLayersChanged', async (event) => {
  try {
    let snackbar = document.createElement('app-snackbar');
    snackbar.setAttribute('type', 'loader');
    main.append(snackbar);

    await map.handleCheckbox(event.detail.newValue, clusterIcons);

  } catch (error) {
    console.error('Errore durante il recupero dei layer dal geoserver', error);

  } finally {
    let snackbar = document.querySelector('app-snackbar[type="loader"]');
    snackbar.setAttribute('is-active', 'false');
  }

});

// Navigation
let isNavigation = false;
drawerContent.addEventListener('routeTriggered', (event) => {

  if (event.detail.newValue != '[]') {
    isNavigation = true;
    pathDrawer.setAttribute('is-active', isNavigation + '');
    pathDrawer.setAttribute('data', event.detail.newValue);
    mapControls.setAttribute('is-navigation', isNavigation + '');
    const navigationData = JSON.parse(event.detail.newValue);
    map.createRoute(position, navigationData);

    // map.viewer.dataSources.get(0).entities.values.forEach(entity => {
    //   entity.
    // });

  } else {
    isNavigation = false;
    pathDrawer.setAttribute('is-active', isNavigation + '');
    mapControls.setAttribute('is-navigation', isNavigation + '');
    const entities = map.viewer.entities;
    map.removeAllEntities(entities);
  }

});

pathDrawer.addEventListener('closeNavigation', () => {
  closeNavigation(isNavigation, mapControls, drawerContent, map);
});

mapControls.addEventListener('closeNavigation', () => {
  closeNavigation(isNavigation, mapControls, drawerContent, map);
});

function closeNavigation(isNavigation, mapControls, drawerContent, map) {
  isNavigation = false;
  mapControls.setAttribute('is-navigation', isNavigation + '');
  drawerContent.setAttribute('navigation-data', '[]');
  const entities = map.viewer.entities;
  map.removeAllEntities(entities);
}

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