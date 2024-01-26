export class SuggestedRoutesService {
    ROUTES_URL = './routes/routes.json';

    constructor() {
        if (SuggestedRoutesService._instance) return SuggestedRoutesService._instance;
        SuggestedRoutesService._instance = this;
    }

    static get instance() {
        if (!SuggestedRoutesService._instance) {
            SuggestedRoutesService._instance = new SuggestedRoutesService();
        }
        return SuggestedRoutesService._instance;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    async getData() {
        if (this.data) {
            return this.data;
        } else {
            this.data = await this.fetchData(this.ROUTES_URL);
            return this.data;
        }
    }

    async fetchData(url) {
        try {

            const response = await fetch(url);
            const routesUris = await response.json();

            const promises = routesUris.routes.map(async uri => {
                const response = await fetch(uri);
                const json = response.json();
                return json;
            });

            const results = await Promise.all(promises);
            return results;

        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
        }
    }

    getRelatedRoute(feature) {
        return this.data.filter(route => {
            return route.features.some(f => f.id == feature.id);
        });
    }
}