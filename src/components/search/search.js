export class Searchbar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        if (this.input) {
            this.input.setAttribute('value', this.getAttribute('value'));
            this.input.value = this.getAttribute('value');
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <input type="search" name="search" id="search" placeholder="Cerca per livelli..." value="">
            `
            ;

        this.input = this.shadow.querySelector('input');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/search.css');
        this.shadow.append(style);

        // js
        this.input.addEventListener('input', () => {
            this.setAttribute('value', this.input.value);
        });
    }

    static observedAttributes = ['value'];
    attributeChangedCallback(name, oldValue, newValue) {
        const event = new CustomEvent('searchValueChanged', {
            detail: { name, oldValue, newValue }
        });

        if (newValue != oldValue) {
            this.dispatchEvent(event);
            this.render();
        }
    }
}

customElements.define('app-searchbar', Searchbar);