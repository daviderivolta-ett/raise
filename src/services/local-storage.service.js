import { Route } from '../models/Route.js';

export class LocalStorageService {
    _data;

    constructor() {
        if (LocalStorageService._instance) {
            return LocalStorageService._instance;
        }
        LocalStorageService._instance = this;
    }

    static get instance() {
        if (!LocalStorageService._instance) {
            LocalStorageService._instance = new LocalStorageService();
        }
        return LocalStorageService._instance;
    }

    getData() {
        this.data = {};
        let tags = JSON.parse(localStorage.getItem('selectedTags'));
        !tags ? this.data.selectedTags = [] : this.data.selectedTags = tags;

        let routes = JSON.parse(localStorage.getItem('routes'));
        if (!routes) {
            routes = [];
            let defaultRoute = new Route('Default', [], 'default', true);
            routes.push(defaultRoute);
            localStorage.setItem('routes', JSON.stringify(routes));
            this.data.routes = routes;
        } else {
            this.data.routes = routes.map(route => new Route(route.name, route.features, route.type, route.lastSelected));
        }

        let theme = JSON.parse(localStorage.getItem('theme'));
        if (!theme) theme = 0;
        this.data.theme = theme;

        let layers = JSON.parse(localStorage.getItem('layers'));
        if (!layers) {
            layers = {};
            let active = [];
            let bench = [];
            layers.active = active;
            layers.bench = bench;
        }
        this.data.layers = layers;

        // console.log("Local storage:", this.data);
        return this.data;
    }

    updateActiveLayers(layers) {
        let currentLayers = LocalStorageService.instance.getData().layers;
        currentLayers.active = [...layers];
        localStorage.setItem('layers', JSON.stringify(currentLayers));
        // console.log("Local storage:", LocalStorageService.instance.getData());
    }

    updateBenchLayers(layers) {
        let currentLayers = LocalStorageService.instance.getData().layers;
        currentLayers.bench = [...layers];
        localStorage.setItem('layers', JSON.stringify(currentLayers));
        // console.log("Local storage:", LocalStorageService.instance.getData());
    }

    resetLayers() {
        let currentLayers = LocalStorageService.instance.getData().layers;
        currentLayers.bench.length = 0;
        currentLayers.active.length = 0;
        localStorage.setItem('layers', JSON.stringify(currentLayers));
    }
}