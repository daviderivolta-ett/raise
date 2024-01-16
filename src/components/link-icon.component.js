export class LinkIcon extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `
        ;

        if (!this.hasAttribute('icon')) this.setAttribute('icon', 'app');
        if (!this.hasAttribute('link')) this.setAttribute('link', '/');

        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <a href="${this.getAttribute('link')}">
                <span class="icon">
                    <span class="material-symbols-outlined">${this.getAttribute('icon')}</span>
                </span>
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
}

customElements.define('app-link', LinkIcon);