export class PathTools extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        const isOpen = this.getAttribute('is-open');
        isOpen == 'true' ? this.classList.add('active') : this.classList.remove('active');
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <app-save-route-btn></app-save-route-btn>
            <app-flush-btn></app-flush-btn>
            `
        ;

        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', 'false');
        this.saveRouteBtn = this.shadow.querySelector('app-save-route-btn');
        this.flushBtn = this.shadow.querySelector('app-flush-btn');

        this.saveRouteBtn.addEventListener('saveCustomRoute', () => {
            this.dispatchEvent(new CustomEvent('saveCustomRoute'));
        });

        this.flushBtn.addEventListener('flush', () => {
            this.dispatchEvent(new CustomEvent('flush'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-tools.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                this.render();
            }
        }
    }
}

customElements.define('app-path-tools', PathTools);