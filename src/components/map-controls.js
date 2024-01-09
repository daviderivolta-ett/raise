export class MapControlsComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="wrapper">
                <app-center-position></app-center-position>
                <app-zoom-btn></app-zoom-btn>
            </div>
            `
        ;

        if (!this.hasAttribute('is-route')) this.setAttribute('is-route', 'false');

        this.positionBtn = this.shadow.querySelector('app-center-position');
        this.zoomBtn = this.shadow.querySelector('app-zoom-btn');

        // js
        this.positionBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('centerPosition'));
        });

        this.zoomBtn.addEventListener('zoomIn', () => {
            this.dispatchEvent(new CustomEvent('zoomIn'));
        });

        this.zoomBtn.addEventListener('zoomOut', () => {
            this.dispatchEvent(new CustomEvent('zoomOut'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map-controls.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-route'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && newValue != null && oldValue != null) {

            if (name == 'is-route') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
            }

        }
    }
}

customElements.define('app-map-controls', MapControlsComponent);