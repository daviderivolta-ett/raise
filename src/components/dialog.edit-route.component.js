export class EditRouteDialogComponent extends HTMLElement {
    _route;
    _routes;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });

        // html
        this.shadow.innerHTML =
            `
            <dialog>
                <div class="content">
                    <input type="text" placeholder="Nome percorso">
                    <span class="validation">Esiste già un percorso con questo nome</span>
                    <div class="buttons">
                        <button class="close" type="button">Annulla</button>
                        <button class="submit" type="submit">Salva</button>
                    </div>
                    <div class="other-actions">
                        <button class="delete" type="button">Elimina percorso</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        if (!this.hasAttribute('is-name-available')) this.setAttribute('is-name-available', true);
        this.dialog = this.shadow.querySelector('dialog');
        this.input = this.shadow.querySelector('input');
        this.validation = this.shadow.querySelector('.validation');
        this.closeBtn = this.shadow.querySelector('.close');
        this.saveBtn = this.shadow.querySelector('.submit');
        this.deleteBtn = this.shadow.querySelector('.delete');

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

    get routes() {
        return this._routes;
    }

    set routes(routes) {
        this._routes = routes;
    }

    render() {
        this.input.value = this.route.name;
        this.input.value.length === 0 ? this.saveBtn.disabled = true : this.saveBtn.disabled = false;
    }

    connectedCallback() {
        // js
        this.input.addEventListener('input', () => {
            if (this.input.value.length === 0) {
                this.saveBtn.disabled = true;
            } else {
                this.setAttribute('is-name-available', true);
                this.routes.forEach(route => {
                    if (route.name.toLowerCase() === this.input.value.toLowerCase()) {
                        this.setAttribute('is-name-available', false);
                        return;
                    }
                });
                let isNameAvailable = JSON.parse(this.getAttribute('is-name-available'));
                this.saveBtn.disabled = !isNameAvailable;
            }
        });

        this.closeBtn.addEventListener('click', () => {
            this.closeDialog();
        });

        this.saveBtn.addEventListener('click', () => {
            this.closeDialog();
            this.dispatchEvent(new CustomEvent('edit-name', { detail: { oldName: this.route.name, newName: this.input.value } }));
        });

        this.deleteBtn.addEventListener('click', () => {
            this.closeDialog();
            this.dispatchEvent(new CustomEvent('delete-route', { detail: { name: this.route.name } }));
        });
    }

    static observedAttributes = ['is-name-available'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'is-name-available') {
                newValue == 'false' ? this.validation.classList.add('not-available') : this.validation.classList.remove('not-available');
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