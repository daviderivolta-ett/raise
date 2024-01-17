export class ManageRoutesDialogComponent extends HTMLElement {
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
                        <h3 class="title">Gestisci</h3>
                        <div class="list"></div>
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="load" type="submit">Carica</button>
                    </div>
                </div>
            </dialog>
            `
            ;

        this.dialog = this.shadow.querySelector('dialog');
        this.list = this.shadow.querySelector('.list');
    }

    get routes() {
        return this._routes;
    }

    set routes(routes) {
        this._routes = routes;
        this.render();
    }

    render() {
        this.list.innerHTML = '';
        this.routes.forEach(route => {
            let p = document.createElement('p');
            p.innerHTML = route.name;
            this.list.append(p);
        });
    }

    connectedCallback() {
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

customElements.define('app-manage-routes-dialog', ManageRoutesDialogComponent);