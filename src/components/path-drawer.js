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
            if(i == this.features.length - 1) infobox.classList.add('last');
            this.div.append(infobox);
        }

        this.allInfoboxes = this.shadow.querySelectorAll('app-path-infobox');
        this.allInfoboxes.forEach(infobox => {
            infobox.addEventListener('goto', (e) => {
                this.dispatchEvent(new CustomEvent('goto', {detail: e.detail.coordinates}));
            });
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="drawer-toggle">
                <button class="open-drawer-icon">
                    <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <button class="close-drawer-icon">
                    <span class="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
            <div class="path-drawer-header">
                <h2>Indicazioni</h2>
                <span class="material-symbols-outlined close-icon">close</span>
            </div>
            <div class="info-container"></div>
            `
        ;

        this.setAttribute('is-active', 'false');
        
        this.openArrow = this.shadow.querySelector('.open-drawer-icon');
        this.closeArrow = this.shadow.querySelector('.close-drawer-icon');
        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.div = this.shadow.querySelector('.info-container');

        // js
        this.openArrow.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('pathDrawerOpened'));
            this.setAttribute('is-active', 'true');
        });

        this.closeArrow.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('pathDrawerClosed'));
            this.setAttribute('is-active', 'false');
        });

        this.closeIcon.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('closeNavigation'));
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
            }

            if (name == 'features') this.render();
        }
    }
}

customElements.define('app-path-drawer', PathDrawer);