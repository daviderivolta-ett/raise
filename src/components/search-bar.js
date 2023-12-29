import { SettingService } from '../services/SettingService.js';

export class Searchbar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    focusInput() {
        this.input.focus();
    }

    render() {
        this.input.setAttribute('value', this.getAttribute('value'));
        this.input.value = this.getAttribute('value');
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <input type="search" name="search" id="search" placeholder="Cerca per livelli..." value="">
            `
            ;

        this.input = this.shadow.querySelector('input');
        if (!this.hasAttribute('value')) this.setAttribute('value', '');

        // js
        this.input.addEventListener('input', event => {
            this.setAttribute('value', this.input.value);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/searchbar.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['value'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'value') {
                newValue = newValue.toLowerCase();
                let layers = this.filterLayersByNameAndTag(SettingService.instance.data, newValue);
                this.dispatchEvent(new CustomEvent('search', { detail: { searchValue: newValue, layers } }));
                this.render();
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

customElements.define('app-searchbar', Searchbar);