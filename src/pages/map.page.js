import { EventObservable } from '../observables/EventObservable.js';
import { FeatureService } from '../services/feature.service.js';
import { LocalStorageService } from '../services/local-storage.service.js';
import { SettingService } from '../services/data.service.js';
import { ThemeService } from '../services/theme.service.js';
import { UserPositionService } from '../services/user-position.service.js';

export class MapPage extends HTMLElement {
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
        let splash = document.createElement('app-splash');
        this.shadow.append(splash);

        // services
        this.data = await SettingService.instance.getData();

        this.position = {};
        try {
            let p = await UserPositionService.instance.getPosition();
            this.position.latitude = p.coords.latitude;
            this.position.longitude = p.coords.longitude;
        } catch (error) {
            console.error('Impossibile recuperare la posizione', error);
        }

        // html
        this.shadow.innerHTML +=
            `
            <app-cesium></app-cesium>
            <app-tabs></app-tabs>
            <div class="header">
                <div class="search">    
                    <app-tabs-toggle></app-tabs-toggle>
                    <app-searchbar></app-searchbar>
                    <div class="divider"><span class="vr"></span></div>
                    <app-bench-toggle></app-bench-toggle>
                    <app-theme-icon></app-theme-icon>
                    <app-link icon='apps' link ="/"></app-link>   
                </div>
                <app-carousel></app-carousel>
            </div>
            <app-search-result></app-search-result>
            <app-bench></app-bench>
            <app-map-mode-btn></app-map-mode-btn>
            <app-center-position></app-center-position>
            <app-no-position-dialog></app-no-position-dialog>
            `
            ;

        this.map = this.shadow.querySelector('app-cesium');
        this.tabs = this.shadow.querySelector('app-tabs');
        this.searchbar = this.shadow.querySelector('app-searchbar');
        this.searchResult = this.shadow.querySelector('app-search-result');
        this.autocomplete = this.shadow.querySelector('app-autocomplete');
        this.bench = this.shadow.querySelector('app-bench');
        this.tabsToggle = this.shadow.querySelector('app-tabs-toggle');
        this.benchToggle = this.shadow.querySelector('app-bench-toggle');
        this.carousel = this.shadow.querySelector('app-carousel');
        this.themeIcon = this.shadow.querySelector('app-theme-icon');
        this.changeMapMode = this.shadow.querySelector('app-map-mode-btn');
        this.centerPosition = this.shadow.querySelector('app-center-position');
        this.noPositionDialog = this.shadow.querySelector('app-no-position-dialog');

        // js
        // map
        if (this.position.latitude && this.position.longitude) {
            this.map.setCameraToPosition(this.position);
            this.map.checkUserPin(this.position);
        } else {
            this.map.setCameraToPosition({ latitude: 44.40753207658791, longitude: 8.934080815653985 });
        }

        this.map.addEventListener('map-click', event => {
            this.benchToggle.setAttribute('is-open', false);
            this.tabsToggle.setAttribute('is-open', false);
            this.changeMapMode.setAttribute('is-open', false);
            this.centerPosition.setAttribute('is-open', false);
            this.searchbar.setAttribute('value', '');

            const entity = this.map.getEntity(event.detail.movement);

            if (entity == undefined || entity.id.id === 'user-pin') {
                this.tabs.setAttribute('is-open', false);
                this.map.viewer.dataSources.getByName('selected-feature').forEach(ds => this.map.viewer.dataSources.remove(ds));
                return;
            }

            const feature = FeatureService.instance.getFeature(entity, this.data);
            console.log('Feature cliccata:', feature);
            EventObservable.instance.publish('feature-selected', feature);

            this.map.setCameraToPosition(feature.startingCoordinates);
            this.tabs.addFeature(feature);
            this.tabsToggle.setAttribute('is-open', true);
            this.changeMapMode.setAttribute('is-open', true);
            this.centerPosition.setAttribute('is-open', true);
            this.tabs.setAttribute('active-tab', 'info-tab');
        });

        // tabs
        this.tabs.addEventListener('tabs-toggle', event => {
            const isOpen = event.detail.isOpen;
            if (isOpen == true) {
                this.map.classList.add('minimize')
            } else {
                this.map.classList.remove('minimize');
                this.tabsToggle.setAttribute('is-open', false);
            }
        });

        EventObservable.instance.subscribe('tab-maximize', isMaximized => {
            if (isMaximized == true) {
                this.tabs.setAttribute('is-maximized', true);
                this.centerPosition.setAttribute('is-maximized', true);
                this.changeMapMode.setAttribute('is-maximized', true);
            } else {
                this.tabs.setAttribute('is-maximized', false);
                this.centerPosition.setAttribute('is-maximized', false);
                this.changeMapMode.setAttribute('is-maximized', false);
            }
        });

        EventObservable.instance.subscribe('tabinfocard-click', feature => {
            this.map.setCameraToPosition(feature.startingCoordinates);
        });

        EventObservable.instance.subscribe('customroutecard-click', feature => {
            this.map.setCameraToPosition(feature.startingCoordinates);
        });

        // search
        this.searchbar.addEventListener('search', event => {
            event.detail.searchValue.length == 0 ? this.searchResult.setAttribute('is-open', false) : this.searchResult.setAttribute('is-open', true);
            this.searchResult.layers = event.detail.layers;
        });

        this.searchbar.shadowRoot.querySelector('input').addEventListener('click', () => {
            this.tabsToggle.setAttribute('is-open', false);
            this.benchToggle.setAttribute('is-open', false);
        });

        // carousel & bench
        this.tabsToggle.addEventListener('drawer-toggle', event => {
            const isOpen = JSON.parse(event.detail.isOpen);
            this.tabs.setAttribute('is-open', isOpen);
            this.changeMapMode.setAttribute('is-open', isOpen);
            this.centerPosition.setAttribute('is-open', isOpen);
            if (isOpen === true) this.benchToggle.setAttribute('is-open', false);
            if (isOpen === false) this.tabs.setAttribute('is-maximized', false);
        });

        this.benchToggle.addEventListener('bench-toggle', event => {
            const isOpen = JSON.parse(event.detail.isOpen);
            this.bench.setAttribute('is-open', isOpen);
            if (isOpen === true) this.tabsToggle.setAttribute('is-open', false);
        });

        this.bench.addEventListener('click', () => {
            this.tabsToggle.setAttribute('is-open', false);
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

        this.carousel.addEventListener('click', () => {
            this.tabsToggle.setAttribute('is-open', false);
            this.benchToggle.setAttribute('is-open', false);
        });

        // theme icon
        this.themeIcon.addEventListener('themechange', event => {
            this.map.changeTheme(event.detail.themeIndex);
        });

        // map mode icon
        this.changeMapMode.addEventListener('change-map-mode', () => {
            this.map.changeMapMode();
        });

        // center position icon
        EventObservable.instance.subscribe('no-position-found', () => {
            this.noPositionDialog.openDialog();
        });

        this.centerPosition.addEventListener('center-position', async () => {
            try {
                let p = await UserPositionService.instance.getPosition();
                this.position.latitude = p.coords.latitude;
                this.position.longitude = p.coords.longitude;
                this.map.setCameraToPosition(this.position);
                this.map.checkUserPin(this.position);
            } catch (error) {
                console.error('Impossibile recuperare la posizione', error);
                EventObservable.instance.publish('no-position-found');
            }
        });

        // themes
        this.themes = await ThemeService.instance.getThemes();
        this.map.loadImageryProviders(this.themes);
        let savedThemeIndex = LocalStorageService.instance.getData().theme;
        this.themeIcon.themeIndex = savedThemeIndex;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map.page.css');
        this.shadow.append(style);

        // INITIAL DATA POPULATION
        // STARTING
        let savedData = LocalStorageService.instance.getData();
        let savedTags = savedData.selectedTags;
        let savedLayers = savedData.layers;       

        if (savedLayers.active.length === 0 && savedLayers.bench.length === 0) {
            let layersByTags = this.filterLayersByTags(this.data, savedTags);
            this.carousel.layers = layersByTags;
            layersByTags.forEach(layer => this.carousel.createChip(layer));
        } else {
            this.carousel.layers = savedLayers.active;
            savedLayers.active.forEach(layer => this.carousel.createChip(layer));

            this.bench.layers = savedLayers.bench;
            savedLayers.bench.forEach(layer => this.bench.createChip(layer));
        }
        // ENDING

        // splash removal
        splash = this.shadow.querySelector('app-splash');
        setTimeout(() => {
            splash.remove();
        }, 3000);
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

customElements.define('page-map', MapPage);