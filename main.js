// Import modules
import CesiumViewer from './src/components/map.js';
import * as Cesium from 'cesium';

// Import methods
import { getPosition } from './src/utils/position.js';
import { populateDrawer, accordionBehaviour, autocloseDrawer } from './src/controller/drawer.js';
import { filterLayersBySelectedTags, filterTag, filterLayersByTagName } from './src/utils/filter.js';
import { fetchJsonData, fetchSvgIcon } from './src/settings.js';
import { changeTheme, fetchThemes } from './src/controller/theme.js';

// Import data
const CATEGORIES_URL = './json/categories.json';
const THEMES_URL = './json/themes.json';

// Import service worker
import './service-worker.js';

// Import web components
import './src/components/map.js';
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
import './src/components/button.js';
import './src/components/settings-icon.js';
import './src/components/zoom-button.js';
import './src/components/theme-icon.js';
import './src/components/close-navigation-btn.js';

// Map initialization
const map = new CesiumViewer();

// Get user position
const position = await getPosition();
// map.setCameraToUserPosition(position);
map.setCamera();
map.createUserPin(position);

// Zoom buttons
const zoomBtns = document.querySelectorAll('app-zoom-btn');
zoomBtns.forEach(btn => map.zoom(btn));

// Theme button
const changeThemeBtn = document.querySelector('app-theme-icon');
const themes = await fetchThemes(THEMES_URL);
changeThemeBtn.setAttribute('themes', JSON.stringify(themes));
changeThemeBtn.addEventListener('themeChanged', (event) => {
  const theme = event.detail.newValue;
  changeTheme(map, theme);
});

// Accordions creation
const drawerContent = document.querySelector('#categories-section');
let jsonData = await fetchJsonData(CATEGORIES_URL);

if (localStorage.length != 0) {
  let dataToFilter = JSON.parse(JSON.stringify(jsonData));
  let selectedTags = JSON.parse(localStorage.selectedTags)
  filterLayersBySelectedTags(dataToFilter, selectedTags);
  populateDrawer(dataToFilter, drawerContent);
  jsonData = dataToFilter;
} else {
  populateDrawer(jsonData, drawerContent);
}

// DOM nodes
const main = document.querySelector('main');
const drawerToggle = document.querySelector('app-drawer-toggle');
const drawer = document.querySelector('#drawer');
const allCheckboxLists = document.querySelectorAll('app-checkbox-list');
const allCategoryAccordions = document.querySelectorAll('.category-accordion');
const allLayerAccordions = document.querySelectorAll('.layer-accordion');
const searchBar = document.querySelector('app-searchbar');
const drawerTitle = document.querySelector('#drawer-title');
const autocomplete = document.querySelector('app-autocomplete');

// Import cluster icons
const clusterIcons = [];
for (let i = 0; i <= 2; i++) {
  const clusterIcon = await fetchSvgIcon(i + 2);
  clusterIcons.push(clusterIcon);
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

// Autoclose drawer after 10 seconds
autocloseDrawer(drawer, drawerToggle);

// Checkbox list behaviour
const activeLayers = [];

allCheckboxLists.forEach(checkboxList => {
  checkboxList.addEventListener('checkboxListChanged', async function (event) {
    await map.handleCheckbox(event, activeLayers, checkboxList, clusterIcons);
  });
});

allCheckboxLists.forEach(checkboxList => {
  checkboxList.addEventListener('allCheckboxesActivated', async (event) => {
      checkboxList.setAttribute('data', JSON.stringify(event.detail.input));
  });
});

// Accordion behaviour
accordionBehaviour(allCategoryAccordions, allLayerAccordions);

// Close navigation button
const closeNavigationBtn = document.querySelector('app-close-navigation-btn');
closeNavigationBtn.addEventListener('click', () => {
  allCheckboxLists.forEach(checkboxList => checkboxList.setAttribute('navigation-data', null));
});

// Navigation
let isNavigation = false;
for (const checkboxList of allCheckboxLists) {
  checkboxList.addEventListener('navigationTriggered', (event) => {
    if (event.detail.newValue != 'null') {
      isNavigation = true;
      closeNavigationBtn.setAttribute('is-active', isNavigation + '');
      const navigationData = JSON.parse(event.detail.newValue);
      map.createRoute(position, navigationData);
    } else {
      isNavigation = false;
      closeNavigationBtn.setAttribute('is-active', isNavigation + '');
      const entities = map.viewer.entities;
      map.removeAllEntities(entities);
    }
  })
}

// Search bar
searchBar.addEventListener('searchValueChanged', (event) => {
  drawerContent.innerHTML = ``;
  const valueToSearch = event.detail.newValue.toLowerCase();
  drawerTitle.textContent = `Livelli per: ${valueToSearch}`;

  let dataToFilter = JSON.parse(JSON.stringify(jsonData));

  filterLayersByTagName(dataToFilter, valueToSearch);

  if (valueToSearch == '') {
    populateDrawer(jsonData, drawerContent);
    drawerTitle.textContent = 'Categorie';
  } else {
    populateDrawer(dataToFilter, drawerContent);

    if (!drawerContent.innerHTML) {
      const emptyMsg = document.createElement('p');
      emptyMsg.innerText = `Nessun livello trovato per ${valueToSearch}`;
      drawerContent.append(emptyMsg);
    }
  }

  const allCheckboxLists = document.querySelectorAll('app-checkbox-list');
  allCheckboxLists.forEach(checkboxList => {
    checkboxList.addEventListener('checkboxListChanged', async function (event) {
      await handleCheckbox(event, checkboxList);
    });
  });

  const allCategoryAccordions = document.querySelectorAll('.category-accordion');
  const allLayerAccordions = document.querySelectorAll('.layer-accordion');
  accordionBehaviour(allCategoryAccordions, allLayerAccordions);

  for (const checkboxList of allCheckboxLists) {
    checkboxList.addEventListener('navigationTriggered', (event) => {
      if (event.detail.newValue != 'null') {
        isNavigation = true;
        closeNavigationBtn.setAttribute('is-active', isNavigation + '');
        const navigationData = JSON.parse(event.detail.newValue);
        map.createRoute(position, navigationData);
      } else {
        isNavigation = false;
        closeNavigationBtn.setAttribute('is-active', isNavigation + '');
        const entities = map.viewer.entities;
        map.removeAllEntities(entities);
      }
    })
  }

  closeNavigationBtn.addEventListener('click', () => {
    allCheckboxLists.forEach(checkboxList => checkboxList.setAttribute('navigation-data', null));
  });

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