// Import modules
import CesiumViewer from './components/map/map.js';
import * as Cesium from 'cesium';

// Import methods
import { populateDrawer } from './utils/populateDrawer.js';

import { filterLayersByTagName } from './utils/filterLayersByTagName.js';
import { fetchJsonData } from './settings.js';

import { activateLayersWMS } from './utils/activateLayersWMS.js';
import { activateLayersWFS } from './utils/activateLayersWFS.js';

import { handleFeaturesWMS } from './utils/handleFeaturesWMS.js';
import { handleFeaturesWFS } from './utils/handleFeaturesWFS.js';

import { accordionBehaviour } from './utils/accordionBehaviour.js';
import { filterTag } from './utils/filterTagByName.js';

import { createInfobox } from './utils/createInfobox.js';
import { handleInfoBox } from './utils/handleInfobox.js';

import { getAllTags } from './utils/getAllTags.js';
import { filterLayersBySelectedTags } from './utils/filterLayersBySelectedTags.js';


// Import data
const CATEGORIES_URL = '../json/categories.json';

// Import sw
import '../service-worker.js';

// Import web components
import './components/map/map.js';
import './components/checkbox/checkbox.js';
import './components/checkbox-list/checkbox-list.js';
import './components/infobox/infobox.js';
import './components/accordion/accordion.js';
import './components/search/search.js';
import './components/drawer-toggle/drawer-toggle.js';
import './components/autocomplete/autocomplete.js';
import './components/tools/opacity-slider.js';
import './components/chip/chip.js';
import './components/button/button.js';

const mapContainer = document.querySelector('app-map');
if (mapContainer) {

  // Map initialization
  const viewer = new CesiumViewer();
  viewer.setCamera();

  // Accordions creation
  const drawerContent = document.querySelector('#categories-section');

  fetchJsonData(CATEGORIES_URL)

    .then(jsonData => {
      if (localStorage.length != 0) {
        let dataToFilter = JSON.parse(JSON.stringify(jsonData));        
        filterLayersBySelectedTags(dataToFilter, JSON.parse(localStorage.selectedTags));

        populateDrawer(dataToFilter, drawerContent);
        return dataToFilter;

      } else {
        // Accordions creation    
        populateDrawer(jsonData, drawerContent);
        return jsonData;
      }
    })

    .then(jsonData => {
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
      // activateLayersWMS(allCheckboxLists, activeLayers, viewer);
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
        // activateLayersWMS(allCheckboxLists, activeLayers, viewer);
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
    });
}

// Onboard page
const chipsContainer = document.querySelector('#chips-section');

if (chipsContainer) {
  fetchJsonData(CATEGORIES_URL)
    .then(jsonData => {
      const allTags = getAllTags(jsonData);

      allTags.forEach(tag => {
        let chip = document.createElement('app-chip');
        chip.setAttribute('tag', tag);
        chipsContainer.append(chip);
      });

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

      const clear = document.querySelector('#clear-local-storage');
      clear.addEventListener('click', () => {
        localStorage.clear();
      })
    })
}