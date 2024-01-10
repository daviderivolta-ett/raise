export class TabInfoExpansionComponent extends HTMLElement {
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

    render() {
        console.log(this.feature);
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
                this.shadow.append(div);
            }
        }
    }

    connectedCallback() {
        // html
        this.setAttribute('is-open', false);

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.info.expansion.component.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
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

customElements.define('app-info-expansion', TabInfoExpansionComponent);