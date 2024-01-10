export class EventObservable {
    constructor() {
        if (EventObservable._instance) return EventObservable._instance;
        this.listeners = [];
        EventObservable._instance = this;
    }

    static get instance() {
        if (!EventObservable._instance) {
            EventObservable._instance = new EventObservable();
        }
        return EventObservable._instance;
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