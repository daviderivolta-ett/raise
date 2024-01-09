import { ColorManager } from '../services/ColorManager';

export class TabCustomRouteCardComponent extends HTMLElement {
    _feature;
    _order;

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

    get order() {
        return this._order;
    }

    set order(order) {
        this._order = order;
    }

    render() {
        this.num.innerHTML = this.order;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="component">
                <div class="change-order">
                    <div class="up-arrow icon">
                        <span class="material-symbols-outlined">keyboard_arrow_up</span>
                    </div>
                    <div class="number"></div>
                    <div class="down-arrow icon">
                        <span class="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>
                </div>
                <div class="info">
                    <div class="title">
                        <span class="legend"></span>
                        <h4 class="name"></h4>
                    </div>
                    <p class="category"></p>
                </div>
                <div class="remove-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            `
            ;

        this.wrapper = this.shadow.querySelector('.component');
        this.upArrow = this.shadow.querySelector('.up-arrow');
        this.downArrow = this.shadow.querySelector('.down-arrow');
        this.num = this.shadow.querySelector('.number');
        this.legend = this.shadow.querySelector('.legend');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.close = this.shadow.querySelector('.remove-icon');

        this.upArrow.addEventListener('click', e => {
            e.stopImmediatePropagation();
            this.dispatchEvent(new CustomEvent('decrease-order'));
        });

        this.downArrow.addEventListener('click', e => {
            e.stopImmediatePropagation();
            this.dispatchEvent(new CustomEvent('increase-order'));
        });

        this.name.innerHTML = this.feature.properties.raiseName;
        this.category.innerHTML = this.feature.layer.name;

        this.colorManager.hex = this.feature.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);
        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        // js
        this.wrapper.addEventListener('click', e => {
            this.dispatchEvent(new CustomEvent('customroutecard-click', { detail: { feature: this.feature } }));
        });

        this.close.addEventListener('click', e => {
            this.dispatchEvent(new CustomEvent('remove-card'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.customroute.card.component.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['order'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'order') {
                this.order = newValue;
                this.render();
            }
        }
    }
}

customElements.define('app-tab-custom-route-card', TabCustomRouteCardComponent);