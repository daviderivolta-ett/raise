export class SettingsIcon extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <a href="${this.hasAttribute('link') ? this.getAttribute('link') : '/'}">
            <span class="material-symbols-outlined">tag</span>
            </a>
            `
        ;

        this.shadow.append(this.button);

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/icon.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback() {

    }
}

customElements.define('app-icon-btn', SettingsIcon);