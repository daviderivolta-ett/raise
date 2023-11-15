// Import modules
import CesiumViewer from './src/components/map.js';
import * as Cesium from 'cesium';

// Import methods
import { getPosition } from './src/utils/getPosition.js';
import { populateDrawer } from './src/utils/populateDrawer.js';
import { filterLayersByTagName } from './src/utils/filterLayersByTagName.js';
import { fetchJsonData } from './src/settings.js';
import { fetchThemes } from './src/utils/fetchThemes.js';
import { activateLayersWFS } from './src/utils/activateLayersWFS.js';
import { createRoute } from './src/utils/createRoute.js';
import { startNavigation } from './src/utils/startNavigation.js';
import { handleFeaturesWFS } from './src/utils/handleFeaturesWFS.js';
import { accordionBehaviour } from './src/utils/accordionBehaviour.js';
import { filterTag } from './src/utils/filterTagByName.js';
import { createInfobox } from './src/utils/createInfobox.js';
import { zoomHandle } from './src/utils/zoomHandle.js';
import { themeChange } from './src/utils/themeChange.js';
import { getAllTags } from './src/utils/getAllTags.js';
import { filterLayersBySelectedTags } from './src/utils/filterLayersBySelectedTags.js';
import { fetchSvgIcon } from './src/utils/fetchSvgIcon.js';

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

// INIT MAP PAGE
async function initMapPage() {

  // Map initialization
  const viewer = new CesiumViewer();

  // Get user position
  const position = await getPosition();
  viewer.setCameraToUserPosition(position);
  viewer.createUserPin(position);

  // Zoom buttons
  const zoomBtns = document.querySelectorAll('app-zoom-btn');
  zoomBtns.forEach(btn => zoomHandle(viewer, btn));

  // Theme button
  const themes = await fetchThemes(THEMES_URL);
  const themeBtn = document.querySelector('app-theme-icon');
  themeBtn.setAttribute('themes', JSON.stringify(themes));
  themeBtn.addEventListener('themeChanged', (event) => themeChange(Cesium, viewer, event.detail.newValue));

  // Accordions creation
  const drawerContent = document.querySelector('#categories-section');

  let jsonData = await fetchJsonData(CATEGORIES_URL);

  if (localStorage.length != 0) {
    let dataToFilter = JSON.parse(JSON.stringify(jsonData));
    filterLayersBySelectedTags(dataToFilter, JSON.parse(localStorage.selectedTags));

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

  // Infoboxes creation & handling
  viewer.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    const windowPosition = movement.position;
    viewer.onClick(windowPosition)
      .then(async features => {
        // console.log(features);

        if (typeof features === 'object' && !Array.isArray(features)) {
          if (isNavigation == false) {
            const infoContent = await handleFeaturesWFS(features, jsonData);

            let allInfoBoxes = document.querySelectorAll('app-infobox');

            if (infoContent) {
              if (Object.keys(infoContent).length !== 0) {
                createInfobox(allInfoBoxes, infoContent, main);
              }
            }

            drawerToggle.setAttribute('is-open', 'false');

          } else {
            startNavigation(Cesium, viewer, windowPosition);
          }

        }

      })
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Autoclose drawer after 10 seconds
  let timer;
  drawer.addEventListener('click', () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      drawerToggle.setAttribute('is-open', 'false');
    }, 10000);
  });

  // Checkbox list behaviour
  const activeLayers = [];
  const promises = [];
  activateLayersWFS(allCheckboxLists, activeLayers, promises, viewer, clusterIcons);

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
        createRoute(Cesium, position, navigationData, viewer);
      } else {
        isNavigation = false;
        closeNavigationBtn.setAttribute('is-active', isNavigation + '');
        const entities = viewer.viewer.entities;
        viewer.removeAllEntities(entities);
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
    activateLayersWFS(allCheckboxLists, activeLayers, promises, viewer, clusterIcons);

    const allCategoryAccordions = document.querySelectorAll('.category-accordion');
    const allLayerAccordions = document.querySelectorAll('.layer-accordion');
    accordionBehaviour(allCategoryAccordions, allLayerAccordions);

    for (const checkboxList of allCheckboxLists) {
      checkboxList.addEventListener('navigationTriggered', (event) => {
        if (event.detail.newValue != 'null') {
          isNavigation = true;
          closeNavigationBtn.setAttribute('is-active', isNavigation + '');
          const navigationData = JSON.parse(event.detail.newValue);
          createRoute(Cesium, position, navigationData, viewer);
        } else {
          isNavigation = false;
          closeNavigationBtn.setAttribute('is-active', isNavigation + '');
          const entities = viewer.viewer.entities;
          viewer.removeAllEntities(entities);
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
}

// INIT ONBOARD PAGE
async function initOnboardpage() {
  let jsonData = await fetchJsonData(CATEGORIES_URL);

  // Create tag chips
  const allTags = getAllTags(jsonData);

  allTags.forEach(tag => {
    let chip = document.createElement('app-chip');
    chip.setAttribute('tag', tag);
    chipsContainer.append(chip);
  });

  // Button / chips behaviour
  let selectedTags = [];

  const chips = document.querySelectorAll('app-chip');
  const btn = document.querySelector('app-btn');
  chips.forEach(chip => {
    chip.addEventListener('chipChanged', (event) => {

      if (event.detail.newValue == 'true') {
        selectedTags.push(event.detail.tag);
      } else {
        selectedTags = selectedTags.filter(item => item !== event.detail.tag);
      }

      btn.setAttribute('tags', JSON.stringify(selectedTags));
    })
  })

  // Select chips which tags are already in localStorage
  if (localStorage.selectedTags) {
    const selectedTags = JSON.parse(localStorage.selectedTags);
    // console.log(selectedTags);

    selectedTags.forEach(tag => {
      chips.forEach(chip => {
        if (chip.getAttribute('tag') == tag) {
          chip.setAttribute('is-selected', 'true');
        }
      })
    });
  }

  // Select all chips button
  const selectAllBtn = document.querySelector('#select-all-btn');
  selectAllBtn.addEventListener('click', () => {
    chips.forEach(chip => {
      chip.setAttribute('is-selected', 'true');
    });
  });

  // Deselect all chips button
  const resetBtn = document.querySelector('#reset-btn');
  resetBtn.addEventListener('click', () => {
    chips.forEach(chip => {
      chip.setAttribute('is-selected', 'false');
    });
  });

  // Clear localStorage
  const clear = document.querySelector('#clear-local-storage');
  clear.addEventListener('click', () => localStorage.clear());
}

// Map page
const mapContainer = document.querySelector('app-map');
if (mapContainer) { initMapPage(); }

// Onboard page
const chipsContainer = document.querySelector('#chips-section');
if (chipsContainer) { initOnboardpage(); }