export class LayersManager {
    CATEGORIES_URL = './json/categories.json';
    _data;
    _layers;
    _listeners;

    constructor() {
        if (LayersManager._instance) {
            return LayersManager._instance;
        }
        this.layers = { active: [], bench: [] };
        this.listeners = [];
        LayersManager._instance = this;
    }

    static get instance() {
        if (!LayersManager._instance) {
            LayersManager._instance = new LayersManager();
        }
        return LayersManager._instance;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    get layers() {
        return this._layers;
    }

    set layers(layers) {
        this._layers = layers;
    }

    get listeners() {
        return this._listeners;
    }

    set listeners(listeners) {
        this._listeners = listeners;
    }

    getData() {
        return this.data ?
            Promise.resolve(this.data) :
            this.fetchAppData(this.CATEGORIES_URL)
                .then(data => {
                    this.data = data;
                    return data;
                });
    }

    subscribe(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = []
        }
        this.listeners[eventType].push(callback);
    }

    publish(eventType, data) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => callback(data));
        }
    }

    async fetchAppData(categoriesUrl) {
        try {
            const data = await fetch(categoriesUrl).then(res => res.json());
            const categoryPromises = await Promise.all(data.categories.map(async category => {
                const groupPromises = await Promise.all(category.groups.map(async url => {
                    try {
                        const res = await fetch(url);
                        if (res.ok) return res.json();
                        throw new Error(`Errore durante il recupero dei dati da ${url}`);
                    } catch (err) {
                        console.error(err);
                        return null;
                    }
                }));
                category.groups = groupPromises;
                return category;
            }));

            return {
                ...data,
                categories: categoryPromises,
            };

        } catch (error) {
            console.error('Errore durante il recupero dei dati JSON', error);
            throw error;
        }
    }
}