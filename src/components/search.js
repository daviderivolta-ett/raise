export class Search extends HTMLElement {
    _data;
    _output;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        if (!this.hasAttribute('is-active')) this.setAttribute('is-active', 'false');
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    get output() {
        return this._output;
    }

    set output(output) {
        this._output = output;
        this.dispatchEvent(new CustomEvent('searchValue', { detail: { output: this._output } }));
    }

    render() {
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <app-searchbar></app-searchbar>
                <app-autocomplete></app-autocomplete>
            </div>
            `
            ;

        this.searchbar = this.shadow.querySelector('app-searchbar');
        this.autocomplete = this.shadow.querySelector('app-autocomplete');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/search.css');
        this.shadow.append(style);

        // js
        this.searchbar.addEventListener('searchValueChanged', event => {
            const search = event.detail.search.toLowerCase();
            let filteredData = this.filterLayersByTagName(this._data, search);

            if (search == '') {
                this.output = this.data;
            } else {
                this.output = filteredData;
            }

            if (search.length > 2) {
                let tags = this.filterTag(this._data, search);
                this.autocomplete.input = tags;
            } else {
                this.autocomplete.input = [];
            }
        });

        this.searchbar.addEventListener('lastKey', event => {
            if (event.detail.lastKey == 'ArrowDown') this.autocomplete.setAttribute('last-key', event.detail.lastKey);
        });

        this.autocomplete.addEventListener('changeFocus', () => {
            this.searchbar.focusInput();
        });

        this.autocomplete.addEventListener('selectedTag', event => {
            this.searchbar.selectedTag = event.detail.selectedTag;
        });
    }

    static observedAttributes = ['is-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-active') {
                let isActive = JSON.parse(this.getAttribute('is-active'));
                isActive == true ? this.classList.add('visible') : this.classList.remove('visible');
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
        data.categories.forEach(category => {
            category.groups.forEach(group => {
                group.layers.forEach(layer => {
                    if (layer.tags) {
                        layer.tags.forEach(tag => {
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
}

customElements.define('app-search', Search);