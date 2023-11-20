import { filterLayersBySelectedTags } from '../utils/filter.js';

export class Drawer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.dataPromise = new Promise((resolve) => {
            this.dataResolver = resolve;
        });
    }

    render() {
    }

    async connectedCallback() {
        this.shadow.innerHTML =
            `
            <div id="categories-section"></div>
            `
            ;

        this.div = this.shadow.querySelector('#categories-section');

        // Accordions creation
        let jsonData = await this.dataPromise;
        if (localStorage.length != 0) {
            let dataToFilter = JSON.parse(JSON.stringify(jsonData));
            let selectedTags = JSON.parse(localStorage.selectedTags);
            filterLayersBySelectedTags(dataToFilter, selectedTags);
            await populateDrawer(dataToFilter, this.div);
            jsonData = dataToFilter;
        } else {
            await populateDrawer(jsonData, this.div);
        }

        // DOM nodes
        const allCategoryAccordions = this.shadow.querySelectorAll('.category-accordion');
        const allLayerAccordions = this.shadow.querySelectorAll('.layer-accordion');
        const allCheckboxLists = this.shadow.querySelectorAll('app-checkbox-list');

        // Accordion behaviour
        accordionBehaviour(allCategoryAccordions, allLayerAccordions);

        // Checkbox list behaviour
        const activeLayers = [];

        allCheckboxLists.forEach(checkboxList => {
            checkboxList.addEventListener('checkboxListChanged', async (event) => {
                const checkboxListLayers = event.detail.input;
                await checkLayerToRemove(checkboxListLayers, activeLayers);

                const checkboxListLayersToAdd = JSON.parse(event.detail.newValue);
                checkboxListLayersToAdd.forEach(layer => {
                    activeLayers.push(layer);
                });

                this.setAttribute('active-layers', JSON.stringify(activeLayers));
            });
        });
    }

    static observedAttributes = ['data', 'active-layers'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {

            if (name == 'data') {
                this.dataResolver(JSON.parse(newValue));
            }

            if (name == 'active-layers') {
                const event = new CustomEvent('activeLayersChanged', {
                    detail: { name, oldValue, newValue: JSON.parse(newValue) }
                });
                this.dispatchEvent(event);
            }
        }
    }
}

customElements.define('app-drawer', Drawer);

/* Functions */
async function populateDrawer(jsonData, div) {
    jsonData.categories.forEach(item => {
        const categoryAccordion = document.createElement('app-accordion');

        categoryAccordion.setAttribute('title', item.name);
        categoryAccordion.classList.add('category-accordion');

        item.groups.forEach((item, index, array) => {
            const layerAccordion = document.createElement('app-accordion');
            if (index === array.length - 1) {
                layerAccordion.classList.add('last-accordion');
            }

            layerAccordion.setAttribute('title', item.name);
            layerAccordion.classList.add('layer-accordion');

            const checkboxList = document.createElement('app-checkbox-list');
            checkboxList.setAttribute('input', JSON.stringify(item.layers));
            layerAccordion.append(checkboxList);

            categoryAccordion.append(layerAccordion);
            div.append(categoryAccordion);
        });
    });
}

function accordionBehaviour(allCategoryAccordions, allLayerAccordions) {
    allCategoryAccordions.forEach(item => {
        item.addEventListener('accordionChanged', (event) => {

            allCategoryAccordions.forEach(item => {
                if (item != event.target) {
                    item.setAttribute('is-active', 'false');
                }
            });

            allLayerAccordions.forEach(item => {
                item.setAttribute('is-active', 'false');
            });
        });
    });

    allLayerAccordions.forEach(item => {
        item.addEventListener('accordionChanged', (event) => {

            allLayerAccordions.forEach(item => {
                if (item != event.target) {
                    item.setAttribute('is-active', 'false');
                }
            });

        });
    });
}

async function checkLayerToRemove(allLayers, activeLayers) {
    allLayers.forEach(layer => {
        const layerToRemoveIndex = activeLayers.findIndex(item => item.layer === layer.layer);

        if (layerToRemoveIndex !== -1) {
            activeLayers.splice(layerToRemoveIndex, 1);
        }
    });
}