// Import modules
import './style.css';
import CesiumViewer from "./components/map/map.js";
import * as Cesium from 'cesium';

// Import web components
import './components/map/map.js';
import './components/checkbox/checkbox.js';
import './components/checkbox-list/checkbox-list.js';
import './components/infobox/infobox.js';
import './components/accordion/accordion.js';

// Import configs
import { fetchJsonData } from './settings.js';
const jsonData = await fetchJsonData();
console.log(jsonData);

// Map
const viewer = new CesiumViewer();

const url = 'https://mappe.comune.genova.it/geoserver/wms';
const parameters = {
  format: 'image/png',
  transparent: true
}

viewer.setCamera();

// Infobox
const infoBox = document.querySelector('app-infobox');

viewer.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
  viewer.onClick(movement.position)
    .then(features => {
      console.log(features);
      handleFeatures(features);
    })
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

const handleFeatures = (features) => {

  if (features != null) {
    infoBox.setAttribute('data', JSON.stringify(features.properties));
    infoBox.classList.add('visible');
  } else {
    infoBox.classList.remove('visible');
  }
}

const closeIcon = infoBox.shadowRoot.querySelector('#close-icon');
closeIcon.addEventListener('click', () => {
  infoBox.classList.remove('visible');
});

const drawer = document.querySelector('#drawer');
drawer.addEventListener('click', () => {
  infoBox.classList.remove('visible');
});

// Accordion creation
jsonData.categories.forEach(item => {
  const categoryAcordion = document.createElement('app-accordion');
  drawer.append(categoryAcordion);

  categoryAcordion.setAttribute('title', item.name);

  item.groups.forEach(item => {
    const layerAccordion = document.createElement('app-accordion');
    categoryAcordion.append(layerAccordion);
    layerAccordion.setAttribute('title', item.name);

    const checkboxList = document.createElement('app-checkbox-list');
    checkboxList.setAttribute('input', JSON.stringify(item.layers));
    layerAccordion.append(checkboxList);    
  });
});

// Checkbox list
const allCheckboxLists = document.querySelectorAll('app-checkbox-list');
console.log(allCheckboxLists);

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

    console.log(activeLayers);

    const toRemove = [...viewer.viewer.imageryLayers._layers].splice(1);
    toRemove.forEach(item => {
      viewer.removeLayer(item._imageryProvider._layers);
    });

    for (const layer of activeLayers) {
      viewer.addLayer(url, layer.layer, parameters);
    }

  });
});