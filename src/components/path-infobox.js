export class PathInfobox extends HTMLElement {
    static counter = 0;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="wrapper">
                <div class="info">
                    <div class="title">
                        <h4 class="name"></h4>
                        <p class="category"></p>
                    </div>
                    <div class="tools">
                        <app-goto></app-goto>
                        <app-play-info-btn></app-play-info-btn>
                    </div>
                </div>
                <div class="content"></div>
            </div>
            `
        ;

        this.data = JSON.parse(this.getAttribute('data'));
        this.info = this.shadow.querySelector('.info');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.playBtn = this.shadow.querySelector('app-play-info-btn');
        this.goToBtn = this.shadow.querySelector('app-goto');
        this.content = this.shadow.querySelector('.content');

        const properties = this.data.properties;
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const value = properties[key];

                if (key == 'Title') {
                    this.category.innerText = value;
                    continue;
                };

                if (key == 'Nome') {
                    this.name.innerText = value;
                    continue;
                }

                const p = document.createElement('p');
                p.innerText = value;
                this.content.append(p);
            }
        }

        if (typeof this.data.coordinates == 'object' ) {
            const coordinates = {};
            coordinates.longitude = this.data.coordinates.longitude;
            coordinates.latitude = this.data.coordinates.latitude;
            this.goToBtn.setAttribute('coordinates', JSON.stringify(coordinates));
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
}

customElements.define('app-path-infobox', PathInfobox);