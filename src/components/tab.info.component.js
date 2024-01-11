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
        this.component.innerHTML = '';
        this.component.innerHTML =
            `
            <div class="header">
                <div class="title">
                    <span class="legend"></span>
                    <h4 class="name"></h4>
                </div>
                <p class="category"></p>
            </div>
            <div class="tools"></div>
            <app-info-panel></app-info-panel>
            `
            ;

        this.header = this.shadow.querySelector('.header');
        this.legend = this.shadow.querySelector('.legend');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.tools = this.shadow.querySelector('.tools');
        this.info = this.shadow.querySelector('app-info-panel');

        const properties = this.feature.properties;

        let isName = false;
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const value = properties[key];
                if (key == 'raiseName') {
                    this.name.innerText = properties.raiseName;
                };
                if (key == 'nome') {
                    this.category.innerText = value;
                    isName = true;
                }
                if (!isName) this.category.innerText = properties.raiseName;
            }
        }

        this.colorManager.hex = this.feature.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);
        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        this.info.feature = this.feature;

        if (this.feature.coordinatesArray.length > 1) return;

        const coordinates = {};
        coordinates.longitude = this.feature.startingcoordinates.longitude;
        coordinates.latitude = this.feature.startingcoordinates.latitude;

        this.goToBtn = document.createElement('app-goto');
        this.goToBtn.coordinates = coordinates;
        this.tools.append(this.goToBtn);

        this.goToBtn.addEventListener('go-to', e => {
            this.goTo(e.detail.coordinates)
        });

        this.addToRouteBtn = document.createElement('app-add-to-route');
        this.tools.append(this.addToRouteBtn);

        this.addToRouteBtn.addEventListener('add-route', () => {
            EventObservable.instance.publish('addtocustomroutebtn-click', this.feature);
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = '<div class="component"></div>';
        this.component = this.shadow.querySelector('.component');

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