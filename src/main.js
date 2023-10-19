// Import modules
import CesiumViewer from "./components/map/map.js";
import * as Cesium from 'cesium';

// Import methods
import { populateDrawer } from './utils/drawerPopulation.js';
import { handleFeatures } from './utils/handleInfobox.js';
import { filterLayer } from './utils/filterLayersByTag.js';
import { fetchJsonData } from './settings.js';
import { activateLayers } from './utils/activateLayers.js';
import { accordionBehaviour } from './utils/accordionBehaviour.js';
import { filterTag } from "./utils/filterTagByName.js";

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

// Map initialization
const viewer = new CesiumViewer();

const url = 'https://mappe.comune.genova.it/geoserver/wms';
const parameters = {
  format: 'image/png',
  transparent: true
}

viewer.setCamera();

// Accordions creation
// const jsonData = await fetchJsonData(jsonFile);
// const accordionsSection = document.querySelector('#categories-section');
// populateDrawer(jsonData, accordionsSection);

fetchJsonData(CATEGORIES_URL)
  .then(jsonData => {
    const accordionsSection = document.querySelector('#categories-section');
    populateDrawer(jsonData, accordionsSection);

    // DOM nodes
    const drawerToggle = document.querySelector('app-drawer-toggle');
    const drawer = document.querySelector('#drawer');
    const infoBox = document.querySelector('app-infobox');

    const closeIcon = infoBox.shadowRoot.querySelector('#close-icon');

    const allCheckboxLists = document.querySelectorAll('app-checkbox-list');

    const categoryAccordion = document.querySelectorAll('.category-accordion');
    const layerAccordion = document.querySelectorAll('.layer-accordion');

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

    // Infobox behaviour
    viewer.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
      viewer.onClick(movement.position)
        .then(features => {
          handleFeatures(features, infoBox, jsonData);
          drawerToggle.setAttribute('is-open', 'false');
        })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    closeIcon.addEventListener('click', () => {
      infoBox.classList.remove('visible');
    });

    drawer.addEventListener('click', () => {
      infoBox.classList.remove('visible');
    });

    drawerToggle.addEventListener('click', () => {
      infoBox.classList.remove('visible');
    });

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
    activateLayers(allCheckboxLists, activeLayers, viewer, url, parameters);

    // Accordion behaviour
    accordionBehaviour(categoryAccordion, layerAccordion);

    // Search bar
    searchBar.addEventListener('searchValueChanged', (event) => {
      accordionsSection.innerHTML = ``;
      const valueToSearch = event.detail.newValue.toLowerCase();
      drawerTitle.textContent = `Livelli per: ${valueToSearch}`;

      let dataToFilter = JSON.parse(JSON.stringify(jsonData));

      filterLayer(dataToFilter, valueToSearch);

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











    const htmlOverlay = document.getElementById("htmlOverlay");
    const scratch = new Cesium.Cartesian2();


    viewer.viewer.screenSpaceEventHandler.setInputAction(
      function (click) {
        const position = viewer.viewer.scene.pickPosition(click.position);
        console.log(position);

        const canvasPosition = viewer.viewer.scene.cartesianToCanvasCoordinates(
          position,
          scratch
        );

        if (Cesium.defined(canvasPosition)) {
          htmlOverlay.style.top = `${canvasPosition.y}px`;
          htmlOverlay.style.left = `${canvasPosition.x}px`;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    viewer.viewer.scene.preRender.addEventListener(function () {
      const position = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 100);
      const canvasPosition = viewer.viewer.scene.cartesianToCanvasCoordinates(
        position,
        scratch
      );

      if (Cesium.defined(canvasPosition)) {
        htmlOverlay.style.top = `${canvasPosition.y}px`;
        htmlOverlay.style.left = `${canvasPosition.x}px`;
      }

    });


    // const htmlOverlay = document.getElementById("htmlOverlay");
    // const scratch = new Cesium.Cartesian2();

    // let currentCartesian = null;

    // viewer.viewer.screenSpaceEventHandler.setInputAction(function (click) {
    //   const cartesian = viewer.viewer.scene.pickPosition(click.position);

    //   if (Cesium.defined(cartesian)) {
    //     const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    //     const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
    //     const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);

    //     htmlOverlay.innerHTML = `<h1>Coordinate del Clic</h1><p>Longitudine: ${longitude}, Latitudine: ${latitude}</p>`;

    //     const canvasPosition = viewer.viewer.scene.cartesianToCanvasCoordinates(
    //       cartesian,
    //       scratch
    //     );

    //     if (Cesium.defined(canvasPosition)) {
    //       htmlOverlay.style.top = `${canvasPosition.y}px`;
    //       htmlOverlay.style.left = `${canvasPosition.x}px`;
    //       htmlOverlay.style.display = "block";
    //       currentCartesian = cartesian;
    //     }
    //   }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // // Imposta un gestore di eventi per la vista della mappa per riposizionare l'htmlOverlay
    // viewer.viewer.scene.preRender.addEventListener(function () {
    //   if (Cesium.defined(currentCartesian)) {
    //     const canvasPosition = viewer.viewer.scene.cartesianToCanvasCoordinates(
    //       currentCartesian,
    //       scratch
    //     );

    //     if (Cesium.defined(canvasPosition)) {
    //       htmlOverlay.style.top = `${canvasPosition.y}px`;
    //       htmlOverlay.style.left = `${canvasPosition.x}px`;
    //     }
    //   }
    // });



  });