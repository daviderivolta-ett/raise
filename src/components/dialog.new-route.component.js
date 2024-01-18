import { LocalStorageService } from "../services/local-storage.service";

export class NewRouteDialogComponent extends HTMLElement {
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
                        <p>Attenzione: questa azione eliminerà i dati non salvati sul percorso attualmente selezionato.</p>
                        <input type="text" placeholder="Nome percorso">
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="save" type="submit">Salva</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        this.dialog = this.shadow.querySelector('dialog');
        this.input = this.shadow.querySelector('input');
        this.closeBtn = this.shadow.querySelector('.cancel');
        this.saveBtn = this.shadow.querySelector('.save');

        this.saveBtn.disabled = true;
    }

    render() {
        this.input.value.length === 0 ? this.saveBtn.disabled = true : this.saveBtn.disabled = false;
        console.log(LocalStorageService.instance.getData());
    }

    connectedCallback() {
        // js
        this.input.addEventListener('input', () => {
            this.input.value.length === 0 ? this.saveBtn.disabled = true : this.saveBtn.disabled = false;
        });

        this.closeBtn.addEventListener('click', () => this.closeDialog());
        this.saveBtn.addEventListener('click', () => {
            this.closeDialog();
            this.dispatchEvent(new CustomEvent('create-route', { detail: { name: this.input.value } }));
            this.input.value = '';
        });
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