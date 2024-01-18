import { Route } from '../models/Route.js';

export class EditRouteDialogComponent extends HTMLElement {
    _route;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });

        // html
        this.shadow.innerHTML =
            `
            <dialog>
                <div class="content">
                    <input type="text" placeholder="Nome percorso">
                    <div class="buttons">
                        <button class="close" type="button">Annulla</button>
                        <button class="submit" type="submit">Salva</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        this.dialog = this.shadow.querySelector('dialog');
        this.input = this.shadow.querySelector('input');
        this.closeBtn = this.shadow.querySelector('.close');
        this.saveBtn = this.shadow.querySelector('.submit');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/dialog.edit-route.component.css')
        this.shadow.append(style);
    }

    get route() {
        return this._route;
    }

    set route(route) {
        this._route = route;
        this.render();
    }

    render() {
        this.input.value = this.route.name;
        this.input.value.length === 0 ? this.saveBtn.disabled = true : this.saveBtn.disabled = false;
    }

    connectedCallback() {
        // js
        this.input.addEventListener('input', () => {
            this.setAttribute('value', this.input.value);
        });

        this.closeBtn.addEventListener('click', () => {
            this.closeDialog();
        });

        this.saveBtn.addEventListener('click', () => {
            this.closeDialog();
            this.dispatchEvent(new CustomEvent('edit-name', { detail: { oldName: this.route.name, newName: this.input.value} }));
        });
    }

    static observedAttributes = ['value'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'value') {
                newValue.length == 0 ? this.saveBtn.disabled = true : this.saveBtn.disabled = false;
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

customElements.define('app-edit-route-dialog', EditRouteDialogComponent);