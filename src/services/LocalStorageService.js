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
            let tags = localStorage.selectedTags;
            tags = JSON.parse(tags);
            this.data.selectedTags = tags;
        }
        return this.data;
    }
}