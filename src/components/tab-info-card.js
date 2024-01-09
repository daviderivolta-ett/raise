import { ColorManager } from '../services/ColorManager';

export class InfoCard extends HTMLElement {
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

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
                <div class="info">
                    <div class="header">
                        <div class="title">
                            <span class="legend"></span>
                            <h4 class="name"></h4>
                        </div>
                        <p class="category"></p>
                    </div>
                    <div class="tools"></div>
                    <button class="info-btn">Info</button>
                </div>
                <div class="content"></div>
            </div>
            `
            ;

        this.close = this.shadow.querySelector('.close-icon');
        this.info = this.shadow.querySelector('.info');
        this.legend = this.shadow.querySelector('.legend');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.tools = this.shadow.querySelector('.tools');
        this.infoBtn = this.shadow.querySelector('.info-btn');
        this.content = this.shadow.querySelector('.content');

        // js
        this.close.addEventListener('click', () => { this.dispatchEvent(new CustomEvent('remove-card')); });
        this.infoBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('expandinfo-click', {
                detail: { feature: this.feature }
            }));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab-info-card.css');
        this.shadow.append(style);
    }

    render() {
        const properties = this.feature.properties;

        let arr = [];
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
                // const p = document.createElement('p');
                // p.innerText = value;
                // this.content.append(p);
                // arr.push(p);
            }
        }
        if (arr.length == 0) this.content.remove();

        this.colorManager.hex = this.feature.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);
        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        // this.playBtn = document.createElement('app-play-info-btn');
        // this.info.append(this.playBtn);

        if (this.feature.coordinatesArray.length > 1) return;

        const coordinates = {};
        coordinates.longitude = this.feature.startingcoordinates.longitude;
        coordinates.latitude = this.feature.startingcoordinates.latitude;

        this.goToBtn = document.createElement('app-goto');
        this.goToBtn.coordinates = coordinates;
        this.tools.append(this.goToBtn);

        this.goToBtn.addEventListener('go-to', e => this.goTo(e.detail.coordinates));

        this.addToRouteBtn = document.createElement('app-add-to-route');
        this.tools.append(this.addToRouteBtn);
        this.addToRouteBtn.addEventListener('add-route', () => {
            document.dispatchEvent(new CustomEvent('add-route', { detail: { feature: this.feature } }));
        });
    }

    goTo(coordinates) {
        const url = `https://www.google.com/maps/dir/?api=1` +
            `&destination=${coordinates.latitude},${coordinates.longitude}`;
        window.open(url, '_blank');
    }
}

customElements.define('app-info-card', InfoCard);