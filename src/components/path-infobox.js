export class PathInfobox extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        this.shadow.innerHTML =
            `
            <p>PIPPO</p>
            `
        ;
    }

    static observedAttributes = [];
    attributeChangedCallback(name, newValue, oldValue) {

    }
}

customElements.define('app-path-infobox', PathInfobox);