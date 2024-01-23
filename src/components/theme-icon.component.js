export class ThemeIconComponent extends HTMLElement {
    _themeIndex;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._themeIndex = 0;
    }

    get themeIndex() {
        return this._themeIndex;
    }

    set themeIndex(themeIndex) {
        this._themeIndex = themeIndex;
        this.dispatchEvent(new CustomEvent('themechange', { detail: { themeIndex } }));
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
            let currentNum = this._themeIndex;
            currentNum++;
            if (currentNum > 2) currentNum = 0;
            this.themeIndex = currentNum;
            localStorage.setItem('theme', JSON.stringify(this._themeIndex));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/themeIcon.component.css');
        this.shadow.append(style);
    }
}

customElements.define('app-theme-icon', ThemeIconComponent);