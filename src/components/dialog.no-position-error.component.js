export class NoPositionErrorDialogComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <dialog>
                <div class="content">
                    <div class="message">
                        <h3 class="title">Posizione non trovata</h3>
                        <p>Per utilizzare questa funzione l'applicazione necessita di avere accesso alla posizione del dispositivo.</p>
                        <p>Attivare la geolocalizzazione e ricaricare l'applicazione per utilizzare la funzione.</p>
                    </div>
                    <div class="buttons">
                        <button class="close" type="button">Va bene</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        this.dialog = this.shadow.querySelector('dialog');
        this.closeBtn = this.shadow.querySelector('.close');

        // js
        this.closeBtn.addEventListener('click', () => this.closeDialog());

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/dialog.no-position-error.component.css')
        this.shadow.append(style);
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

customElements.define('app-no-position-dialog', NoPositionErrorDialogComponent);