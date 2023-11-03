// Import modules
import CesiumViewer from './src/components/map.js';
import * as Cesium from 'cesium';

// Import methods
import { populateDrawer } from './src/utils/populateDrawer.js';

import { filterLayersByTagName } from './src/utils/filterLayersByTagName.js';
import { fetchJsonData } from './src/settings.js';

import { activateLayersWFS } from './src/utils/activateLayersWFS.js';

import { handleFeaturesWFS } from './src/utils/handleFeaturesWFS.js';

import { accordionBehaviour } from './src/utils/accordionBehaviour.js';
import { filterTag } from './src/utils/filterTagByName.js';

import { createInfobox } from './src/utils/createInfobox.js';
import { zoomHandle } from './src/utils/zoomHandle.js';
import { themeChange } from './src/utils/themeChange.js';

import { getAllTags } from './src/utils/getAllTags.js';
import { filterLayersBySelectedTags } from './src/utils/filterLayersBySelectedTags.js';

// Import data
const CATEGORIES_URL = './json/categories.json';

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
import './src/components/chip.js';
import './src/components/button.js';
import './src/components/settings-icon.js';
import './src/components/zoom-button.js';
import './src/components/theme-icon.js';

// Map page
const mapContainer = document.querySelector('app-map');
if (mapContainer) {

  // Map initialization
  const viewer = new CesiumViewer();
  viewer.setCamera();

  // Zoom buttons
  const zoomBtns = document.querySelectorAll('app-zoom-btn');
  zoomBtns.forEach(btn => zoomHandle(viewer, btn));

  // Theme button
  const themeBtn = document.querySelector('app-theme-icon');
  themeBtn.addEventListener('themeChanged', (event) => themeChange(viewer, event.detail.newValue));

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
    viewer.onClick(movement.position)
      .then(features => {
        console.log(features);

        if (typeof features === 'object' && !Array.isArray(features)) {
          const infoContent = handleFeaturesWFS(features, jsonData);

          let allInfoBoxes = document.querySelectorAll('app-infobox');

          if (infoContent) {
            if (Object.keys(infoContent).length !== 0) {
              createInfobox(allInfoBoxes, infoContent, main);
            }
          }

          drawerToggle.setAttribute('is-open', 'false');
        }

      })
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Autoclose drawer after 10 seconds
  // let timer;
  // drawer.addEventListener('click', () => {
  //   if (timer) {
  //     clearTimeout(timer);
  //   }
  //   timer = setTimeout(() => {
  //     drawerToggle.setAttribute('is-open', 'false');
  //   }, 10000);
  // });

  // Checkbox list behaviour
  const activeLayers = [];
  activateLayersWFS(allCheckboxLists, activeLayers, viewer);

  // Accordion behaviour
  accordionBehaviour(allCategoryAccordions, allLayerAccordions);

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
    activateLayersWFS(allCheckboxLists, activeLayers, viewer);

    const allCategoryAccordions = document.querySelectorAll('.category-accordion');
    const allLayerAccordions = document.querySelectorAll('.layer-accordion');
    accordionBehaviour(allCategoryAccordions, allLayerAccordions);

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

// Onboard page
const chipsContainer = document.querySelector('#chips-section');

if (chipsContainer) {
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