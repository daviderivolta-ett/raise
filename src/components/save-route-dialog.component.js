import { Route } from '../models/Route.js';
import { LocalStorageService } from '../services/LocalStorageService.js';

export class SaveRouteDialogComponent extends HTMLElement {
    _route;
    _features;
    _name;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });

        // html
        this.shadow.innerHTML =
            `
            <dialog>
                <div class="content">
                    <input type="text">
                    <div class="buttons">
                        <button class="submit" type="submit">Salva</button>
                        <button class="close" type="button">Annulla</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        this.dialog = this.shadow.querySelector('dialog');
        this.input = this.shadow.querySelector('input');
        this.close = this.shadow.querySelector('.close');
        this.save = this.shadow.querySelector('.submit');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/save-route-dialog.component.css')
        this.shadow.append(style);
    }

    get route() {
        return this._route;
    }

    set route(route) {
        this._route = route;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get features() {
        return this._features;
    }

    set features(features) {
        this._features = features;
    }

    render() {

    }

    connectedCallback() {
        // service
        if (LocalStorageService.instance.getData().route) {
            const route = LocalStorageService.instance.getData().route;
            this.name = route.name;
            this.features = route.features;
            this.route = new Route(this.name, this.features);
            this.input.value = this.name;
        } else {
            this.setAttribute('value', 'Nuovo percorso');
            this.input.value = this.getAttribute('value');
        }

        // js
        this.input.addEventListener('input', () => {
            this.setAttribute('value', this.input.value);
        });

        this.close.addEventListener('click', () => {
            this.closeDialog();
        });

        this.save.addEventListener('click', () => {
            this.closeDialog();
            this.name = this.input.value;
            this.route = new Route(this.name, this.features);
            localStorage.setItem('route', JSON.stringify(this.route));
        });
    }

    static observedAttributes = ['value'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'value') {
                newValue.length == 0 ? this.save.disabled = true : this.save.disabled = false;
            }
        }
    }

    openDialog() {
        if (this.dialog.showModal) {
            this.dialog.showModal();
        } else {
            this.dialog.setAttribute('open', '');
        }
    }

    closeDialog() {
        if (this.dialog.close) {
            this.dialog.close();
        } else {
            this.dialog.removeAttribute('open');
        }
    }
}

customElements.define('app-save-route-dialog', SaveRouteDialogComponent);