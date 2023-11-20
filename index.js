// Import methods
import { fetchJsonData } from './src/settings.js';

// Import web components
import './src/components/chip.js';
import './src/components/button.js';

// DOM Nodes
const chipsContainer = document.querySelector('#chips-section');

// Import data
const CATEGORIES_URL = './json/categories.json';
let jsonData = await fetchJsonData(CATEGORIES_URL);

// Create tag chips
const allTags = getAllTags(jsonData);

allTags.forEach(tag => {
    let chip = document.createElement('app-chip');
    chip.setAttribute('tag', tag);
    chipsContainer.append(chip);
});

// Button / chips behaviour
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

// Select chips which tags are already in localStorage
if (localStorage.selectedTags) {
    const selectedTags = JSON.parse(localStorage.selectedTags);
    selectedTags.forEach(tag => {
        chips.forEach(chip => {
            if (chip.getAttribute('tag') == tag) {
                chip.setAttribute('is-selected', 'true');
            }
        })
    });
}

// Select all chips button
const selectAllBtn = document.querySelector('#select-all-btn');
selectAllBtn.addEventListener('click', () => {
    chips.forEach(chip => {
        chip.setAttribute('is-selected', 'true');
    });
});

// Deselect all chips button
const resetBtn = document.querySelector('#reset-btn');
resetBtn.addEventListener('click', () => {
    chips.forEach(chip => {
        chip.setAttribute('is-selected', 'false');
    });
});

// Clear localStorage
const clear = document.querySelector('#clear-local-storage');
clear.addEventListener('click', () => localStorage.clear());

// Get all tags
function getAllTags(data) {

    let foundTags = [];

    data.categories.forEach(category => {
        category.groups.forEach(group => {
            group.layers.forEach(layer => {

                if (layer.tags) {
                    layer.tags.forEach(tag => {
                        foundTags.push(tag);
                    });
                }

            });
        });
    });

    const uniqueFoundTags = [...new Set(foundTags)];
    uniqueFoundTags.sort();
    return uniqueFoundTags;
}