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
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z"/>
            </svg>
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