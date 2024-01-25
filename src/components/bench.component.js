import { LocalStorageService } from "../services/local-storage.service";
import { SnackBarComponent } from "./snackbar.component";

export class BenchComponent extends HTMLElement {
    _layers;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._layers = [];
    }

    get layers() {
        return this._layers;
    }

    set layers(layers) {
        this._layers = layers;
        if (this._layers.length == 0) this.dispatchEvent(new CustomEvent('bench-empty'));
        LocalStorageService.instance.updateBenchLayers(this._layers);
        // console.log('Bench', this.layers);
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`;
        this.div = this.shadow.querySelector('div');
        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', 'false');

        // js
        document.addEventListener('bench-layer', e => {
            let newLayers = this.checkLayers(this._layers, e.detail.layers);
            newLayers.forEach(layer => { this.addLayer(layer); });
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/bench.component.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                if (newValue == 'true') {
                    if (this._layers.length == 0) this.dispatchEvent(new CustomEvent('bench-empty'));
                    this.classList.add('visible');
                } else {
                    this.classList.remove('visible');
                }
            }
        }
    }

    addLayer(layer) {
        this._layers.push(layer);
        this.createChip(layer);
        this.layers = this._layers;
    }

    removeLayer(layerToRemove) {
        this._layers = this._layers.filter(layer => layerToRemove.layer !== layer.layer);
        this.layers = this._layers;
    }

    createChip(layer) {
        let benchLayer = document.createElement('app-bench-layer');
        benchLayer.layer = layer;
        this.div.append(benchLayer);

        benchLayer.addEventListener('restore-layer', e => {
            this.removeLayer(e.detail.layer);
            document.dispatchEvent(new CustomEvent('add-layer', { detail: { layers: [e.detail.layer] } }));
            SnackBarComponent.createLoaderSnackbar();
        });

        benchLayer.addEventListener('delete-layer', e => {
            this.removeLayer(e.detail.layer);
        });
    }

    checkLayers(oldArray, newArray) {
        return newArray.filter(newArrayItem => !oldArray.some(oldArrayItem => newArrayItem.name == oldArrayItem.name));
    }
}

customElements.define('app-bench', BenchComponent);