export class MapControls extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <app-close-navigation-btn></app-close-navigation-btn>
                <app-center-position></app-center-position>
                <app-zoom-btn zoom-type="in"></app-zoom-btn>
                <app-zoom-btn zoom-type="out"></app-zoom-btn>
            </div>
            `
        ;

        if (!this.hasAttribute('is-navigation')) this.setAttribute('is-navigation', 'false');

        this.close = this.shadow.querySelector('app-close-navigation-btn');
        this.positionBtn = this.shadow.querySelector('app-center-position');
        this.zoomIn = this.shadow.querySelector('app-zoom-btn[zoom-type="in"]');
        this.zoomOut = this.shadow.querySelector('app-zoom-btn[zoom-type="out"]');

        // js
        this.close.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('closeNavigation'));
        });

        this.positionBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('centerPosition'));
        });

        this.zoomIn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('zoomIn'));
        });

        this.zoomOut.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('zoomOut'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map-controls.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-navigation'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && newValue != null && oldValue != null) {
            if (name = 'is-navigation') {
                if (newValue == 'true') {
                    this.classList.add('visible');
                    this.close.setAttribute('is-active', 'true');
                } else {
                    this.classList.remove('visible');
                    this.close.setAttribute('is-active', 'false');
                }
            }
        }
    }
}

customElements.define('app-map-controls', MapControls);