import { DataSource } from "cesium";

export class InfoDrawer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.data = JSON.parse(this.getAttribute('data'));

        this.category.innerText = '';
        this.name.innerText = '';
        this.tools.innerHTML = '';
        this.content.innerHTML = '';

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

        this.playBtn = document.createElement('app-play-info-btn');
        this.tools.append(this.playBtn);

        if (!this.data.coordinates || !typeof this.data.coordinates == 'object') return;

        const coordinates = {};
        coordinates.longitude = this.data.coordinates.longitude;
        coordinates.latitude = this.data.coordinates.latitude;

        this.goToBtn = document.createElement('app-goto');
        this.goToBtn.setAttribute('coordinates', JSON.stringify(coordinates));
        this.tools.insertBefore(this.goToBtn, this.playBtn);

        this.addToRouteBtn = document.createElement('app-add-to-route');
        this.tools.insertBefore(this.addToRouteBtn, this.playBtn);

        this.goToBtn.addEventListener('goto', (e) => {
            this.dispatchEvent(new CustomEvent('goto', { detail: e.detail.coordinates }));
        });

        this.addToRouteBtn.addEventListener('click', () => {
            this.data = JSON.parse(this.getAttribute('data'));
            this.dispatchEvent(new CustomEvent('addToRoute', { detail: { data: this.data } }));
        });

        this.playBtn.addEventListener('readInfo', () => {
            const speaker = new SpeechSynthesisUtterance();
            speaker.lang = 'it';
            const textToRead = this.shadow.querySelector('.content').innerHTML;
            speaker.text = textToRead;
            window.speechSynthesis.speak(speaker);
        });

    }

    connectedCallback() {
        this.setAttribute('is-open', 'false');
        this.setAttribute('data', '');

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
                    <div class="tools">
                        <app-add-to-route></app-add-to-route>
                        <app-play-info-btn></app-play-info-btn>
                    </div>
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

        // js
        this.close.addEventListener('click', () => this.setAttribute('is-open', 'false'));

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/info-drawer.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'data'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && newValue != null && oldValue != null) {

            if (name == 'is-open') {
                newValue == 'true' ? this.openDrawer() : this.closeDrawer();
            }

            if (name == 'data') {
                this.closeDrawer();
                setTimeout(() => {
                    this.render();
                    this.openDrawer();
                }, 0);
            }

        }
    }

    openDrawer() {
        this.classList.remove('close');
        this.classList.add('open');
    }

    closeDrawer() {
        this.classList.remove('open');
        this.classList.add('close');
    }
}

customElements.define('app-info-drawer', InfoDrawer);