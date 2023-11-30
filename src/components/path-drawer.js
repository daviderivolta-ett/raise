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

        this.allInfoboxes.forEach(infobox => {
            infobox.addEventListener('remove', (event) => {
                let feature = event.detail.data;
                let features = this.checkFeature(feature);
                this.setAttribute('features', JSON.stringify(features));
                console.log(JSON.parse(this.getAttribute('features')));
            });
        });
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

        if (!this.hasAttribute('features')) this.setAttribute('features', '[]');
        this.setAttribute('is-open', 'false');

        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.div = this.shadow.querySelector('.info-container');

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

                if (newValue == '[]') {
                    this.setAttribute('is-open', 'false');
                }
                else {
                    this.setAttribute('is-open', 'true');
                    this.render();
                }

            }
        }
    }

    //// Da controllare
    checkFeature(feature) {
        let features = JSON.parse(this.getAttribute('features'));

        if (!features.some(obj => JSON.stringify(obj.properties) === JSON.stringify(feature.properties))) {
            features.push(feature);
        }

        return features;
    }

}

customElements.define('app-path-drawer', PathDrawer);