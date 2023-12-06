export class DrawerContent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        // Accordions creation
        let jsonData = JSON.parse(this.getAttribute('data'));

        this.div.innerHTML = '';

        if (localStorage.length != 0) {
            let dataToFilter = jsonData;
            let selectedTags = JSON.parse(localStorage.selectedTags);
            filterLayersBySelectedTags(dataToFilter, selectedTags);
            // populateDrawer(dataToFilter, this.div);
            //
            createDrawer(dataToFilter, this.div);
            //
            jsonData = dataToFilter;

            if (jsonData.categories.length == 0) {
                const msg = document.createElement('p');
                msg.innerText = 'Nessun livello trovato';
                this.div.append(msg);
            }

        } else {
            // populateDrawer(jsonData, this.div);
            //
            createDrawer(jsonData, this.div);
            //
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
                checkLayerToRemove(checkboxListLayers, activeLayers);

                const checkboxListLayersToAdd = JSON.parse(event.detail.newValue);
                checkboxListLayersToAdd.forEach(layer => {
                    activeLayers.push(layer);
                });

                this.setAttribute('active-layers', JSON.stringify(activeLayers));
            });
        });

        // Navigation
        allCheckboxLists.forEach(checkboxList => {
            checkboxList.addEventListener('routeTriggered', (event) => {
                this.setAttribute('navigation-data', event.detail.newValue);
            });
        });

        ////
        this.accordions = this.shadow.querySelectorAll('app-category-accordion');
        this.accordions.forEach(accordion => {
            accordion.addEventListener('accordionChanged', event => {
                const newValue = event.detail.newValue;
                if (newValue == 'true') {
                    this.accordions.forEach(item => {
                        if (item !== event.target) item.setAttribute('is-active', 'false');
                    });
                }
            });
        });

        let activeLayerss = [];
        this.accordions.forEach(accordion => {
            accordion.addEventListener('checkboxListChanged', event => {
                activeLayerss = [];
                this.accordions.forEach(accordion => {
                    const layers = JSON.parse(accordion.getAttribute('data'));
                    layers.forEach(layer => activeLayerss.push(layer));
                });
                this.setAttribute('active-layers', JSON.stringify(activeLayerss));
            });
        });
    }

    connectedCallback() {
        this.shadow.innerHTML =
            `
            <div id="categories-section"></div>
            `
        ;

        this.div = this.shadow.querySelector('#categories-section');
        this.setAttribute('navigation-data', '[]');
        this.setAttribute('active-layers', '[]');
    }

    static observedAttributes = ['data', 'active-layers', 'navigation-data'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {

            if (name == 'data') {
                this.render();
            }

            if (name == 'active-layers') {
                const event = new CustomEvent('activeLayersChanged', {
                    detail: { name, oldValue, newValue: JSON.parse(newValue) }
                });
                this.dispatchEvent(event);

                console.log('New layers:');
                console.log(JSON.parse(newValue));

                this.accordions = this.shadow.querySelectorAll('app-category-accordion');
                this.accordions.forEach(accordion => {
                    const accordionLayers = JSON.parse(accordion.getAttribute('data'));
                    console.log('Layers:');
                    console.log(accordionLayers);
                });
            }

            if (name == 'navigation-data') {
                if (newValue == '[]') {
                    const allCheckboxLists = this.shadow.querySelectorAll('app-checkbox-list');
                    allCheckboxLists.forEach(checkboxList => checkboxList.setAttribute('navigation-data', '[]'));
                }

                const event = new CustomEvent('routeTriggered', { detail: { newValue } });
                this.dispatchEvent(event);
            }

        }
    }
}

customElements.define('app-drawer-content', DrawerContent);

/* Functions */
function createDrawer(jsonData, div) {
    jsonData.categories.forEach(item => {
        const categoryAccordion = document.createElement('app-category-accordion');
        categoryAccordion.setAttribute('input', JSON.stringify(item));
        div.append(categoryAccordion);
    });
}

function populateDrawer(jsonData, div) {
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

function checkLayerToRemove(allLayers, activeLayers) {
    allLayers.forEach(layer => {
        const layerToRemoveIndex = activeLayers.findIndex(item => item.layer === layer.layer);

        if (layerToRemoveIndex !== -1) {
            activeLayers.splice(layerToRemoveIndex, 1);
        }
    });
}

function filterLayersBySelectedTags(dataToFilter, array) {
    dataToFilter.categories.forEach(category => {
        category.groups.forEach(group => {
            group.layers = group.layers.filter(layer => {
                if (layer.tags) {
                    return array.some(value => layer.tags.includes(value));
                }
                return false;
            });

            if (group.layers.length === 0) {
                category.groups = category.groups.filter(existingGroup => existingGroup !== group);
            }
        });

        if (category.groups.length === 0) {
            dataToFilter.categories = dataToFilter.categories.filter(existingCategory => existingCategory !== category);
        }
    });
};