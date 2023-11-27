export class PathInfobox extends HTMLElement {
    static counter = 0;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        PathInfobox.counter++;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="wrapper">
                <div class="info">
                    <app-play-info-btn></app-play-info-btn>
                </div>
                <div class="content"></div>
            </div>
            `
        ;

        this.data = JSON.parse(this.getAttribute('data'));
        this.content = this.shadow.querySelector('.content');
        this.info = this.shadow.querySelector('.info');
        this.playBtn = this.shadow.querySelector('app-play-info-btn');

        const p = document.createElement('p');
        p.innerText = PathInfobox.counter;
        this.info.insertBefore(p, this.playBtn);

        const properties = this.data.properties;
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const value = properties[key];
                const p = document.createElement('p');
                p.innerText = value;
                this.content.append(p);
            }
        }

        if (Array.isArray(this.data.geometry.coordinates)) {
            console.log(this.data.geometry.coordinates);
            this.goToBtn = document.createElement('app-goto');
            const coordinates = {};
            coordinates.longitude = this.data.geometry.coordinates[0];
            coordinates.latitude = this.data.geometry.coordinates[1];
            this.goToBtn.setAttribute('coordinates', JSON.stringify(coordinates));
            this.info.append(this.goToBtn);
        }        

        // js
        this.goToBtn.addEventListener('goto', (e) => {
            const event = new CustomEvent('goto', { detail: { coordinates: e.detail.coordinates } });
            this.dispatchEvent(event);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-infobox.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback(name, newValue, oldValue) {

    }

    disconnectedCallback() {
        PathInfobox.counter = 0;
    }
}

customElements.define('app-path-infobox', PathInfobox);