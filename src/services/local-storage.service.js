import { Feature } from '../models/Feature.js';
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
        if (!this.data) {
            this.data = {}
            this.data.selectedTags = JSON.parse(localStorage.getItem('selectedTags'));
            let routes = JSON.parse(localStorage.getItem('routes'));
            if (!routes) {
                routes = [];
                let defaultRoute = new Route('Default', [], 'default', true);
                routes.push(defaultRoute);
                localStorage.setItem('routes', JSON.stringify(routes));
            }
            this.data.routes = routes;
        }
        return this.data;
    }
}