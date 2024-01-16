import { SettingService } from "../services/data.service.js";

export class TagSelection extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        // html
        this.text = document.createElement('h1');
        this.text.innerText = 'Seleziona i tag a cui sei interessato';
        this.shadow.append(this.text);

        this.container = document.createElement('div');
        this.shadow.append(this.container);

        this.input = JSON.parse(this.getAttribute('input'));
        const allTags = getAllTags(this.input);
        allTags.forEach(tag => {
            this.chip = document.createElement('app-chip');
            this.chip.setAttribute('tag', tag);
            this.container.append(this.chip);
        });

        this.submit = document.createElement('app-submit-tags-btn');
        this.shadow.append(this.submit);

        this.selectAll = document.createElement('app-select-all-tags-btn');
        this.shadow.append(this.selectAll);

        this.reset = document.createElement('app-reset-tags-btn');
        this.shadow.append(this.reset);

        this.clearLocalStorage = document.createElement('button');
        this.clearLocalStorage.innerText = 'Clear local storage';
        this.shadow.append(this.clearLocalStorage);

        this.allChips = this.shadow.querySelectorAll('app-chip');

        // js
        // Button / chips behaviour
        let selectedTags = [];

        this.allChips.forEach(chip => {
            chip.addEventListener('chipChanged', (event) => {

                if (event.detail.newValue == 'true') {
                    selectedTags.push(event.detail.tag);
                } else {
                    selectedTags = selectedTags.filter(item => item !== event.detail.tag);
                }

                this.submit.setAttribute('tags', JSON.stringify(selectedTags));
            });
        });

        // Select chips which tags are already in localStorage
        if (localStorage.selectedTags) {
            const selectedTags = JSON.parse(localStorage.selectedTags);
            selectedTags.forEach(tag => {
                this.allChips.forEach(chip => {
                    if (chip.getAttribute('tag') == tag) {
                        chip.setAttribute('is-selected', 'true');
                    }
                });
            });
        }

        // Select all chips button
        this.selectAll.addEventListener('selectAllTags', () => {
            this.allChips.forEach(chip => {
                chip.setAttribute('is-selected', 'true');
            });
        })

        // Deselect all chips button
        this.reset.addEventListener('resetTags', () => {
            this.allChips.forEach(chip => {
                chip.setAttribute('is-selected', 'false');
            });
        });

        // Clear localStorage
        this.clearLocalStorage.addEventListener('click', () => {
            localStorage.clear();
            console.log(localStorage);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tag-selection.css');
        this.shadow.append(style);
    }

    async connectedCallback() {
        const data = await SettingService.instance.getData();
        this.setAttribute('input', JSON.stringify(data));
    }

    static observedAttributes = ['input'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'input') this.render();
        }
    }
}

customElements.define('app-tag-selection', TagSelection);

// Functions
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