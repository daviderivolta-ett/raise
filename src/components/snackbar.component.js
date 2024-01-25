export class SnackBarComponent extends HTMLElement {
    static snackbars = [];

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        SnackBarComponent.snackbars.push(this);
    }

    render() {
        this.p.innerText = this.getAttribute('text');
    }

    connectedCallback() {
        const index = SnackBarComponent.snackbars.indexOf(this);

        // html
        this.shadow.innerHTML =
            `
            <div class="snackbar">
                <div class="content">
                    <p></p>
                </div>
            </div>
            `
            ;

        this.setAttribute('is-active', 'true');
        if (!this.hasAttribute('text')) this.setAttribute('text', '');
        if (!this.hasAttribute('type')) this.setAttribute('type', 'closable');

        this.snackbar = this.shadow.querySelector('.snackbar');
        this.content = this.shadow.querySelector('.content');
        this.p = this.shadow.querySelector('p');

        this.p.innerText = this.getAttribute('text');

        // Closable
        if (this.getAttribute('type') == 'closable') {
            if (this.getAttribute('text') == '') this.setAttribute('text', 'Chiudi');

            this.button = document.createElement('button');
            this.button.innerHTML =
                `
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
                `
                ;

            this.content.append(this.button);
            this.button.addEventListener('click', () => this.setAttribute('is-active', 'false'));
        }

        // Temporary
        if (this.getAttribute('type') == 'temporary') {
            let timeout;
            this.hasAttribute('timeout') ? timeout = this.getAttribute('timeout') : timeout = 3000;

            if (this.getAttribute('text') == '') this.setAttribute('text', 'Attendere...');

            this.bar = document.createElement('div');
            this.bar.classList.add('bar-color');
            this.bar.style.setProperty('width', '100%');
            this.snackbar.append(this.bar);

            let width = 100;
            let interval = setInterval(() => {
                if (width == 0) {
                    clearInterval(interval);
                    this.setAttribute('is-active', 'false');
                }

                width--;
                this.bar.style.width = width + '%';
            }, timeout / 100);
        }

        // Loader
        if (this.getAttribute('type') == 'loader') {
            if (this.getAttribute('text') == '') this.setAttribute('text', 'Caricamento...');
            let loaderIcon = document.createElement('div');
            loaderIcon.classList.add('loader-icon');
            this.content.prepend(loaderIcon);
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/snackbar.component.css');
        this.shadow.append(style);

        // this.style.setProperty('transform', 'translateX(-50%)');
        // this.style.setProperty('position', 'fixed');
        // this.style.setProperty('left', '50%');
        this.style.setProperty('bottom', `${56 + 64 * index}px`);
        // this.style.setProperty('z-index', '9999');
    }

    static observedAttributes = ['text', 'is-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && newValue != null && oldValue != null) {

            if (name == 'text') {
                this.render();
            }

            if (name == 'is-active' && newValue == 'false') {
                this.remove();
            }
        }
    }

    disconnectedCallback() {
        const index = SnackBarComponent.snackbars.indexOf(this);
        if (index !== -1) {
            SnackBarComponent.snackbars.splice(index, 1);
            this.updatePosition();
        }
    }

    updatePosition() {
        SnackBarComponent.snackbars.forEach((snackbar, index) => {
            snackbar.style.setProperty('bottom', `${56 + 64 * index}px`);
        });
    }

    static createLoaderSnackbar() {
        let snackbar = document.createElement('app-snackbar');
        snackbar.setAttribute('type', 'loader');
        snackbar.setAttribute('id', 'loading-layer')
        document.body.append(snackbar);
    }

    static createErrorSnackbar(name) {
        let snackbar = document.createElement('app-snackbar');
        snackbar.setAttribute('type', 'closable');
        snackbar.setAttribute('text', `Si è verificato un errore durante il caricamento del layer ${name}`);
        snackbar.setAttribute('id', 'error-snackbar')
        document.body.append(snackbar);
    }
}

customElements.define('app-snackbar', SnackBarComponent);