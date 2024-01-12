export class LocalStorageService {
    _data;

    constructor() {
        if (LocalStorageService._instance) {
            return LocalStorageService._instance;
        }
        LocalStorageService._instance = this;
    }

    static get instance(){
        if (!LocalStorageService._instance) {
            LocalStorageService._instance = new LocalStorageService();
        }
        return LocalStorageService._instance;
    }

    getData() {
        if (!this.data) {
            this.data = {}
            this.data.selectedTags = JSON.parse(localStorage.getItem('selectedTags'));
            this.data.route = JSON.parse(localStorage.getItem('route'));
        }
        return this.data;
    }
}