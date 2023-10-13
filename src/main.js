// Import modules
import CesiumViewer from "./components/map/map.js";
import * as Cesium from 'cesium';

// Import methods
import { populateDrawer } from './utils/drawerPopulation.js';
import { handleFeatures } from './utils/handleInfobox.js';
import { filter } from './utils/searchFilter.js';
import { fetchJsonData } from './settings.js';
import { activateLayers } from './utils/fetchLayers.js';
import { accordionBehaviour } from './utils/accordionbehaviour.js';

// Import data
import jsonFile from './json/categories.json';

// Import web components
import './components/map/map.js';
import './components/checkbox/checkbox.js';
import './components/checkbox-list/checkbox-list.js';
import './components/infobox/infobox.js';
import './components/accordion/accordion.js';
import './components/search/search.js';
import './components/drawer-toggle/drawer-toggle.js';

// Map initialization
const viewer = new CesiumViewer();

const url = 'https://mappe.comune.genova.it/geoserver/wms';
const parameters = {
  format: 'image/png',
  transparent: true
}

viewer.setCamera();

// Accordions creation
const jsonData = await fetchJsonData(jsonFile);
const accordionsSection = document.querySelector('#categories-section');
populateDrawer(jsonData, accordionsSection);

// Toggle behaviour
const drawerToggle = document.querySelector('app-drawer-toggle');
const drawer = document.querySelector('#drawer');
drawerToggle.addEventListener('drawerToggled', (event) => {
  drawer.classList.toggle('drawer-open');
});

// Infobox behaviour
const infoBox = document.querySelector('app-infobox');

viewer.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
  viewer.onClick(movement.position)
    .then(features => {
      console.log(features);
      handleFeatures(features, infoBox);
    })
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

const closeIcon = infoBox.shadowRoot.querySelector('#close-icon');
closeIcon.addEventListener('click', () => {
  infoBox.classList.remove('visible');
});

drawer.addEventListener('click', () => {
  infoBox.classList.remove('visible');
});

// Checkbox list behaviour
const activeLayers = [];
const allCheckboxLists = document.querySelectorAll('app-checkbox-list');
activateLayers(allCheckboxLists, activeLayers, viewer, url, parameters);

// Accordion behaviour
const categoryAccordion = document.querySelectorAll('.category-accordion');
const layerAccordion = document.querySelectorAll('.layer-accordion');
accordionBehaviour(categoryAccordion, layerAccordion);

// Search bar
const searchBar = document.querySelector('app-searchbar');
const drawerTitle = document.querySelector('#drawer-title');

searchBar.addEventListener('searchValueChanged', (event) => {
  accordionsSection.innerHTML = ``;
  const valueToSearch = event.detail.newValue;
  drawerTitle.textContent = `Livelli per: ${valueToSearch}`;

  let dataToFilter = JSON.parse(JSON.stringify(jsonData));

  filter(dataToFilter, valueToSearch);

  if (valueToSearch == '') {
    populateDrawer(jsonData, accordionsSection);
    drawerTitle.textContent = 'Categorie';
  } else {
    populateDrawer(dataToFilter, accordionsSection);

    if (!accordionsSection.innerHTML) {
      const emptyMsg = document.createElement('p');
      emptyMsg.innerText = `Nessun livello trovato per ${valueToSearch}`;
      accordionsSection.append(emptyMsg);
    }
  }

  const allCheckboxLists = document.querySelectorAll('app-checkbox-list');
  activateLayers(allCheckboxLists, activeLayers, viewer, url, parameters);

  const categoryAccordion = document.querySelectorAll('.category-accordion');
  const layerAccordion = document.querySelectorAll('.layer-accordion');
  accordionBehaviour(categoryAccordion, layerAccordion);
});