import { EventObservable } from '../observables/EventObservable.js';
import { LocalStorageService } from '../services/LocalStorageService.js';
import { UserPositionService } from '../services/UserPositionService.js';
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
                <button type="button" class="save">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </button>
                <button type="button" class="sort">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/></svg>
                </button>
                <button type="button" class="delete">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
                </button>
            </div>
            <app-save-route-dialog></app-save-route-dialog>
            <app-empty-route></app-empty-route>
            `
            ;

        this.list = this.shadow.querySelector('.list');
        this.saveBtn = this.shadow.querySelector('.save');
        this.deleteBtn = this.shadow.querySelector('.delete');
        this.sortBtn = this.shadow.querySelector('.sort');
        this.saveDialog = this.shadow.querySelector('app-save-route-dialog');
        this.deleteDialog = this.shadow.querySelector('app-empty-route');

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

        this.saveBtn.addEventListener('click', () => {
            this.saveDialog.features = this.features;
            this.saveDialog.openDialog();
        });

        this.saveDialog.addEventListener('empty-route', () => {
            this.features = [];
            this.list.innerHTML = '';
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

        this.deleteBtn.addEventListener('click', () => this.deleteDialog.openDialog());

        this.deleteDialog.addEventListener('empty-route', () => {
            this.features = [];
            this.list.innerHTML = '';
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

        console.log(this.features);
        let geoJson = this.createGeoJson(this.features);
        console.log(geoJson);
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
    }

    createGeoJson(features) {
        const geoJsonFeatures = [];

        features.forEach(f => {
            let feature = {};
            feature.type = "Feature";
            feature.geometry = {};
            feature.geometry.coordinates = [f.startingcoordinates.longitude, f.startingcoordinates.latitude];
            feature.geometry.type = "Point"
            feature.properties = f.properties;
            geoJsonFeatures.push(feature);
        });

        const geoJson = {
            type: "FeatureCollection",
            features: geoJsonFeatures
        };

        return geoJson;
    }
}

customElements.define('app-tab-custom-route', TabCustomRoute);