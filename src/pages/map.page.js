import { LayersManager } from '../services/LayersManager.js';
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
        this.data = await LayersManager.instance.getData();

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
                    <app-bench-toggle></app-bench-toggle>
                    <app-searchbar></app-searchbar>
                    <div class="divider"><span class="vr"></span></div>
                    <app-link icon='apps' link ="/"></app-link>   
                </div>
                <app-carousel></app-carousel>
            </div>
            <app-search-result></app-search-result>
            <app-bench></app-bench>
            <app-theme-icon></app-theme-icon>
            `
            ;

        /** @type {CesiumViewer} */
        this.map = this.shadow.querySelector('app-cesium');
        this.searchbar = this.shadow.querySelector('app-searchbar');
        this.searchResult = this.shadow.querySelector('app-search-result');
        this.autocomplete = this.shadow.querySelector('app-autocomplete');
        this.bench = this.shadow.querySelector('app-bench');
        this.benchToggle = this.shadow.querySelector('app-bench-toggle');
        this.carousel = this.shadow.querySelector('app-carousel');
        this.themeIcon = this.shadow.querySelector('app-theme-icon');

        // js
        // map
        this.map.setCameraToPosition(this.position);
        this.map.createUserPin(this.position);

        this.map.addEventListener('clickonmap', () => {
            this.benchToggle.setAttribute('is-open', false);
            this.searchbar.setAttribute('value', '');
        });

        // search
        this.searchbar.addEventListener('search', event => {
            event.detail.searchValue.length == 0 ? this.searchResult.setAttribute('is-open', false) : this.searchResult.setAttribute('is-open', true);
            this.searchResult.layers = event.detail.layers;
        });

        // carousel & bench
        this.benchToggle.addEventListener('drawerToggled', event => {
            const isOpen = event.detail.isOpen;
            this.bench.setAttribute('is-open', isOpen);
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