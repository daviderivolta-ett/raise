// Import modules
import './style.css';
import CesiumViewer from "./components/map/map.js";
import * as Cesium from 'cesium';
import layers from './layers.json';
import bikeLayers from './bike.json';

// Import web components
import './components/map/map.js';
import './components/checkbox/checkbox.js';
import './components/checkbox-list/checkbox-list.js';
import './components/infobox/infobox.js';
import './components/radio/radio.js';

// Map
const viewer = new CesiumViewer();

const url = 'https://mappe.comune.genova.it/geoserver/wms';
const parameters = {
  format: 'image/png',
  transparent: true
}

for (let layer of layers) {
  viewer.addLayer(url, layer.layer, parameters);
}

// for (let layer of bikeLayers) {
//   viewer.addLayer(url, layer.layer, parameters);
// }

viewer.setCamera();

// Checkbox list
const checkboxList = document.querySelector('app-checkbox-list');
checkboxList.setAttribute('data', JSON.stringify(layers));

checkboxList.addEventListener('checkboxListChanged', (event) => {
  const toRemove = [...viewer.viewer.imageryLayers._layers].splice(1);
  toRemove.forEach(item => {
    viewer.removeLayer(item._imageryProvider._layers);
  });

  const layersToLoad = JSON.parse(event.detail.newValue);
  for (const layer of layersToLoad) {
    viewer.addLayer(url, layer.layer, parameters);
  }
});

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
closeIcon.addEventListener('click', (event) => {
  infoBox.classList.remove('visible');
});

checkboxList.addEventListener('click', (event) => {
  infoBox.classList.remove('visible');
});