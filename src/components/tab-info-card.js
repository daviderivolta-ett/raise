export class InfoCard extends HTMLElement {
    _feature;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get feature() {
        return this._feature;
    }

    set feature(feature) {
        this._feature = feature;
        this.render();
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
                <div class="info">
                    <div class="title">
                        <h4 class="name"></h4>
                        <p class="category"></p>
                    </div>
                    <div class="tools"></div>
                </div>
                <div class="content"></div>
            </div>
            `
            ;

        this.close = this.shadow.querySelector('.close-icon');
        this.info = this.shadow.querySelector('.info');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.tools = this.shadow.querySelector('.tools');
        this.content = this.shadow.querySelector('.content');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab-info-card.css');
        this.shadow.append(style);
    }

    render() {
        console.log(this.feature);
        const properties = this.feature.properties;
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

        this.playBtn = document.createElement('app-play-info-btn');
        this.tools.append(this.playBtn);

        if (!this.feature.coordinates || !typeof this.feature.coordinates == 'object') return;

        const coordinates = {};
        coordinates.longitude = this.feature.coordinates.longitude;
        coordinates.latitude = this.feature.coordinates.latitude;

        this.goToBtn = document.createElement('app-goto');
        this.goToBtn.coordinates = coordinates;
        this.tools.insertBefore(this.goToBtn, this.playBtn);

        this.goToBtn.addEventListener('go-to', e => {
            this.goTo(e.detail.coordinates);
        });
    }

    goTo(coordinates) {
        const url = `https://www.google.com/maps/dir/?api=1` +
            `&destination=${coordinates.latitude},${coordinates.longitude}`;
        window.open(url, '_blank');
    }
}

customElements.define('app-info-card', InfoCard);