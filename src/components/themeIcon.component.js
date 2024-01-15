export class ThemeIconComponent extends HTMLElement {
    _themes;
    _theme;
    _themeIndex;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.themeIndex = 0;
    }

    get themes() {
        return this._themes;
    }

    set themes(themes) {
        this._themes = themes;
    }

    get theme() {
        return this._theme;
    }

    set theme(theme) {
        this._theme = theme;
        this.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.theme }
        }));
    }

    get themeIndex() {
        return this._themeIndex;
    }

    set themeIndex(themeIndex) {
        this._themeIndex = themeIndex;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `
            ;

        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="icon">
                <span class="material-symbols-outlined">contrast</span>
            </span>
            `
            ;

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', () => {
            this.themeIndex = (this.themeIndex + 1) % this.themes.length;

            if (this.themeIndex == 0) {
                this.theme = {};
            } else {
                this.theme = this.themes[this.themeIndex];
            }
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/themeIcon.component.css');
        this.shadow.append(style);
    }

    setTheme(index) {
        this.themeIndex = index;
        this.theme = this.themes[this.themeIndex];
    }
}

customElements.define('app-theme-icon', ThemeIconComponent);