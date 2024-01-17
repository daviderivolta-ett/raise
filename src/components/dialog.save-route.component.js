export class SaveRouteDialogComponent extends HTMLElement {
    _route;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });

        // html
        this.shadow.innerHTML =
            `
            <dialog>
                <div class="content">
                    <div class="message">
                        <p>Questa sovrascriverà i dati relativi al percorso <span class="route-name"></span>. Procedere?</p>
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
        this.routeName = this.shadow.querySelector('.route-name');
        this.closeBtn = this.shadow.querySelector('.cancel');
        this.saveBtn = this.shadow.querySelector('.save');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/dialog.save-route.component.css')
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
        this.routeName.innerHTML = this.route.name;
    }

    connectedCallback() {
        // js
        this.closeBtn.addEventListener('click', () => this.closeDialog());
        this.saveBtn.addEventListener('click', () => {
            this.closeDialog();
            this.dispatchEvent(new CustomEvent('save-route'));
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

customElements.define('app-save-route-dialog', SaveRouteDialogComponent);