import { LocalStorageService } from '../services/LocalStorageService.js';
import { SettingService } from '../services/SettingService.js';
import { UserPositionService } from '../services/UserPositionService.js';

export class PageMap extends HTMLElement {
    _data;
    _position;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    get position() {
        return this._position;
    }

    set position(position) {
        this._position = position;
    }

    async connectedCallback() {
        // services
        this.data = await SettingService.instance.getData();

        let p = await UserPositionService.instance.getPosition();
        this.position = {};
        this.position.latitude = p.coords.latitude;
        this.position.longitude = p.coords.longitude;

        // html
        this.shadow.innerHTML =
            `
            <app-cesium></app-cesium>
            <div class="header">
                <div class="search">
                    <div class="upper-search">
                        <app-bench-toggle></app-bench-toggle>
                        <app-searchbar></app-searchbar>
                        <div class="divider"><span class="vr"></span></div>       
                        <app-link icon='tag' link ="/"></app-link>
                    </div>
                    <div class="lower-search">
                        <app-autocomplete></app-autocomplete>
                    </div>
                </div>
                <app-carousel></app-carousel>
            </div>
            <app-search-result></app-search-result>
            <app-bench></app-bench>
            `
            ;

        /** @type {CesiumViewer} */
        this.map = this.shadow.querySelector('app-cesium');
        this.bench = this.shadow.querySelector('app-bench');
        this.benchToggle = this.shadow.querySelector('app-bench-toggle');
        this.carousel = this.shadow.querySelector('app-carousel');

        // js
        // services
        this.map.setCameraToPosition(this.position);
        this.map.createUserPin(this.position);

        // layers bench
        this.benchToggle.addEventListener('drawerToggled', event => {
            const isOpen = event.detail.isOpen;
            this.bench.setAttribute('is-open', isOpen);
        });

        this.bench.addEventListener('restorelayer', event => {
            let layer = event.detail.layer;
            this.carousel.addLayer(layer);
        });

        this.bench.addEventListener('click', () => {
            this.benchToggle.setAttribute('is-open', false);
        });

        this.bench.addEventListener('benchempty', () => {
            this.benchToggle.setAttribute('is-open', false);
        });

        this.carousel.addEventListener('loadlayers', event => {
            this.map.loadLayers(event.detail.activeLayers);
        });

        this.carousel.addEventListener('benchlayer', event => {
            this.bench.addLayer(event.detail.layer);
            this.benchToggle.setAttribute('is-open', true);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map.page.css');
        this.shadow.append(style);

        // first render
        this.render();
    }

    render() {
        // populate carousel
        let layers = this.filterLayersByTags(this.data, LocalStorageService.instance.getData().selectedTags);
        this.carousel.data = layers;
    }

    filterLayersByTags = (object, array) => {
        let layers = [];
        object.categories.map(category => {
            category.groups.map(group => {
                group.layers.map(layer => {
                    if (layer.tags && array.some(tag => layer.tags.includes(tag))) {
                        layers.push({ ...layer, tags: [...layer.tags] });
                    }
                })
            })
        })
        return layers;
    }
}

customElements.define('app-map', PageMap);