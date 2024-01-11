export class SplashComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="component">
                <p>Caricamento...</p>
            </div>
            `
            ;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/splash.component.css');
        this.shadow.append(style);
    }
}

customElements.define('app-splash', SplashComponent);