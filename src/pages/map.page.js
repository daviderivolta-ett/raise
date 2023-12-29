import { FeatureService } from '../services/FeatureService.js';
import { LocalStorageService } from '../services/LocalStorageService.js';
import { SettingService } from '../services/SettingService.js';
import { ThemeService } from '../services/ThemeService.js';
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
            <app-tabs></app-tabs>
            <div class="header">
                <div class="search">    
                    <app-bench-toggle></app-bench-toggle>
                    <app-searchbar></app-searchbar>
                    <div class="divider"><span class="vr"></span></div>
                    <app-link icon='apps' link ="/"></app-link>   
                </div>
                <app-carousel></app-carousel>
            </div>

            <app-path-drawer></app-path-drawer>
            <app-search-result></app-search-result>
            <app-bench></app-bench>
            <app-theme-icon></app-theme-icon>
            `
            ;

        /** @type {CesiumViewer} */
        this.map = this.shadow.querySelector('app-cesium');
        this.tabs = this.shadow.querySelector('app-tabs');
        this.searchbar = this.shadow.querySelector('app-searchbar');
        this.searchResult = this.shadow.querySelector('app-search-result');
        this.autocomplete = this.shadow.querySelector('app-autocomplete');
        this.bench = this.shadow.querySelector('app-bench');
        this.benchToggle = this.shadow.querySelector('app-bench-toggle');
        this.carousel = this.shadow.querySelector('app-carousel');
        this.themeIcon = this.shadow.querySelector('app-theme-icon');
        this.path = this.shadow.querySelector('app-path-drawer');

        // js
        // map
        this.map.setCameraToPosition(this.position);
        this.map.createUserPin(this.position);

        this.map.addEventListener('map-click', event => {
            this.benchToggle.setAttribute('is-open', false);
            this.path.setAttribute('is-open', false);
            this.searchbar.setAttribute('value', '');

            const entity = this.map.getEntity(event.detail.movement);
            
            if (entity == undefined) {
                this.tabs.setAttribute('is-open', false);
                return;
            }

            const feature = FeatureService.instance.getFeature(entity, this.data);
            this.tabs.addFeature(feature);
            this.tabs.setAttribute('is-open', true);
        });

        // tabs
        this.tabs.addEventListener('tabs-toggle', event => {
            const isOpen = event.detail.isOpen;
            isOpen == true ? this.map.classList.add('minimize') : this.map.classList.remove('minimize');
        });

        // search
        this.searchbar.addEventListener('search', event => {
            event.detail.searchValue.length == 0 ? this.searchResult.setAttribute('is-open', false) : this.searchResult.setAttribute('is-open', true);
            this.searchResult.layers = event.detail.layers;
        });

        this.searchbar.shadowRoot.querySelector('input').addEventListener('click', () => {
            this.path.setAttribute('is-open', false);
        });

        // carousel & bench
        this.benchToggle.addEventListener('drawer-toggle', event => {
            const isOpen = event.detail.isOpen;
            this.bench.setAttribute('is-open', isOpen);
            this.tabs.setAttribute('is-open', isOpen);
        });

        this.bench.addEventListener('click', () => {
            this.benchToggle.setAttribute('is-open', false);
        });

        this.bench.addEventListener('bench-empty', () => {
            this.benchToggle.setAttribute('is-open', false);
        });

        document.addEventListener('bench-layer', () => {
            this.benchToggle.setAttribute('is-open', true);
        });

        this.carousel.addEventListener('load-layers', event => {
            this.map.loadLayers(event.detail.activeLayers);
        });

        // theme icon
        this.themeIcon.addEventListener('themechange', event => {
            this.map.changeTheme(event.detail.theme);
        });

        // info

        // populate carousel
        let layers = this.filterLayersByTags(this.data, LocalStorageService.instance.getData().selectedTags);
        this.carousel.layers = layers;
        layers.forEach(layer => this.carousel.createChip(layer));

        // themes
        this.themeIcon.themes = await ThemeService.instance.getThemes();

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map.page.css');
        this.shadow.append(style);
    }

    render() {

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