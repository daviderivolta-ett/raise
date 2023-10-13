export class Autocomplete extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.tags = JSON.parse(this.getAttribute('data'));
        this.div.innerHTML = '';
        // this.setAttribute('selected', '');

        for (const tag of this.tags) {
            this.span = document.createElement('span');
            this.span.textContent = tag;
            this.span.setAttribute('name', tag);
            this.div.append(this.span);
        }

        this.spans = this.shadow.querySelectorAll('span');
        this.spans.forEach(span => {

            span.addEventListener('click', (event) => {
                this.setAttribute('selected', span.getAttribute('name'));
            });

        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div></div>
            `
            ;

        this.div = this.shadow.querySelector('div');
        this.setAttribute('selected', '');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'src/components/autocomplete/autocomplete.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['data', 'selected'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'data' && newValue != oldValue) {
            this.render();
        }

        if (name == 'selected' && newValue != oldValue) {
            const event = new CustomEvent('autocompleteSelected', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
            this.div.innerHTML = '';
        }
    }
}

customElements.define('app-autocomplete', Autocomplete);