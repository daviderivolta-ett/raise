export class LinkIcon extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
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