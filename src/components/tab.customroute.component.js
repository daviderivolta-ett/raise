import { EventObservable } from '../observables/EventObservable.js';
import { LocalStorageService } from '../services/local-storage.service.js';
import { UserPositionService } from '../services/user-position.service.js';
import { TspService } from '../services/tsp.service.js';
import { Route } from '../models/Route.js';
import { FeatureService } from '../services/feature.service.js';

export class TabCustomRoute extends HTMLElement {
    _route;
    _features;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.features = [];

        // html
        this.shadow.innerHTML =
            `
            <div class="route-title"><h4 class="title">Percorso selezionato: <span class="route-name"></span></h4></div>
            <div class="list"></div>
            <div class="tools">
                <button type="button" class="sort">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/></svg>
                </button>
                <button type="button" class="edit">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>
                </button>
                <button type="button" class="new">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                </button>
                <button type="button" class="save">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
                </button>
                <button type="button" class="manage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
                </button>
            </div>
            <app-sort-route-dialog></app-sort-route-dialog>
            <app-edit-route-dialog></app-edit-route-dialog>
            <app-new-route-dialog></app-new-route-dialog>
            <app-save-route-dialog></app-save-route-dialog>
            <app-manage-routes-dialog></app-manage-routes-dialog>
            `
            ;

        this.routeTitle = this.shadow.querySelector('.route-name');
        this.list = this.shadow.querySelector('.list');

        this.sortBtn = this.shadow.querySelector('.sort');
        this.sortDialog = this.shadow.querySelector('app-sort-route-dialog');

        this.editBtn = this.shadow.querySelector('.edit');
        this.editDialog = this.shadow.querySelector('app-edit-route-dialog');

        this.newBtn = this.shadow.querySelector('.new');
        this.newDialog = this.shadow.querySelector('app-new-route-dialog');

        this.saveBtn = this.shadow.querySelector('.save');
        this.saveDialog = this.shadow.querySelector('app-save-route-dialog');

        this.manageBtn = this.shadow.querySelector('.manage');
        this.manageDialog = this.shadow.querySelector('app-manage-routes-dialog');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.customroute.component.css');
        this.shadow.append(style);
    }

    get features() {
        return this._features;
    }

    set features(features) {
        this._features = features;
    }

    get route() {
        return this._route;
    }

    set route(route) {
        this._route = route;
    }

    connectedCallback() {
        // service
        if (LocalStorageService.instance.getData().routes) {
            const routes = LocalStorageService.instance.getData().routes;
            routes.forEach(route => {
                if (route.lastSelected === true) {
                    this.route = route;
                    this.render();
                }
            });
        }

        if (this.route.type === 'default') this.editBtn.disabled = true;

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

        this.sortBtn.addEventListener('click', async () => {
            let position;
            try {
                position = await UserPositionService.instance.getPosition();
                this.sortDialog.route = this.route;
                this.sortDialog.openDialog();
            } catch (error) {
                console.error('Impossibile recuperare la posizione', error);
                EventObservable.instance.publish('no-position-found');
            }
        });

        this.sortDialog.addEventListener('sort-route', async () => {
            const p = await UserPositionService.instance.getPosition();
            const position = { longitude: p.coords.longitude, latitude: p.coords.latitude };
            const optimizedPath = TspService.instance.nearestInsertion(this.features, position);
            this.list.innerHTML = '';
            optimizedPath.reverse();
            this._features = [];
            this.route.features = [];
            this.route.features = [...optimizedPath];
            optimizedPath.forEach(feature => this.createCard(feature));
            this.resetOrder();
        });

        this.editBtn.addEventListener('click', () => {
            this.editDialog.route = this.route;
            this.editDialog.openDialog();
        });

        this.editDialog.addEventListener('edit-name', e => {
            let savedRoutes = LocalStorageService.instance.getData().routes;
            let route;
            for (let i = 0; i < savedRoutes.length; i++) {
                if (savedRoutes[i].name === e.detail.oldName) {
                    savedRoutes[i].name = e.detail.newName;
                    route = savedRoutes[i]
                }
            }
            this.route = route;
            localStorage.setItem('routes', JSON.stringify(savedRoutes));
            console.log('Percorsi salvati', LocalStorageService.instance.getData().routes);
            this.render();
        });

        this.editDialog.addEventListener('delete-route', e => {
            let savedRoutes = LocalStorageService.instance.getData().routes;
            let updatedRoutes = [];
            updatedRoutes = savedRoutes.filter(item => item.name !== e.detail.name);
            let defaultRoute;
            updatedRoutes.forEach(route => {
                if (route.type === 'default') {
                    route.lastSelected = true;
                    defaultRoute = route;
                }
            });
            localStorage.setItem('routes', JSON.stringify(updatedRoutes));
            console.log('Percorsi salvati', LocalStorageService.instance.getData().routes);
            this.route = defaultRoute;
            this.render();
        });

        this.newBtn.addEventListener('click', () => {
            this.newDialog.routes = LocalStorageService.instance.getData().routes;
            this.newDialog.openDialog();
        });

        this.newDialog.addEventListener('create-route', e => {
            let route = new Route(e.detail.name, [], 'user-route', true);
            let savedRoutes = LocalStorageService.instance.getData().routes;
            savedRoutes.push(route);
            for (let i = 0; i < savedRoutes.length; i++) {
                if (savedRoutes[i].name !== route.name) {
                    savedRoutes[i].lastSelected = false;
                }
            }
            this.route = route;
            localStorage.setItem('routes', JSON.stringify(savedRoutes));
            console.log('Percorsi salvati', LocalStorageService.instance.getData().routes);
            this.render();
        });

        this.saveBtn.addEventListener('click', () => {
            this.saveDialog.route = this.route;
            this.saveDialog.openDialog();
        });

        this.saveDialog.addEventListener('save-route', () => {
            this.route.features = this.features.reverse();
            let savedRoutes = LocalStorageService.instance.getData().routes;
            for (let i = 0; i < savedRoutes.length; i++) {
                if (savedRoutes[i].name === this.route.name) {
                    savedRoutes[i] = this.route;
                }
            }
            localStorage.setItem('routes', JSON.stringify(savedRoutes));
            console.log('Percorso salvato', LocalStorageService.instance.getData().routes);
        });

        this.manageBtn.addEventListener('click', () => {
            this.manageDialog.routes = LocalStorageService.instance.getData().routes;
            this.manageDialog.openDialog();
        });

        this.manageDialog.addEventListener('load-route', e => {
            let savedRoutes = LocalStorageService.instance.getData().routes;
            let loadedRoute = e.detail.route;
            for (let i = 0; i < savedRoutes.length; i++) {
                savedRoutes[i].lastSelected = false;
                if (savedRoutes[i].name === loadedRoute.name) {
                    savedRoutes[i].lastSelected = true;
                    this.route = savedRoutes[i];
                }
            }
            localStorage.setItem('routes', JSON.stringify(savedRoutes));
            console.log('Percorso caricato', LocalStorageService.instance.getData().routes);
            this.render();
        });
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
            // let evenCardIndex = this._features.findIndex(item => item.id === feature.id);
            let eventCardIndex = this._features.findIndex(item => item.id === feature.id);
            let previousCardIndex = eventCardIndex - 1;

            let cards = this.list.querySelectorAll('app-tab-custom-route-card');
            if (!cards[previousCardIndex]) return;

            this._features.splice(eventCardIndex, 1);
            this._features.splice(previousCardIndex, 0, feature);

            this.list.insertBefore(cards[eventCardIndex], cards[previousCardIndex]);
            this.resetOrder();
            console.log('Features', this._features);
        });

        card.addEventListener('decrease-order', () => {
            let eventCardIndex = this._features.findIndex(item => item.id === feature.id);
            let followingCardIndex = eventCardIndex + 1;

            let cards = this.list.querySelectorAll('app-tab-custom-route-card');
            if (!cards[followingCardIndex]) return;

            this._features.splice(eventCardIndex, 1);
            this._features.splice(followingCardIndex, 0, feature);

            cards[followingCardIndex].insertAdjacentElement('afterend', cards[eventCardIndex]);
            this.resetOrder();
            console.log('Features', this._features);
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

        // let geoJson = this.createGeoJson(this.features);
        let geoJson = FeatureService.instance.createGeoJson(this.features);
        EventObservable.instance.publish('customroute-load', geoJson);
    }

    render() {
        this.list.innerHTML = '';
        this._features = [];

        this.routeTitle.innerHTML = this.route.name;
        if (this.route.features.length > 0) {
            this.route.features.forEach(feature => {
                this.createCard(feature);
            });
        }

        this.resetOrder();
        // console.log('Percorso attuale:', this.route);
        this.route.type === 'default' ? this.editBtn.disabled = true : this.editBtn.disabled = false;
    }
}

customElements.define('app-tab-custom-route', TabCustomRoute);