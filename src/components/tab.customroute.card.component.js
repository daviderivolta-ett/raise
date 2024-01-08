import { ColorManager } from '../services/ColorManager.js';

export class TabCustomRouteCardComponent extends HTMLElement {
    _feature;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.colorManager = new ColorManager();
    }

    get feature() {
        return this._feature;
    }

    set feature(feature) {
        this._feature = feature;
    }

    connectedCallback() {
        // html
        console.log(this.feature);
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="component">
                <span class="legend"></span>
                <div class="info">
                    <h4 class="title"></h4>
                    <p class="category"></p>
                </div>
                <div class="remove-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            `
            ;

        this.close = this.shadow.querySelector('.remove-icon');
        this.legend = this.shadow.querySelector('.legend');
        this.name = this.shadow.querySelector('.title');
        this.category = this.shadow.querySelector('.category');

        this.name.innerHTML = this.feature.properties.raiseName;
        this.category.innerHTML = this.feature.layer.name;

        this.colorManager.hex = this.feature.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);
        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        // js
        this.close.addEventListener('click', () => this.dispatchEvent(new CustomEvent('remove-card')));

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.customroute.card.component.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {

        }
    }
}

customElements.define('app-tab-custom-route-card', TabCustomRouteCardComponent);