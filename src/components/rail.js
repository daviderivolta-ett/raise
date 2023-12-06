export class Rail extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.themes = this.getAttribute('themes');
        this.themeBtn.setAttribute('themes', this.themes);
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="rail">
                <div class="menu">
                    <img src="/images/RAISE-pictogram-neg.svg" alt="Logo di RAISE" class="logo">
                    <app-drawer-toggle></app-drawer-toggle>
                    <app-icon-btn link="/"></app-icon-btn>
                </div>
            <app-theme-icon></app-theme-icon>
            </div>
            `
        ;

        this.drawerToggle = this.shadow.querySelector('app-drawer-toggle');
        this.themeBtn = this.shadow.querySelector('app-theme-icon');

        // js
        this.drawerToggle.addEventListener('drawerToggled', (event) => {
            this.setAttribute('is-open', event.detail.newValue);
        });

        this.themeBtn.addEventListener('themeChanged', (event) => {
            this.dispatchEvent(new CustomEvent('themeChanged', { detail: { newValue: event.detail.newValue } }));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/rail.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'themes'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {

            if (name == 'themes') {
                this.render();
            }

            if (name == 'is-open') {
                this.drawerToggle.setAttribute('is-open', newValue + '');
                this.dispatchEvent(new CustomEvent('drawerToggled', { detail: { newValue } }));
            }
            
        }
    }
}

customElements.define('app-rail', Rail);