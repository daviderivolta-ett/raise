export class PathDrawer extends HTMLElement {
    static features = [];

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.features = JSON.parse(this.getAttribute('features'));
        this.div.innerHTML = '';

        if (this.features.length != 0) {
            this.startNavigationBtn.setAttribute('features', JSON.stringify(this.features));
            this.generateInfobox(this.div, this.features);

            this.allInfoboxes = this.shadow.querySelectorAll('app-path-infobox');
            this.allInfoboxes.forEach(infobox => {
                infobox.addEventListener('goto', (e) => {
                    this.dispatchEvent(new CustomEvent('goto', { detail: e.detail.coordinates }));
                });
            });

            this.allInfoboxes.forEach(infobox => {
                infobox.addEventListener('remove', (event) => {
                    let feature = event.detail.data;
                    let features = this.checkFeature(feature);
                    this.setAttribute('features', JSON.stringify(features));
                });
            });

            this.allInfoboxes.forEach(infobox => {
                infobox.addEventListener('selectedFeature', event => {
                    let feature = event.detail.data;
                    this.dispatchEvent(new CustomEvent('selectedFeature', { detail: { data: feature } }));
                });
            });

        } else {
            this.startNavigationBtn.setAttribute('features', '[]');
            this.emptyMsg = document.createElement('app-empty-msg')
            this.div.append(this.emptyMsg);

            this.emptyMsg.addEventListener('empty', () => {
                this.dispatchEvent(new CustomEvent('empty'));
                this.setAttribute('is-open', 'false');
            });
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="drawer">
                <div class="header">
                    <app-save-route-input></app-save-route-input>
                    <div class="header-tools">
                        <app-save-route-btn></app-save-route-btn>
                        <div class="close-icon">
                            <span class="material-symbols-outlined">close</span>
                        </div>
                    </div>
                </div>
                <div class="info-container"><app-empty-msg></app-empty-msg></div>
                <app-navigation></app-navigation>
            </div>
            `
            ;

        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.saveRouteInput = this.shadow.querySelector('app-save-route-input');
        this.saveRouteBtn = this.shadow.querySelector('app-save-route-btn');
        this.div = this.shadow.querySelector('.info-container');
        this.emptyMsg = this.shadow.querySelector('app-empty-msg');
        this.startNavigationBtn = this.shadow.querySelector('app-navigation');

        if (!this.hasAttribute('features')) this.setAttribute('features', '[]');
        if (!this.hasAttribute('route-name')) this.setAttribute('route-name', 'Nuovo percorso');
        if (!this.hasAttribute('is-navigation')) this.setAttribute('is-navigation', 'false');
        this.setAttribute('is-open', 'false');

        // js
        this.saveRouteBtn.addEventListener('saveCustomRoute', () => {
            const name = this.saveRouteInput.getAttribute('value');
            let customRoute = {};
            customRoute.name = name;
            const features = JSON.parse(this.getAttribute('features'));
            customRoute.features = features;
            this.dispatchEvent(new CustomEvent('saveCustomRoute', { detail: { customRoute } }));
        });

        this.closeIcon.addEventListener('click', () => {
            this.setAttribute('is-open', 'false');
        });

        this.startNavigationBtn.addEventListener('activateNavigation', (e) => {
            PathDrawer.features = e.detail.features;
            const isNavigation = e.detail.isNavigation;
            this.setAttribute('is-navigation', isNavigation + '');
        });

        this.emptyMsg.addEventListener('empty', () => {
            this.dispatchEvent(new CustomEvent('empty'));
            this.setAttribute('is-open', 'false');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-drawer.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'is-navigation', 'features', 'route-name'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue  && oldValue != null) {

            if (name == 'is-open') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
                this.dispatchEvent(new CustomEvent('pathDrawerStatusChanged', { detail: { newValue } }));
            }

            if (name == 'is-navigation') {
                const features = PathDrawer.features;
                const isNavigation = newValue;
                this.dispatchEvent(new CustomEvent('activateNavigation', {
                    detail: { features, isNavigation }
                }));
                this.startNavigationBtn.setAttribute('is-navigation', isNavigation + '');
            }

            if (name == 'features') {
                this.setAttribute('is-open', 'true');
                this.startNavigationBtn.setAttribute('is-navigation', 'false');
                this.render();
            }

            if (name == 'route-name') {
                this.saveRouteInput.setAttribute('value', newValue);
            }
        }
    }

    generateInfobox(div, features) {
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            const infobox = document.createElement('app-path-infobox');
            infobox.setAttribute('data', JSON.stringify(feature));
            if (i == features.length - 1) infobox.classList.add('last');
            div.append(infobox);
        }
    }


    checkFeature(feature) {
        let features = JSON.parse(this.getAttribute('features'));
        const i = features.findIndex(obj => {
            return JSON.stringify(obj.properties) == JSON.stringify(feature.properties);
        });
        features.splice(i, 1);
        return features;
    }

}

customElements.define('app-path-drawer', PathDrawer);