// Import methods
import { fetchJsonData } from './src/settings.js';

// Import web components
import './src/components/tag-selection.js';
import './src/components/chip.js';
import './src/components/submit-tags-btn.js';
import './src/components/select-all-tags-btn.js';
import './src/components/reset-tags-btn.js';
import './src/components/snackbar.js';

// DOM Nodes
const main = document.querySelector('main');
const component = document.querySelector('app-tag-selection');

// Import data
const CATEGORIES_URL = './json/categories.json';

try {
    let snackbar = document.createElement('app-snackbar');
    snackbar.setAttribute('type', 'loader');
    main.append(snackbar);
    fetchJsonData(CATEGORIES_URL).then(jsonData => {
        component.setAttribute('input', JSON.stringify(jsonData));
    })

} catch (error) {
    console.error('Errore durante il recupero dei dati JSON', error);

} finally {
    let snackbar = document.querySelector('app-snackbar[type="loader"]');
    snackbar.setAttribute('is-active', 'false');
}