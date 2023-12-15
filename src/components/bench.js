export class Bench extends HTMLElement {
    _data;
    _input;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._data = [];
    }

    get input() {
        return this._input;
    }

    set input(input) {
        this._input = input;
        this._data.push(this.input);
        this.data = this._data;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
        this.render();
    }

    render() {
        this.div.innerHTML = '';
        this.data.forEach(layer => {
            let benchLayer = document.createElement('app-bench-layer');
            benchLayer.layer = layer;
            this.div.append(benchLayer);
        });

        this.layers = this.shadow.querySelectorAll('app-bench-layer');
        this.layers.forEach(layer => {
            layer.addEventListener('restorelayer', e => {
                this.removeLayer(e.detail.layer);
                this.dispatchEvent(new CustomEvent('restorelayer', {
                    detail: { layer: e.detail.layer }
                }));
            });;
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`;
        this.div = this.shadow.querySelector('div');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/bench.css');
        this.shadow.append(style);
    }

    removeLayer(layerToRemove) {
        this._data = this._data.filter(layer => layerToRemove.layer !== layer.layer);
        this.data = this._data;
    }
}

customElements.define('app-bench', Bench);