// Import modules
import CesiumViewer from './src/components/map.js';
import * as Cesium from 'cesium';

// Import methods
import { getPosition } from './src/utils/position.js';
import { filterTag, filterLayersByTagName, filterLayersByTags } from './src/utils/filter.js';
import { fetchJsonData, fetchSvgIcon } from './src/settings.js';
import { createRandomPopulation, evolvePopulation } from './src/utils/tsp.js';

// Import data
const CATEGORIES_URL = './json/categories.json';
const THEMES_URL = './json/themes.json';

// Import service worker
import './service-worker.js';

// Import web components
import './src/components/map.js';
import './src/components/rail.js';
import './src/components/drawer-toggle.js';
import './src/components/settings.js';
import './src/components/link-icon.js';
import './src/components/theme-icon.js';
import './src/components/search.js';
import './src/components/searchbar.js';
import './src/components/autocomplete.js';
import './src/components/carousel.js';
import './src/components/layer-chip.js';
import './src/components/bench.js';
import './src/components/bench-layer.js';
import './src/components/drawer.js';
import './src/components/accordion.js';
import './src/components/checkbox-list.js';
import './src/components/checkbox.js';
import './src/components/opacity.js';
import './src/components/activate-navigation-btn.js';
import './src/components/opacity-slider.js';
import './src/components/navigation-btn.js';
import './src/components/info-drawer.js';
import './src/components/play-info-btn.js';
import './src/components/goto-btn.js';
import './src/components/add-to-route-btn.js';
import './src/components/path-drawer.js';
import './src/components/path-tools.js';
import './src/components/flush-btn.js';
import './src/components/sort-features-btn.js';
import './src/components/empty-path-drawer-msg.js';
import './src/components/path-infobox.js';
import './src/components/save-route-btn.js';
import './src/components/save-route-input.js';
import './src/components/remove-btn.js';
import './src/components/map-controls.js';
import './src/components/path-drawer-toggle.js';
import './src/components/center-position-btn.js';
import './src/components/zoom-button.js';
import './src/components/snackbar.js';
import './src/components/tag-selection.js';
import './src/components/chip.js';
import './src/components/submit-tags-btn.js';

// DOM nodes
const main = document.querySelector('main');
const menuToggle = document.querySelector('app-drawer-toggle');
const settings = document.querySelector('app-settings');
const drawer = document.querySelector('#drawer');
const search = document.querySelector('app-search');
const carousel = document.querySelector('app-carousel');
const bench = document.querySelector('app-bench');
const drawerContent = document.querySelector('app-drawer');
const pathDrawer = document.querySelector('app-path-drawer');
const pathDrawerToggle = document.querySelector('app-path-drawer-toggle');
const mapControls = document.querySelector('app-map-controls');
const rail = document.querySelector('app-rail');
const infoDrawer = document.querySelector('app-info-drawer');

// Map initialization
const map = new CesiumViewer();

// Map controls
mapControls.addEventListener('zoomIn', () => map.viewer.camera.zoomIn(1000.0));
mapControls.addEventListener('zoomOut', () => map.viewer.camera.zoomOut(1000.0));

// Theme button
map.fetchThemes(THEMES_URL)
  .then(themes => {
    rail.setAttribute('themes', JSON.stringify(themes));
    settings.themes = themes;
  });

settings.addEventListener('themeChanged', event => {
  map.changeTheme(event.detail.theme);
});

rail.addEventListener('themeChanged', (event) => {
  const theme = event.detail.newValue;
  map.changeTheme(theme);
});

// Menu toggle
menuToggle.addEventListener('drawerToggled', event => {
  const isOpen = event.detail.isOpen;
  search.setAttribute('is-active', isOpen + '');
  // searchBar.setAttribute('is-active', isOpen + '');
  drawerContent.setAttribute('is-active', isOpen + '');
  settings.setAttribute('is-active', isOpen);
});

// Rail behaviour
rail.addEventListener('drawerToggled', (event) => {
  if (event.detail.newValue == 'true') {
    infoDrawer.setAttribute('is-open', 'false');
    drawer.classList.add('drawer-open');
  } else {
    drawer.classList.remove('drawer-open');
  }
});

// Infobox Drawer
infoDrawer.addEventListener('goto', event => {
  const coordinates = event.detail;
  map.goto(coordinates);
});

infoDrawer.addEventListener('addToRoute', (event) => {
  let features = pathDrawer.features;
  let feature = event.detail.data;

  if (!features.some(obj => JSON.stringify(obj) === JSON.stringify(feature))) {
    features.push(feature);
  } else {
    let snackbar = document.createElement('app-snackbar');
    snackbar.setAttribute('type', 'temporary');
    snackbar.setAttribute('text', 'Tappa già presente nel percorso.')
    main.append(snackbar);
  }

  pathDrawer.features = features;
  pathDrawer.setAttribute('is-open', 'true');
});

// Cursor on map
map.viewer.screenSpaceEventHandler.setInputAction(movement => {
  map.mouseOver(movement);
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// Import cluster icons
const clusterIcons = [];
for (let i = 0; i <= 2; i++) {
  fetchSvgIcon(i + 2)
    .then(clusterIcon => clusterIcons.push(clusterIcon));
}

// Path drawer
pathDrawerToggle.addEventListener('togglePathDrawer', event => {
  const e = event.detail.newValue;
  pathDrawer.setAttribute('is-open', e + '');
});

pathDrawer.addEventListener('goto', event => {
  const coordinates = event.detail;
  map.goto(coordinates);
});

pathDrawer.addEventListener('pathDrawerStatusChanged', (event) => {
  const e = event.detail.newValue;
  mapControls.setAttribute('is-route', e + '');
  pathDrawerToggle.setAttribute('is-open', e + '');
});

pathDrawer.addEventListener('empty', () => rail.setAttribute('is-open', 'true'));

pathDrawer.addEventListener('selectedFeature', (e) => {
  const feature = e.detail.data;
  map.setCameraToPosition(feature.coordinates);
  infoDrawer.setAttribute('data', JSON.stringify(feature));
  infoDrawer.setAttribute('is-open', 'true');
  rail.setAttribute('is-open', 'false');
});

pathDrawer.addEventListener('saveCustomRoute', (e) => {
  localStorage.setItem('customRoute', JSON.stringify(e.detail.customRoute));

  let snackbar = document.createElement('app-snackbar');
  snackbar.setAttribute('type', 'closable');
  snackbar.setAttribute('text', `Salvato percorso "${e.detail.customRoute.name}".`)
  main.append(snackbar);
});

pathDrawer.addEventListener('activateNavigation', (e) => {
  if (e.detail.isNavigation == 'true') {
    const features = e.detail.features;
    map.startNavigation(features);
  } else {
    const entities = map.viewer.entities;
    map.removeAllEntities(entities);
  }
});

pathDrawer.addEventListener('sort', event => {
  getPosition().then(p => {
    let features = event.detail.features;
    let position = {};
    position.longitude = p.coords.longitude;
    position.latitude = p.coords.latitude;

    const populationSize = 100;
    const generations = 300;
    const initialPopulation = createRandomPopulation(features, populationSize);
    initialPopulation.forEach(path => path.unshift({ coordinates: position }));
    const optimizedPath = evolvePopulation(initialPopulation, generations);
    const path = optimizedPath.slice(1);
    pathDrawer.features = path;
  });
});

// Active layers
carousel.addEventListener('activeLayers', event => {
  map.handleCheckbox(event.detail.activeLayers, clusterIcons);
});

// Carousel
carousel.addEventListener('benchlayer', event => {
  bench.input = event.detail.layer;
});

// Autocomplete behaviour
// autocomplete.addEventListener('autocompleteSelected', (event) => {
//   const choosenAutocomplete = event.detail.newValue;
//   searchBar.setAttribute('value', choosenAutocomplete);
// });

// document.addEventListener('keydown', (event) => {
//   autocomplete.setAttribute('last-key-pressed', event.key);
// });

// Drawer content
try {
  let snackbar = document.createElement('app-snackbar');
  snackbar.setAttribute('type', 'loader');
  main.append(snackbar);

  fetchJsonData(CATEGORIES_URL).then(async jsonData => {
    let filteredData = filterLayersByTags(jsonData, JSON.parse(localStorage.selectedTags));
    carousel.data = filteredData;
    // let layers = [];

    // filteredData.categories.forEach(category => {
    //   category.groups.forEach(group => {
    //     group.layers.forEach(layer => {
    //       layers.push(layer);
    //     });
    //   });
    // });

    // await map.handleCheckbox(layers, clusterIcons);

    main.append(drawerContent);
    drawerContent.data = jsonData;

    drawerContent.addEventListener('activeLayers', async (event) => {
      let activeLayers = event.detail.activeLayers
      try {
        let snackbar = document.createElement('app-snackbar');
        snackbar.setAttribute('type', 'loader');
        main.append(snackbar);

        pathDrawer.setAttribute('is-navigation', 'false');
        await map.handleCheckbox(activeLayers, clusterIcons);

      } catch (error) {
        console.error('Errore durante il recupero dei layer dal geoserver', error);

      } finally {
        let snackbar = document.querySelector('app-snackbar[type="loader"]');
        snackbar.setAttribute('is-active', 'false');
      }
    });

    drawerContent.addEventListener('routeToggled', event => {
      const layerData = map.fetchLayerData(event.detail.layer);
      layerData.then(data => {
        let features = [];
        data.features.forEach(f => {
          let coordinates = map.getFeatureCoordinates(f);
          let layerNameToFetch = map.getLayerToFind(f);
          let foundLayer = map.filterLayerByName(jsonData, layerNameToFetch);

          let properties = f.properties;
          let propertiesToFind = foundLayer.relevant_properties;
          let layerName = foundLayer.name;
          let relevantProperties = map.getRelevantProperties(properties, propertiesToFind, layerName);

          let feature = {};
          feature.coordinates = coordinates;
          feature.layer = foundLayer;
          feature.properties = relevantProperties;

          features.push(feature);
        });

        let pathFeatures = pathDrawer.features;
        let path = [...pathFeatures];
        features.forEach(feature => {
          if (!path.some(item => item.coordinates.longitude == feature.coordinates.longitude)) {
            path.push(feature);
          }
        });
        pathDrawer.features = path;
        pathDrawer.setAttribute('is-open', 'true');
      });
    });

    // Click on map
    map.viewer.screenSpaceEventHandler.setInputAction(async movement => {
      rail.setAttribute('is-open', 'false');
      const feature = map.onClick(movement, jsonData);

      if (feature == undefined) {
        infoDrawer.setAttribute('is-open', 'false');
        pathDrawer.setAttribute('is-open', 'false');
        menuToggle.setAttribute('is-open', 'false');
        return;
      }

      infoDrawer.setAttribute('data', `${JSON.stringify(feature)}`);
      infoDrawer.setAttribute('is-open', 'true');
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Search bar
    search.data = jsonData;

    // Local storage
    let activeLayers = [];
    if (localStorage.customRoute && JSON.parse(localStorage.customRoute).features.length != 0) {
      pathDrawerToggle.setAttribute('is-open', 'true');
      mapControls.setAttribute('is-route', 'true');
      let customRoute = JSON.parse(localStorage.customRoute);
      pathDrawer.setAttribute('route-name', customRoute.name);
      pathDrawer.features = customRoute.features;

      const customRouteFeatures = JSON.parse(localStorage.customRoute).features;
      let layers = [];
      customRouteFeatures.map(feature => layers.push(feature.layer));

      let seenLayers = {};
      layers.forEach(item => {
        const value = item.layer;
        if (!seenLayers[value]) {
          seenLayers[value] = true;
          activeLayers.push(item);
        }
      });
      activeLayers = [...new Set(activeLayers)];
      drawerContent.input = activeLayers;
    }
  });

} catch (error) {
  console.error('Errore durante il recupero dei dati JSON', error);

} finally {
  let snackbar = document.querySelector('app-snackbar[type="loader"]');
  snackbar.setAttribute('is-active', 'false');
}

// Get user position
try {
  getPosition().then(position => {
    map.setCameraToUserPosition(position);
    map.createUserPin(position);
    mapControls.addEventListener('centerPosition', () => map.setCameraToUserPosition(position));
  });

} catch (error) {
  console.error(error);
  map.setCamera();
}