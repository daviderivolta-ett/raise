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
            let r = JSON.parse(localStorage.getItem('route'));
            if (!r) {
                this.data.route = new Route('', []);
            } else {
                let f = r.features.map(feature => new Feature(feature.properties, feature.layer, feature.startingcoordinates, feature.coordinatesArray));
                this.data.route = new Route(r.name, f);
            }
        }
        return this.data;
    }
}