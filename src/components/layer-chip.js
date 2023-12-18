export class LayerChip extends HTMLElement {
    _layer;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get layer() {
        return this._layer;
    }

    set layer(layer) {
        this._layer = layer;
        this.render();
    }

    render() {
        this.label.innerText = this.layer.name;
        this.legend.style.backgroundColor = this.layer.style.color;
        this.legend.style.borderColor = "rgba(241, 245, 244, 1)";
        this.legend.style.borderWidth = "2px";
        this.legend.style.borderStyle = "solid";
    }

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

        this.legend = this.shadow.querySelector('.legend');
        this.label = this.shadow.querySelector('label');
        this.icon = this.shadow.querySelector('.icon');

        // js
        this.addEventListener('mousedown', () => {
            this.style.cursor = 'grabbing';
        });

        this.addEventListener('mouseup', () => {
            this.style.cursor = 'pointer';
        });

        this.icon.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('benchlayer', {
                detail: { layer: this.layer }
            }));
            // this.remove();
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/layer-chip.css');
        this.shadow.append(style);
    }
}

customElements.define('app-layer-chip', LayerChip);