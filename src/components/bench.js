export class Bench extends HTMLElement {
    _data;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._data = [];
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;      
        if (this._data.length == 0) this.dispatchEvent(new CustomEvent('benchempty'));
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`;
        this.div = this.shadow.querySelector('div');
        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', 'false');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/bench.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
            }
        }
    }

    addLayer(layer) {
        this._data.push(layer);
        this.createChip(layer);
        this.data = this._data;
    }

    removeLayer(layerToRemove) {
        this._data = this._data.filter(layer => layerToRemove.layer !== layer.layer);
        this.data = this._data;
    }

    createChip(layer) {
        let benchLayer = document.createElement('app-bench-layer');
        benchLayer.layer = layer;
        this.div.append(benchLayer);

        benchLayer.addEventListener('restorelayer', e => {
            this.removeLayer(e.detail.layer);
            this.dispatchEvent(new CustomEvent('restorelayer', {
                detail: { layer: e.detail.layer }
            }));
        });;

        benchLayer.addEventListener('deletelayer', e => {
            this.removeLayer(e.detail.layer);
        });
    }
}

customElements.define('app-bench', Bench);