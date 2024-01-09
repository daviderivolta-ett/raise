import { ColorManager } from '../services/ColorManager';

export class InfoDrawerComponent extends HTMLElement {
    _feature;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.colorManager = new ColorManager();
    }

    get feature() {
        return this._feature;
    }

    set feature(feature) {
        this._feature = feature;
        this.render();
    }

    render() {
        this.category.innerText = '';
        this.name.innerText = '';
        this.content.innerHTML = '';

        const properties = this.feature.properties;

        properties.nome ? this.category.innerText = properties.nome : this.category.innerText = properties.raiseName;
        this.name.innerHTML = properties.raiseName;

        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const value = properties[key];
                if (key == 'raiseName' || key == 'nome') continue;

                const div = document.createElement('div');
                div.classList.add('argument');
                const h = document.createElement('h4');
                const separatedKey = key.replace(/([A-Z])/g, ' $1');
                const capitalizedKey = separatedKey.charAt(0).toUpperCase() + separatedKey.slice(1);
                h.innerHTML = capitalizedKey;
                div.append(h);
                const p = document.createElement('p');
                p.innerText = value;
                div.append(p);
                this.content.append(div);
            }
        }

        this.colorManager.hex = this.feature.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);
        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        this.playBtn.addEventListener('read-info', () => {
            const speaker = new SpeechSynthesisUtterance();
            speaker.lang = 'it';
            const textToRead = this.shadow.querySelector('.content').innerHTML;
            speaker.text = textToRead;
            window.speechSynthesis.speak(speaker);
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="component">
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
                <div class="info">
                    <div class="header">
                        <div class="title">
                            <span class="legend"></span>
                            <h4 class="name"></h4>
                        </div>
                        <p class="category"></p>
                    </div>
                    <div class="tools">
                        <app-play-info-btn></app-play-info-btn>
                    </div>
                </div>
                <div class="content"></div>
            </div>
            `
            ;

        this.setAttribute('is-open', false);

        this.close = this.shadow.querySelector('.close-icon');
        this.info = this.shadow.querySelector('.info');
        this.legend = this.shadow.querySelector('.legend');
        this.name = this.shadow.querySelector('.name');
        this.category = this.shadow.querySelector('.category');
        this.tools = this.shadow.querySelector('.tools');
        this.content = this.shadow.querySelector('.content');
        this.playBtn = this.shadow.querySelector('app-play-info-btn');

        // js
        document.addEventListener('expand-info', e => {
            this.setAttribute('is-open', true);
            this.feature = e.detail.feature;
        });

        this.close.addEventListener('click', () => this.setAttribute('is-open', false));

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/info.drawer.component.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                newValue == 'true' ? this.openDrawer() : this.closeDrawer();
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

customElements.define('app-info', InfoDrawerComponent);