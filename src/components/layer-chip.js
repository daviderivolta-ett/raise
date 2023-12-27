import { ColorManager } from '../services/ColorManager';

export class LayerChip extends HTMLElement {
    _layer;
    _isGrabbed;

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

    get isGrabbed() {
        return this._isGrabbed;
    }

    set isGrabbed(isGrabbed) {
        this._isGrabbed = isGrabbed;
        this.isGrabbed == true ? this.style.cursor = 'grabbing' : this.style.cursor = 'pointer';
    }

    render() { }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <div class="select">
                    <span class="legend"></span>
                    <label></label>
                </div>
                <div class="divider">
                    <span class="vr"></span>
                </div>
                <div class="delete">
                    <span class="icon delete-icon">
                        <span class="material-symbols-outlined">close</span>
                    </span>
                </div>
            </div>
            `
            ;

        this.select = this.shadow.querySelector('.select');
        this.legend = this.shadow.querySelector('.legend');
        this.label = this.shadow.querySelector('label');
        this.icon = this.shadow.querySelector('.icon');

        this.colorManager.hex = this.layer.style.color;
        this.colorManager.rgba = this.colorManager.convertHexToRgba(this.colorManager.hex);

        this.label.innerText = this.layer.name;
        this.legend.style.backgroundColor = this.colorManager.changeOpacity(this.colorManager.rgba, 0.25);
        this.legend.style.borderColor = this.colorManager.rgba;
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";

        // js
        this.addEventListener('mousedown', e => {
            this.isGrabbed = true;
        });

        this.addEventListener('mouseup', e => {
            this.isGrabbed = false;
        });

        this.icon.addEventListener('click', () => {
            this.remove();
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/layer-chip.css');
        this.shadow.append(style);
    }

    disconnectedCallback() {
        this.dispatchEvent(new CustomEvent('bench-layer', { detail: { layer: this.layer } }));
    }
}

customElements.define('app-layer-chip', LayerChip);