export class ThemeIcon extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div id="change-theme-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-palette2" viewBox="0 0 16 16">
                    <path d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 .5.5v5.277l4.147-4.131a.5.5 0 0 1 .707 0l3.535 3.536a.5.5 0 0 1 0 .708L10.261 10H15.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H3a2.99 2.99 0 0 1-2.121-.879A2.99 2.99 0 0 1 0 13.044m6-.21 7.328-7.3-2.829-2.828L6 7.188v5.647zM4.5 13a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM15 15v-4H9.258l-4.015 4H15zM0 .5v12.495V.5z"/>
                    <path d="M0 12.995V13a3.07 3.07 0 0 0 0-.005z"/>
                </svg>
            </div>
            `
            ;

        // js
        const themes = [
            {},
            {
                url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{TileMatrix}/{TileCol}/{TileRow}.png',
            },
            {
                url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{TileMatrix}/{TileCol}/{TileRow}.png',
            }
        ]

        let currentThemeIndex = 0;
        this.setAttribute('theme', '');

        this.div = this.shadow.querySelector('#change-theme-icon');
        this.div.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            if (currentThemeIndex === 0) {
                this.setAttribute('theme', '');
            } else {
                const themeUrl = themes[currentThemeIndex].url;
                this.setAttribute('theme', themeUrl);
            }
        })

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/theme-icon.css');
        this.shadow.append(style);

    }

    static observedAttributes = ['theme'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'theme' && newValue != oldValue && oldValue != null && newValue != null) {

            const event = new CustomEvent('themeChanged', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-theme-icon', ThemeIcon);