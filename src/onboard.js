// Import modules
import { fetchJsonData } from "./settings.js";
import { getAllTags } from "./utils/getAllTags";

// Import data
const CATEGORIES_URL = '../json/categories.json';

// Import web components
import './components/chip/chip.js';

// Fill pills
fetchJsonData(CATEGORIES_URL)
    .then(jsonData => {
        const allTags = getAllTags(jsonData);
        const pillSsection = document.querySelector('#pills');
        allTags.forEach(tag => {
            let chip = document.createElement('app-chip');
            chip.setAttribute('tag', tag);
            pillSsection.append(chip);
        })
    })