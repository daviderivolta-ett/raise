export class Infobox extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.setAttribute('data', '');
    }

    render() {
        if (!this.hasAttribute('data')) return;

        this.data = JSON.parse(this.getAttribute('data'));
        this.div.innerHTML = '';

        Object.keys(this.data).forEach((key) => {
            const value = this.data[key];
            this.text = document.createElement('p');
            this.text.innerHTML =
                `
                <span class="info-key">${key}:</span> <span class="info-value">${value}</span>
                `;
            this.div.append(this.text);
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div></div>
            <svg id="close-icon" viewPort="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="11" x2="11" y2="1" stroke="black" stroke-width="2"/>
            <line x1="1" y1="1" x2="11" y2="11" stroke="black" stroke-width="2"/>
            </svg>
            `

        this.div = this.shadow.querySelector('div');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/infobox.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['data'];
    attributeChangedCallback(name, oldValue, newValue) {

        if (newValue != oldValue) {
            this.render();
        }
    }
}

customElements.define('app-infobox', Infobox);