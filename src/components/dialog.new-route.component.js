import { LocalStorageService } from "../services/local-storage.service";

export class NewRouteDialogComponent extends HTMLElement {
    _routes;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });

        // html
        this.shadow.innerHTML =
            `
            <dialog>
                <div class="content">
                    <div class="message">
                        <h3 class="title">Nuovo percorso</h3>
                        <p>Scegliere il nome per il nuovo percorso.</p>
                        <input type="text" placeholder="Nome percorso">
                        <span class="validation">Esiste già un percorso con questo nome</span>
                        <p>Attenzione: questa azione eliminerà i dati non salvati sul percorso attualmente selezionato.</p>
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="save" type="submit">Salva</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        if (!this.hasAttribute('is-name-available')) this.setAttribute('is-name-available', true);
        this.dialog = this.shadow.querySelector('dialog');
        this.input = this.shadow.querySelector('input');
        this.validation = this.shadow.querySelector('.validation');
        this.closeBtn = this.shadow.querySelector('.cancel');
        this.saveBtn = this.shadow.querySelector('.save');

        this.saveBtn.disabled = true;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/dialog.new-route.component.css');
        this.shadow.append(style);
    }

    get routes() {
        return this._routes;
    }

    set routes(routes) {
        this._routes = routes;
    }

    render() {
        this.input.value.length === 0 ? this.saveBtn.disabled = true : this.saveBtn.disabled = false;
        this.routes = LocalStorageService.instance.reloadData().routes;
    }

    connectedCallback() {
        // services
        if (LocalStorageService.instance.reloadData()) {
            this.routes = LocalStorageService.instance.reloadData().routes;
        }

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


        this.closeBtn.addEventListener('click', () => this.closeDialog());
        this.saveBtn.addEventListener('click', () => {
            this.closeDialog();
            this.dispatchEvent(new CustomEvent('create-route', { detail: { name: this.input.value } }));
            this.input.value = '';
        });
    }

    static observedAttributes = ['is-name-available'];
    attributeChangedCallback(name, oldvalue, newValue) {
        if (newValue != oldvalue) {
            if (name == 'is-name-available') {
                newValue == 'false' ? this.validation.classList.add('not-available') : this.validation.classList.remove('not-available');
            }
        }
    }

    openDialog() {
        if (this.dialog.showModal) {
            this.dialog.showModal();
            this.render();
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

customElements.define('app-new-route-dialog', NewRouteDialogComponent);