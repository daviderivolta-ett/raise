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
        this.input.value = selectedTag;
        this._selectedTag = null;
    }

    focusInput() {
        this.input.focus();
    }

    render() {
        this.input.setAttribute('value', this.getAttribute('value'));
        this.input.value = this.getAttribute('value');

        let isActive = JSON.parse(this.getAttribute('is-active'));
        isActive == true ? this.classList.add('visible') : this.classList.remove('visible');
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <input type="search" name="search" id="search" placeholder="Cerca per livelli..." value="">
            `
            ;

        this.input = this.shadow.querySelector('input');
        if (!this.hasAttribute('is-active')) this.setAttribute('is-active', 'false');
        if (!this.hasAttribute('value')) this.setAttribute('value', '');

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

    static observedAttributes = ['value', 'is-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'is-active') {
                this.render();
            }

            if (name == 'value') {
                const event = new CustomEvent('searchValueChanged', { detail: { search: newValue } });

                this.dispatchEvent(event);
                this.render();
            }
        }
    }
}

customElements.define('app-searchbar', Searchbar);