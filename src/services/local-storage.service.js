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
        console.log("Local storage:", this.data);
        return this.data;
    }
}