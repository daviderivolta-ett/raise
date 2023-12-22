export class Carousel extends HTMLElement {
    _isGrabbed;
    _startX;
    _scrollLeft;
    _layers;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.isGrabbed = false;
        this._layers = [];
    }

    get layers() {
        return this._layers;
    }

    set layers(layers) {
        this._layers = layers;
        this.dispatchEvent(new CustomEvent('loadlayers', { detail: { activeLayers: this.layers } }));
        this.render();
    }

    get isGrabbed() {
        return this._isGrabbed;
    }

    set isGrabbed(isGrabbed) {
        this._isGrabbed = isGrabbed;
        this.isGrabbed == true ? this.style.cursor = 'grabbing' : this.style.cursor = 'pointer';
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`;
        this.div = this.shadow.querySelector('div');

        // js
        this.addEventListener('mousedown', e => this.start(e));
        this.addEventListener('touchstart', e => this.start(e));
        this.addEventListener('mousemove', e => this.move(e));
        this.addEventListener('touchmove', e => this.move(e));
        this.addEventListener('mouseup', this.end);
        this.addEventListener('touchend', this.end);
        this.addEventListener('mouseleave', this.end);

        document.addEventListener('add-layer', e => {
            let newLayers = this.checkLayers(this._layers, e.detail.layers);
            newLayers.forEach(layer => this._layers.push(layer));
            this.layers = this._layers;
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/carousel.css');
        this.shadow.append(style);
    }

    start(e) {
        this.isGrabbed = true;
        this._startX = e.pageX || e.touches[0].pageX - this.offsetLeft;
        this._scrollLeft = this.scrollLeft;
    }

    move(e) {
        if (this.isGrabbed == false) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX - this.offsetLeft;
        const walk = (x - this._startX);
        this.scrollLeft = this._scrollLeft - walk;
    }

    end() {
        this.isGrabbed = false;
    }

    render() {
        this.layers.forEach(layer => {
            this.createChip(layer);
        });
    }

    createChip(layer) {
        let chip = document.createElement('app-layer-chip');
        chip.layer = layer;
        this.div.append(chip);
        chip.addEventListener('benchlayer', e => {
            const layerToBench = e.detail.layer;
            this.dispatchEvent(new CustomEvent('benchlayer', {
                detail: { layer: layerToBench }
            }));
            this.removeLayer(layerToBench);
        });
    }

    checkLayers(oldArray, newArray) {
        return newArray.filter(newArrayItem => !oldArray.some(oldArrayItem => newArrayItem.name == oldArrayItem.name));
    }
}

customElements.define('app-carousel', Carousel);