export class Settings extends HTMLElement {
    _themes;
    _theme;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.setAttribute('is-active', 'false');
    }

    get themes() {
        return this._themes;
    }

    set themes(themes) {
        this._themes = themes;
        this.themeIcon.themes = this.themes;
    }

    get theme() {
        return this._theme;
    }

    set theme(theme) {
        this._theme = theme;
        this.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.theme }
        }));      
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <app-link icon='tag' link ="/"></app-link>
            <app-theme-icon></app-theme-icon>
            `
        ;

        this.themeIcon = this.shadow.querySelector('app-theme-icon');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/settings.css');
        this.shadow.append(style);

        // js
        this.themeIcon.addEventListener('themeChanged', event => {
            this.theme = event.detail.theme;
        });
    }

    static observedAttributes = ['is-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue) {

            if (name == 'is-active') {
                const isActive = JSON.parse(this.getAttribute('is-active'));
                isActive == true ? this.classList.add('visible') : this.classList.remove('visible');
            }

        }
    }
}

customElements.define('app-settings', Settings);