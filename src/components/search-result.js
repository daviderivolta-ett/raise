import { SettingService } from '../services/SettingService.js';
import { SearchObservable } from '../observables/SearchObservable.js';

export class SearchResult extends HTMLElement {
    _layers;
    _searchValue;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', false);
    }

    get layers(){
        return this._layers;
    }

    set layers(layers) {
        this._layers = layers;
        this.render();
    }

    get searchValue(){
        return this._searchValue;
    }

    set searchValue(searchValue) {
        this._searchValue = searchValue;
    }

    render() {
        this.text.innerText = this.searchValue;
        this.div.innerHTML = '';
        this.layers.forEach(layer => {
            let chip = document.createElement('app-search-result-chip');
            chip.layer = layer;
            this.div.append(chip);
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <h3>Risultati per: <span class="search-result"></span></h3>
            <div></div>
            `
        ;

        this.text = this.shadow.querySelector('.search-result');
        this.div = this.shadow.querySelector('div');

        // js
        SearchObservable.instance.subscribe('filtertags', search => {
            search.tags.length != 0 ? this.setAttribute('is-open', true) : this.setAttribute('is-open', false);
            this.searchValue = search.value;
            this.layers = this.filterLayersBySelectedTags(SettingService.instance.data, search.tags);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/search-result.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'is-open') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
            }
        }
    }

    filterLayersBySelectedTags(dataToFilter, array) {
        const filteredLayers = [];

        dataToFilter.categories.forEach(category => {
            category.groups.forEach(group => {
                const filteredGroupLayers = group.layers.filter(layer => {
                    if (layer.tags) {
                        return array.some(value => layer.tags.includes(value));
                    }
                    return false;
                });
                filteredLayers.push(...filteredGroupLayers);
            });
        });

        return filteredLayers;
    }

}

customElements.define('app-search-result', SearchResult);