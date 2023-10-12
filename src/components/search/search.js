export class Searchbar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <input type="search" name="search" id="search" placeholder="Cerca per livelli...">
            `
            ;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'src/components/search/search.css');
        this.shadow.append(style);

        // js
        this.input = this.shadow.querySelector('input');
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
        }
    }
}

customElements.define('app-searchbar', Searchbar);