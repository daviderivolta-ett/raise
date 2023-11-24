export class ThemeIcon extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        const themes = JSON.parse(this.getAttribute('themes'));

        let currentThemeIndex = 0;
        this.setAttribute('current-theme', '');

        this.button.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            if (currentThemeIndex === 0) {
                this.setAttribute('current-theme', '');
            } else {
                const theme = JSON.stringify(themes[currentThemeIndex]);
                this.setAttribute('current-theme', theme);
            }
        })
    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">contrast</span>
            `
        ;

        this.shadow.append(this.button);

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/theme-icon.css');
        this.shadow.append(style);

    }

    static observedAttributes = ['themes', 'current-theme'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'themes') {
            this.render();
        }

        if (name == 'current-theme' && newValue != oldValue && oldValue != null && newValue != null) {

            const event = new CustomEvent('themeChanged', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-theme-icon', ThemeIcon);