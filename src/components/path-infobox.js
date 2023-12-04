export class PathInfobox extends HTMLElement {
    static counter = 0;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        PathInfobox.counter++;
    }

    connectedCallback() {
        // html
        console.log(this.counter);
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
                <div class="info">
                    <div class="order">
                        <div class="drag-icon">
                            <span class="material-symbols-outlined">drag_indicator</span>
                        </div>
                        <p class="index"></p>
                    </div>
                    <div class="title">
                        <h4 class="name"></h4>
                        <p class="category"></p>
                    </div>
                    <app-remove-btn></app-remove-btn>
                </div>
                <div class="content"></div>
            </div>
            `
            ;

        this.data = JSON.parse(this.getAttribute('data'));
        this.info = this.shadow.querySelector('.info');
        this.index = this.shadow.querySelector('.index');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.removeBtn = this.shadow.querySelector('app-remove-btn');
        // this.playBtn = this.shadow.querySelector('app-play-info-btn');
        // this.goToBtn = this.shadow.querySelector('app-goto');
        // this.content = this.shadow.querySelector('.content');

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

                // const p = document.createElement('p');
                // p.innerText = value;
                // this.content.append(p);
            }
        }

        this.index.innerText = PathInfobox.counter;

        // if (typeof this.data.coordinates == 'object' ) {
        //     const coordinates = {};
        //     coordinates.longitude = this.data.coordinates.longitude;
        //     coordinates.latitude = this.data.coordinates.latitude;
        //     this.goToBtn.setAttribute('coordinates', JSON.stringify(coordinates));
        // }        

        // js
        // this.goToBtn.addEventListener('goto', (e) => {
        //     const event = new CustomEvent('goto', { detail: { coordinates: e.detail.coordinates } });
        //     this.dispatchEvent(event);
        // });

        // js
        this.removeBtn.addEventListener('remove', () => {
            const event = new CustomEvent('remove', {
                detail: { data: this.data }
            })
            this.dispatchEvent(event);
        });

        this.addEventListener('click', () => {
            const event = new CustomEvent('selectedFeature', {
                detail: { data: this.data }
            });
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
        PathInfobox.counter--;
    }
}

customElements.define('app-path-infobox', PathInfobox);