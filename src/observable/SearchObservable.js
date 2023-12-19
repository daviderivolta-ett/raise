export class SearchObservable {
    constructor() {
        if (SearchObservable._instance) {
            return SearchObservable._instance;
        }
        this.listeners = [];
        SearchObservable._instance = this;
    }

    static get instance() {
        if (!SearchObservable._instance) {
            SearchObservable._instance = new SearchObservable();
        }
        return SearchObservable._instance;
    }

    subscribe(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }

    publish(eventType, data) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => callback(data));
        }
    }
}