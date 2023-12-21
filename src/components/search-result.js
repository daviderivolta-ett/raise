import { SearchObservable } from '../observables/SearchObservable.js';
import { SettingService } from '../services/SettingService.js';

export class SearchResult extends HTMLElement {
    _layers;
    _searchValue;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', false);
    }

    get layers() {
        return this._layers;
    }

    set layers(layers) {
        this._layers = layers;
        this.render();
    }

    get searchValue() {
        return this._searchValue;
    }

    set searchValue(searchValue) {
        this._searchValue = searchValue;
    }

    render() {
        this.div.innerHTML = '';
        if (this.layers.length == 0) {
            let msg = document.createElement('p');
            msg.innerText = 'Nessun livello trovato'
            this.div.append(msg);
        } else {
            this.layers.forEach(layer => {
                let chip = document.createElement('app-search-result-chip');
                chip.layer = layer;
                this.div.append(chip);
            });
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`;
        this.div = this.shadow.querySelector('div');

        // js
        SearchObservable.instance.subscribe('search', search => {
            this.searchValue = search;
            this.searchValue.length != 0 ? this.setAttribute('is-open', true) : this.setAttribute('is-open', false);
            let layers = this.filterLayersByNameAndTag(SettingService.instance.data, this.searchValue);
            this.layers = layers;
            this.div.scrollTop = 0;
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

    filterLayersByNameAndTag(obj, value) {
        let layers = [];
        obj.categories.forEach(category => {
            category.groups.forEach(group => {
                group.layers.forEach(layer => {
                    if (layer.name.toLowerCase().includes(value) || layer.tags.some(tag => tag.includes(value))) {
                        layers.push(layer);
                    }
                });
            });
        });

        return layers;
    }

}

customElements.define('app-search-result', SearchResult);