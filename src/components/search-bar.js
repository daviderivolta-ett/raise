import { SearchObservable } from '../observables/SearchObservable.js';

export class Searchbar extends HTMLElement {
    _selectedTag;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    get selectedTag() {
        return this._selectedTag;
    }

    set selectedTag(selectedTag) {
        this._selectedTag = selectedTag;
        this.setAttribute('selected', this.selectedTag);
        this._selectedTag = null;
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
        if (!this.hasAttribute('selected')) this.setAttribute('selected', '');

        // js
        this.input.addEventListener('input', event => {
            this.setAttribute('value', this.input.value);
        });

        this.input.addEventListener('keydown', event => {
            this.dispatchEvent(new CustomEvent('lastKey', {
                detail: { lastKey: event.key }
            }));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/searchbar.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['value', 'selected'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'value') {
                newValue = newValue.toLowerCase();
                SearchObservable.instance.publish('search', newValue);
                this.render();
            }

            if (name == 'selected') {
                this.setAttribute('value', newValue.toLowerCase());
            }
        }
    }
}

customElements.define('app-searchbar', Searchbar);