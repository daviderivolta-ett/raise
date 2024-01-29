export class SettingService {
    CATEGORIES_URL = './json/categories.json';
    _data;
    
    constructor() {
        if (SettingService._instance) {
            return SettingService._instance;
        }
        SettingService._instance = this;
    }

    static get instance() {
        if (!SettingService._instance) {
            SettingService._instance = new SettingService();
        }
        return SettingService._instance;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    // getData() {
    //     return this.data ? 
    //     Promise.resolve(this.data) :
    //     fetch(this.CATEGORIES_URL)
    //     .then(resp => resp.json())
    //     .then(data => {
    //         this.data = data;
    //         return data;
    //     })
    // }

    getData() {
        return this.data ?
        Promise.resolve(this.data) :
        this.fetchAppData(this.CATEGORIES_URL)
        .then(data => {
            this.data = data;
            console.log(data);
            return data;
        });
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