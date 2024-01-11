import { ColorManager } from '../services/ColorManager.js';
import { EventObservable } from '../observables/EventObservable.js';

export class TabInfoComponent extends HTMLElement {
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
        this.render();
    }

    render() {
        this.legend.innerHTML = '';
        this.name.innerHTML = '';
        this.category.innerHTML = '';

        const properties = this.feature.properties;

        let isName = false;
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const value = properties[key];
                if (key == 'raiseName') {
                    this.name.innerHTML = properties.raiseName;
                };
                if (key == 'nome') {
                    this.category.innerHTML = value;
                    isName = true;
                }
                if (!isName) this.category.innerHTML = properties.raiseName;
            }
        }

        this.colorManager.hex = this.feature.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);
        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        this.info.feature = this.feature;

        if (this.feature.coordinatesArray.length > 1) {
            this.tools.style.display = 'none';
            return;
        } else {
            this.tools.style.display = 'flex';
        }

        const coordinates = {};
        coordinates.longitude = this.feature.startingcoordinates.longitude;
        coordinates.latitude = this.feature.startingcoordinates.latitude;
        this.goToBtn.coordinates = coordinates;
        this.goToBtn.addEventListener('go-to', e => this.goTo(e.detail.coordinates));

        this.addToRouteBtn.addEventListener('add-route', () => EventObservable.instance.publish('addtocustomroutebtn-click', this.feature));
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="component">
                <div class="header">
                    <div class="title">
                        <span class="legend"></span>
                        <h4 class="name"></h4>
                    </div>
                    <p class="category"></p>
                </div>
                <div class="tools" style="display:none;">
                    <app-goto></app-goto>
                    <app-add-to-route></app-add-to-route>
                </div>
                <app-info-panel style="display:none;"></app-info-panel>
            </div>
            `
            ;

        this.component = this.shadow.querySelector('.component');
        this.header = this.shadow.querySelector('.header');
        this.legend = this.shadow.querySelector('.legend');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.tools = this.shadow.querySelector('.tools');
        this.goToBtn = this.shadow.querySelector('app-goto');
        this.addToRouteBtn = this.shadow.querySelector('app-add-to-route');
        this.info = this.shadow.querySelector('app-info-panel');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.info.component.css');
        this.shadow.append(style);
    }

    goTo(coordinates) {
        const url = `https://www.google.com/maps/dir/?api=1` +
            `&destination=${coordinates.latitude},${coordinates.longitude}`;
        window.open(url, '_blank');
    }
}

customElements.define('app-tab-info', TabInfoComponent);