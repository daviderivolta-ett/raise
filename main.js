// Import service worker
import './service-worker.js';

// Import router
import './src/components/router.js';

// Import web components
import './src/pages/map.page.js';
import './src/components/tag-selection.js';

import './src/components/tabs.toggle.component.js';
import './src/components/link-icon.component.js';
import './src/components/theme-icon.component.js';
import './src/components/search-bar.component.js';
import './src/components/search-result.component.js';
import './src/components/search-result.chip.component.js';
import './src/components/carousel.component.js';
import './src/components/carousel.chip.component.js';
import './src/components/bench.component.js';
import './src/components/bench.chip.component.js';
import './src/components/play-info-btn.component.js';
import './src/components/goto-btn.component.js';
import './src/components/add-to-route-btn.component.js';
import './src/components/center-position-btn.component.js';
import './src/components/snackbar.component.js';
import './src/components/chip.js';
import './src/components/submit-tags-btn.js';
import './src/components/select-all-tags-btn.js';
import './src/components/reset-tags-btn.js';
import './src/components/cesium-map.js';
import './src/components/tab.controller.component.js';
import './src/components/tab.info.component.js';
import './src/components/tab.customroute.component.js';
import './src/components/tab.customroute.card.component.js';
import './src/components/info.drawer.component.js';
import './src/components/bench.toggle.component.js';
import './src/components/tab.info.panel.component.js';
import './src/components/splash.component.js';
import './src/components/dialog.save-route.component.js';
import './src/components/dialog.empty-route.component.js';

// Routing
let loadMap = () => '<page-map></page-map>';
let loadIndex = () => `<app-tag-selection></app-tag-selection>`;
const router = document.querySelector('app-router');
const routes = {
  index: { routingFunction: loadIndex, type: 'default' },
  map: { routingFunction: loadMap, type: 'map' }
};
router.addRoutes(routes);