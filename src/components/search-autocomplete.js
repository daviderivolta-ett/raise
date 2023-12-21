import { SearchObservable } from '../observables/SearchObservable.js';
import { SettingService } from '../services/SettingService.js';

export class SearchAutocomplete extends HTMLElement {
    static selectedSpan = 0;
    _input;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this._input = [];
    }

    get input() {
        return this._input;
    }

    set input(input) {
        this._input = input;
        this.render();
    }

    render() {
        SearchAutocomplete.selectedSpan = 0;
        this.div.innerHTML = '';

        if (this.input.length == 0) return;

        for (let i = 0; i < this.input.length; i++) {
            this.span = document.createElement('span');
            this.span.textContent = this.input[i].name;
            this.span.setAttribute('name', this.input[i].name);
            this.span.setAttribute('tabindex', i + 1);
            this.div.append(this.span);
        }

        this.spans = this.shadow.querySelectorAll('span');
        this.spans.forEach(span => {
            span.addEventListener('click', () => {
                this.setAttribute('selected', span.getAttribute('name'));
            });

            span.addEventListener('keydown', event => {
                this.setAttribute('last-key', event.key);
            });
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`;
        this.div = this.shadow.querySelector('div');
        this.setAttribute('selected', '');

        // js
        SearchObservable.instance.subscribe('search', searchValue => {
            searchValue = searchValue.toLowerCase();
            let search = {};
            search.value = searchValue;

            if (searchValue.length > 2) {
                let layers = this.filterLayersByNameAndTag(SettingService.instance.data, searchValue);
                

                // let tags = this.filterTag(SettingService.instance.data, searchValue);
                // search.tags = tags;
                search.layers = layers;
                SearchObservable.instance.publish('filterlayers', search);
                // this.input = tags;
                this.input = layers;
            } else {
                // search.tags = [];
                search.layers = [];
                SearchObservable.instance.publish('filterlayers', search);
                // this.input = [];
                this.input = [];
            }
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/autocomplete.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['selected', 'last-key'];
    attributeChangedCallback(name, oldValue, newValue) {

        if (name == 'selected') {
            const event = new CustomEvent('selectedtag', {
                detail: { selectedTag: newValue }
            });

            this.dispatchEvent(event);
            this.div.innerHTML = '';
        }

        if (name == 'last-key') {
            if (newValue == 'ArrowDown') {
                SearchAutocomplete.selectedSpan++;
                if (SearchAutocomplete.selectedSpan == this.spans.length + 1) SearchAutocomplete.selectedSpan = 1;
                this.shadow.querySelector(`span[tabIndex="${SearchAutocomplete.selectedSpan}"]`).focus();
            }

            if (newValue == 'ArrowUp') {
                SearchAutocomplete.selectedSpan--;
                if (SearchAutocomplete.selectedSpan == 0) {
                    this.dispatchEvent(new CustomEvent('changeFocus'));
                } else {
                    this.shadow.querySelector(`span[tabIndex="${SearchAutocomplete.selectedSpan}"]`).focus();
                }
            }

            if (newValue == 'Enter') {
                this.setAttribute('selected', this.shadow.activeElement.getAttribute('name'));
                this.div.innerHTML = '';
            }
        }
    }

    filterLayersByTagName(dataToFilter, value) {
        let filteredData = JSON.parse(JSON.stringify(dataToFilter));

        filteredData.categories = filteredData.categories.map(category => {
            category.groups = category.groups.map(group => {
                group.layers = group.layers.filter(layer => {
                    if (layer.tags) {
                        return layer.tags.some(tag => tag.includes(value));
                    }
                    return false;
                });

                return group.layers.length > 0 ? group : null;
            }).filter(Boolean);

            return category.groups.length > 0 ? category : null;
        }).filter(Boolean);

        return filteredData;
    }

    filterTag(data, value) {
        let foundTags = [];
        data.categories.map(category => {
            category.groups.map(group => {
                group.layers.map(layer => {
                    if (layer.tags) {
                        layer.tags.map(tag => {
                            if (tag.includes(value)) {
                                foundTags.push(tag);
                            }
                        });
                    }
                });
            });
        });

        const uniqueFoundTags = [...new Set(foundTags)];
        return uniqueFoundTags;
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

customElements.define('app-autocomplete', SearchAutocomplete);