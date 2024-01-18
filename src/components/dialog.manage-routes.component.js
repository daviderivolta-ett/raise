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
                        <h3 class="title">Carica</h3>
                    </div>
                    <form>
                        <div class="list"></div>
                        <div class="buttons">
                            <button class="cancel" type="button">Annulla</button>
                            <button class="load" type="submit" disabled>Carica</button>
                        </div>
                    </form>
                </div>
            </dialog>
            `
            ;

        this.dialog = this.shadow.querySelector('dialog');
        this.form = this.shadow.querySelector('form');
        this.list = this.shadow.querySelector('.list');
        this.cancelBtn = this.shadow.querySelector('.cancel');
        this.loadBtn = this.shadow.querySelector('.load');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/dialog.manage-route.component.css');
        this.shadow.append(style);
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
            let div = document.createElement('div');
            div.classList.add('selection');
            div.innerHTML =
                `
                <input type="radio" id="${route.name}" name="route" value="${route.name}">
                <label for="${route.name}">${route.name}</label>
                `
                ;
            this.list.append(div);
        });

        let allRadioBtns = this.shadow.querySelectorAll('input[type="radio"]');
        allRadioBtns.forEach(radio => {
            radio.addEventListener('change', () => {
                let isAnySelected = Array.from(allRadioBtns).some(radio => {
                    return radio.checked;
                });
                this.loadBtn.disabled = !isAnySelected;
            });
        });
    }

    connectedCallback() {
        // html
        this.loadBtn.disabled = true;

        // js
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.closeDialog();
            this.loadBtn.disabled = true;
            let selectedRoute = this.shadow.querySelector('input[name="route"]:checked').value;
            this._routes.forEach(route => {
                if (route.name == selectedRoute) {
                    this.dispatchEvent(new CustomEvent('load-route', { detail: { route } }));
                    return;
                }
            });
        });
        this.cancelBtn.addEventListener('click', () => this.closeDialog());
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
            this.loadBtn.disabled = true;
        } else {
            this.dialog.removeAttribute('open');
        }
    }
}

customElements.define('app-manage-routes-dialog', ManageRoutesDialogComponent);