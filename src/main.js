// Import modules
import './style.css';
import CesiumViewer from "./components/map/map.js";
import * as Cesium from 'cesium';
import { populateDrawer } from './utils/drawerPopulation.js';
import { handleFeatures } from './utils/handleInfobox.js';

// Import web components
import './components/map/map.js';
import './components/checkbox/checkbox.js';
import './components/checkbox-list/checkbox-list.js';
import './components/infobox/infobox.js';
import './components/accordion/accordion.js';
import './components/search/search.js';

// Map initialization
const viewer = new CesiumViewer();

const url = 'https://mappe.comune.genova.it/geoserver/wms';
const parameters = {
  format: 'image/png',
  transparent: true
}

viewer.setCamera();

// Accordions creation
populateDrawer();

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

const drawer = document.querySelector('#drawer');
drawer.addEventListener('click', () => {
  infoBox.classList.remove('visible');
});

// Checkbox list behaviour
const allCheckboxLists = document.querySelectorAll('app-checkbox-list');

const activeLayers = [];

allCheckboxLists.forEach(checkboxList => {
  checkboxList.addEventListener('checkboxListChanged', (event) => {

    const checkboxListLayersToRemove = event.detail.input;

    checkboxListLayersToRemove.forEach(layer => {
      const layerToRemoveIndex = activeLayers.findIndex(item => item.layer === layer.layer);

      if (layerToRemoveIndex !== -1) {
        activeLayers.splice(layerToRemoveIndex, 1);
      }
    });

    const checkboxListLayersToAdd = JSON.parse(event.detail.newValue);
    checkboxListLayersToAdd.forEach(layer => {
      activeLayers.push(layer);
    });

    // console.log(activeLayers);

    const toRemove = [...viewer.viewer.imageryLayers._layers].splice(1);
    toRemove.forEach(item => {
      viewer.removeLayer(item._imageryProvider._layers);
    });

    for (const layer of activeLayers) {
      viewer.addLayer(url, layer.layer, parameters);
    }

  });
});

// Accordion behaviour
const categoryAccordion = document.querySelectorAll('.category-accordion');
const layerAccordion = document.querySelectorAll('.layer-accordion');

categoryAccordion.forEach(item => {
  item.addEventListener('accordionChanged', (event) => {

    categoryAccordion.forEach(item => {
      if (item != event.target) {
        item.setAttribute('is-active', 'false');
      }
    });

    layerAccordion.forEach(item => {
      item.setAttribute('is-active', 'false');
    });
  });
});

layerAccordion.forEach(item => {
  item.addEventListener('accordionChanged', (event) => {

    layerAccordion.forEach(item => {
      if (item != event.target) {
        item.setAttribute('is-active', 'false');
      }
    });

  });
});

// Search bar