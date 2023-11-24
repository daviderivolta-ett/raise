export class PathInfobox extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div></div>
            `
            ;

        this.data = JSON.parse(this.getAttribute('data'));
        this.div = this.shadow.querySelector('div');
        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                const value = this.data[key];
                const p = document.createElement('p');
                p.innerText = value;
                this.div.append(p);
            }
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-infobox.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback(name, newValue, oldValue) {

    }
}

customElements.define('app-path-infobox', PathInfobox);