export class Carousel extends HTMLElement {
    _data;
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
        this.render();
        this.dispatchEvent(new CustomEvent('activeLayers', {
            detail: { activeLayers: this._data }
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
        this.div.innerHTML = '';
        this._data.forEach(layer => {
            let chip = document.createElement('app-layer-chip');
            this.div.append(chip);
            chip.layer = layer;
        });

        let chips = this.shadow.querySelectorAll('app-layer-chip');
        chips.forEach(chip => {
            chip.addEventListener('benchlayer', e => {
                const layerToBench = e.detail.layer;
                this.dispatchEvent(new CustomEvent('benchlayer', {
                    detail: { layer: layerToBench }
                }));
                this.removeLayer(layerToBench);
            });
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`
        this.div = this.shadow.querySelector('div');

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

    addLayer(layer) {
        this._data.push(layer);
        this.data = this._data;
    }

    removeLayer(layerToRemove) {
        this._data = this._data.filter(layer => layerToRemove.layer !== layer.layer);
        this.data = this._data;
    }
}

customElements.define('app-carousel', Carousel);