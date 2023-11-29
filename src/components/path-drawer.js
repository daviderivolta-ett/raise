export class PathDrawer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.features = JSON.parse(this.getAttribute('features'));
        this.div.innerHTML = '';

        for (let i = 0; i < this.features.length; i++) {
            const feature = this.features[i];
            const infobox = document.createElement('app-path-infobox');
            infobox.setAttribute('data', JSON.stringify(feature));
            if (i == this.features.length - 1) infobox.classList.add('last');
            this.div.append(infobox);
        }

        this.allInfoboxes = this.shadow.querySelectorAll('app-path-infobox');
        this.allInfoboxes.forEach(infobox => {
            infobox.addEventListener('goto', (e) => {
                this.dispatchEvent(new CustomEvent('goto', { detail: e.detail.coordinates }));
            });
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="drawer">
                <div class="close-icon"><span class="material-symbols-outlined">close</span></div>
                <div class="header"></div>
                <div class="info-container"></div>
            </div>
            `
        ;

        if (!this.hasAttribute('features')) this.setAttribute('features', '[]');
        this.setAttribute('is-active', 'false');

        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.div = this.shadow.querySelector('.info-container');

        // js

        this.closeIcon.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('pathDrawerClosed'));
            this.setAttribute('is-active', 'false');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-drawer.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-active', 'features'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'is-active') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
                this.dispatchEvent(new CustomEvent('pathDrawerStatusChanged', { detail: { newValue } }));
            }

            if (name == 'features') {

                if (newValue == '[]') { this.classList.remove('draggable'); }
                else {
                    this.classList.add('draggable');
                    this.render();
                }

            }
        }
    }
}

customElements.define('app-path-drawer', PathDrawer);