export class Carousel extends HTMLElement {
    _data;
    _output;
    _isGrabbed;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.isGrabbed = false;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
        this._output = this.getLayers(this.data);
        this.output = this._output;
        this.render();
    }

    get output() {
        return this._output;
    }

    set output(output) {
        this._output = output;
        this.dispatchEvent(new CustomEvent('activeLayers', {
            detail: { activeLayers: this._output }
        }));
    }

    get isGrabbed() {
        return this._isGrabbed;
    }

    set isGrabbed(isGrabbed) {
        this._isGrabbed = isGrabbed;
        this.isGrabbed == true ? this.style.cursor = 'grabbing' : this.style.cursor = 'pointer';
    }

    render() {
        let layers = this.getLayers(this.data);
        layers.forEach(layer => {
            let chip = document.createElement('app-layer-chip');
            this.shadow.append(chip);
            chip.layer = layer;
        });

        let chips = this.shadow.querySelectorAll('app-layer-chip');
        chips.forEach(chip => {
            chip.addEventListener('benchlayer', e => {
                const layerToBench = e.detail.layer;
                this.dispatchEvent(new CustomEvent('benchlayer', {
                    detail: { layer: layerToBench }
                }));
                const activeLayers = this._output.filter(layer => {
                    return layerToBench.layer !== layer.layer;
                });
                
                this.output = activeLayers;
            });
        });
    }

    connectedCallback() {
        // js
        let startX;
        let scrollLeft;

        this.addEventListener('mousedown', e => {
            this.isGrabbed = true;
            startX = e.pageX - this.offsetLeft;
            scrollLeft = this.scrollLeft;
        });

        this.addEventListener('mouseleave', e => {
            this.isGrabbed = false;
        });

        this.addEventListener('mouseup', e => {
            this.isGrabbed = false;
        });

        this.addEventListener('mousemove', e => {
            if (this.isGrabbed == false) return;
            e.preventDefault();
            const x = e.pageX - this.offsetLeft;
            const walk = (x - startX);
            this.scrollLeft = scrollLeft - walk;
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/carousel.css');
        this.shadow.append(style);
    }

    getLayers(object) {
        let layers = [];
        object.categories.forEach(category => {
            category.groups.forEach(group => {
                group.layers.forEach(layer => {
                    layers.push(layer);
                });
            });
        });
        return layers;
    }
}

customElements.define('app-carousel', Carousel);