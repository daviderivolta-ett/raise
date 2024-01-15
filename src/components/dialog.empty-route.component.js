export class EmptyRouteDialogComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });

        // html
        this.shadow.innerHTML =
            `
            <dialog>
                <div class="content">
                    <div class="message">
                        <p>Sicuro di voler eliminare tutte le tappe?</p>
                        <p>Questo non eliminerà il percorso salvato in memoria.</p>
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="delete" type="submit">Elimina</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        this.dialog = this.shadow.querySelector('dialog');
        this.closeBtn = this.shadow.querySelector('.cancel');
        this.deleteBtn = this.shadow.querySelector('.delete');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/dialog.empty-route.component.css')
        this.shadow.append(style);
    }

    connectedCallback() {
        // js
        this.closeBtn.addEventListener('click', () => this.closeDialog());
        this.deleteBtn.addEventListener('click', () => {
            this.closeDialog();
            this.dispatchEvent(new CustomEvent('empty-route'));
        });
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

customElements.define('app-empty-route', EmptyRouteDialogComponent);