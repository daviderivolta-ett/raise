import { EventObservable } from '../observables/EventObservable.js';

export class TabInfoPanelComponent extends HTMLElement {
    _feature;
    _isOpen;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._isOpen = false;
    }

    get feature() {
        return this._feature;
    }

    set feature(feature) {
        this._feature = feature;
        this.render();
    }

    get isOpen() {
        return this._isOpen;
    }

    set isOpen(isOpen) {
        this._isOpen = isOpen;
    }

    render() {
        const properties = this.feature.properties;
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
                this.info.append(div);
            }
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <button>Leggi info</button>
            <div class="info"></div>
            `
            ;

        this.setAttribute('is-open', this.isOpen);
        this.button = this.shadow.querySelector('button');
        this.info = this.shadow.querySelector('.info');

        // js
        this.button.addEventListener('click', () => {
            const isOpen = JSON.parse(this.getAttribute('is-open'));
            this.setAttribute('is-open', !isOpen + '');
        });

        EventObservable.instance.subscribe('tab-maximize', isMaximized => {
            this.setAttribute('is-open', isMaximized + '');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.info.panel.component.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                this.isOpen = JSON.parse(newValue);
                this.isOpen == true ? this.classList.add('open') : this.classList.remove('open');
                this.isOpen == true ? this.button.innerHTML = 'Mostra meno' : this.button.innerHTML = 'Leggi info';
                EventObservable.instance.publish('tab-maximize', this.isOpen);
            }
        }
    }
}

customElements.define('app-info-panel', TabInfoPanelComponent);