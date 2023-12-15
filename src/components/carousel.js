export class Carousel extends HTMLElement {
    _data;
    _output;
    _isGrabbed;
    _startX;
    _scrollLeft;

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
        this.addEventListener('mousedown', e => this.start(e));
        this.addEventListener('touchstart', e => this.start(e));
        this.addEventListener('mousemove', e => this.move(e));
        this.addEventListener('touchmove', e => this.move(e));
        this.addEventListener('mouseup', this.end);
        this.addEventListener('touchend', this.end);
        this.addEventListener('mouseleave', this.end);

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
}

customElements.define('app-carousel', Carousel);