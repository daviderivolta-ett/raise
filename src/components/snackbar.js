export class SnackBar extends HTMLElement {
    static snackbars = [];

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        SnackBar.snackbars.push(this);
    }

    render() {
        this.p.innerText = this.getAttribute('text');
    }

    connectedCallback() {
        const index = SnackBar.snackbars.indexOf(this);

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24">
                    <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
                </svg>
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
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/snackbar.css');

        // const cssVar = document.createElement('style');
        // cssVar.innerHTML = `:host { --snackbar-counter: ${64 * SnackBar.counter}px; }`;

        // this.shadow.append(cssVar);
        this.shadow.append(style);

        this.style.setProperty('transform', 'translateX(-50%)');
        this.style.setProperty('position', 'fixed');
        this.style.setProperty('left', '50%');
        this.style.setProperty('bottom', `${64 * index}px`);
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
        const index = SnackBar.snackbars.indexOf(this);
        if (index !== -1) {
            SnackBar.snackbars.splice(index, 1);
            this.updatePosition();
        }
    }

    updatePosition() {
        SnackBar.snackbars.forEach((snackbar, index) => {
            snackbar.style.setProperty('bottom', `${64 * (index + 1)}px`);
        });
    }
}

customElements.define('app-snackbar', SnackBar);