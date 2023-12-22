import { ColorManager } from '../services/ColorManager.js';
import { LayersManager } from '../services/LayersManager.js';

export class SearchResultChip extends HTMLElement {
    _layer;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.colorManager = new ColorManager();
    }

    get layer() {
        return this._layer;
    }

    set layer(layer) {
        this._layer = layer;
    }

    render() { }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <div class="info">
                    <span class="legend"></span>
                    <label>${this.layer.name}</label>
                </div>
                <span class="icon add-icon">
                    <span class="material-symbols-outlined">add</span>
                </span>
            </div>
            `
            ;

        this.chip = this.shadow.querySelector('.chip');
        this.label = this.shadow.querySelector('label');
        this.legend = this.shadow.querySelector('.legend');

        this.colorManager.hex = this.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);

        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        // js
        this.chip.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-layer', { detail: { layer: this.layer } }));
            LayersManager.instance.publish('addlayer', this.layer);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/search-result-chip.css');
        this.shadow.append(style);
    }
}

customElements.define('app-search-result-chip', SearchResultChip);