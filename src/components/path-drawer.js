export class PathDrawer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.features = JSON.parse(this.getAttribute('features'));
        this.div.innerHTML = '';

        if (this.features.length != 0) {
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

        } else {        
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
                    <h2 class="title">Percorso tematico</h2>
                    <div class="close-icon">
                        <span class="material-symbols-outlined">close</span>
                    </div>
                </div>
                <div class="info-container"></div>
            </div>
            `
        ;

        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.div = this.shadow.querySelector('.info-container');

        if (!this.hasAttribute('features')) this.setAttribute('features', '[]');
        this.setAttribute('is-open', 'false');

        // js
        this.closeIcon.addEventListener('click', () => {
            this.setAttribute('is-open', 'false');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-drawer.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'features'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {

            if (name == 'is-open') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
                this.dispatchEvent(new CustomEvent('pathDrawerStatusChanged', { detail: { newValue } }));
            }

            if (name == 'features') {

                // if (newValue == '[]') {
                //     this.setAttribute('is-open', 'false');
                // }
                // else {
                this.setAttribute('is-open', 'true');
                this.render();
                // }

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