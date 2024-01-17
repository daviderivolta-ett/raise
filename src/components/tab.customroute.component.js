import { EventObservable } from '../observables/EventObservable.js';
import { LocalStorageService } from '../services/local-storage.service.js';
import { UserPositionService } from '../services/user-position.service.js';
import { TspService } from '../services/tsp.service.js';

export class TabCustomRoute extends HTMLElement {
    _isGrabbed;
    _features;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.isGrabbed = false;
        this.features = [];
    }

    get features() {
        return this._features;
    }

    set features(features) {
        this._features = features;
    }

    get isGrabbed() {
        return this._isGrabbed;
    }

    set isGrabbed(isGrabbed) {
        this._isGrabbed = isGrabbed;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="list"></div>
            <div class="tools">
                <div class="left-tools">
                    <button type="button" class="sort">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/></svg>
                    </button>
                    <button type="button" class="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                    <button type="button" class="manage">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
                    </button>
                    <button type="button" class="edit">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    </button>
                </div>
                <div class="featured-tool">
                    <button type="button" class="save">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
                    </button>
                </div>
            </div>
            <app-edit-name-dialog></app-edit-name-dialog>
            `
            ;

        this.list = this.shadow.querySelector('.list');
        this.editBtn = this.shadow.querySelector('.edit');
        this.sortBtn = this.shadow.querySelector('.sort');
        this.editDialog = this.shadow.querySelector('app-edit-name-dialog');

        // service
        if (LocalStorageService.instance.getData().route) {
            const route = LocalStorageService.instance.getData().route;
            route.features.forEach(feature => this.createCard(feature));
            this.resetOrder();
        }

        // js
        EventObservable.instance.subscribe('addtocustomroutebtn-click', feature => {
            let isPresent = this.checkFeature(feature);

            if (!isPresent) {
                this.createCard(feature);
            } else {
                let index = this.features.findIndex(item => item.id === feature.id);
                this.removeCard(index);
                this.createCard(feature);

                let snackbar = document.createElement('app-snackbar');
                snackbar.setAttribute('type', 'temporary');
                snackbar.setAttribute('text', 'Tappa già presente nel percorso');
                document.body.append(snackbar);
            }

            this.resetOrder();
        });

        this.editBtn.addEventListener('click', () => {
            this.editDialog.features = this.features;
            this.editDialog.openDialog();
        });

        this.sortBtn.addEventListener('click', async () => {
            const p = await UserPositionService.instance.getPosition();
            const position = { longitude: p.coords.longitude, latitude: p.coords.latitude };
            const optimizedPath = TspService.instance.nearestInsertion(this.features, position);
            this.list.innerHTML = '';
            optimizedPath.reverse();
            this._features = [];
            optimizedPath.forEach(feature => this.createCard(feature));
            this.resetOrder();
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.customroute.component.css');
        this.shadow.append(style);
    }

    checkFeature(feature) {
        let isPresent = this.features.some(item => item.id === feature.id);
        return isPresent;
    }

    createCard(feature) {
        let card = document.createElement('app-tab-custom-route-card');
        card.feature = feature;
        this.features.unshift(feature);
        this.list.prepend(card);
        this.scrollLeft = 0;

        card.addEventListener('remove-card', () => {
            let index = this.features.findIndex(item => item.id === feature.id);
            this.removeCard(index);
            this.resetOrder();
        });

        card.addEventListener('increase-order', () => {
            let eventCardIndex = this.features.findIndex(item => item.id === feature.id);
            let followingCardIndex = eventCardIndex + 1;

            let cards = this.list.querySelectorAll('app-tab-custom-route-card');
            if (!cards[followingCardIndex]) return;

            this.features.splice(eventCardIndex, 1);
            this.features.splice(followingCardIndex, 0, feature);

            cards[followingCardIndex].insertAdjacentElement('afterend', cards[eventCardIndex]);
            this.resetOrder();
        });

        card.addEventListener('decrease-order', () => {
            let eventCardIndex = this.features.findIndex(item => item.id === feature.id);
            let previousCardIndex = eventCardIndex - 1;

            let cards = this.list.querySelectorAll('app-tab-custom-route-card');
            if (!cards[previousCardIndex]) return;

            this.features.splice(eventCardIndex, 1);
            this.features.splice(previousCardIndex, 0, feature);

            this.list.insertBefore(cards[eventCardIndex], cards[previousCardIndex]);
            this.resetOrder();
        });
    }

    removeCard(index) {
        let cards = this.list.querySelectorAll('app-tab-custom-route-card');
        cards[index].remove();
        this.features.splice(index, 1);
    }

    resetOrder() {
        this.cards = this.list.querySelectorAll('app-tab-custom-route-card');
        let order = 1;
        this.cards.forEach(card => {
            card.setAttribute('order', order);
            order++;
        });
        
        let geoJson = this.createGeoJson(this.features);
        EventObservable.instance.publish('customroute-load', geoJson);
    }

    createGeoJson(features) {
        const geoJsonFeatures = features.map(f => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [f.startingcoordinates.longitude, f.startingcoordinates.latitude]
            },
            properties: f.properties
        }));

        const geoJson = {
            type: "FeatureCollection",
            features: geoJsonFeatures
        };

        return geoJson;
    }

}

customElements.define('app-tab-custom-route', TabCustomRoute);