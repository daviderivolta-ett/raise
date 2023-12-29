export class TabInfo extends HTMLElement {
    _isGrabbed;
    _startX;
    _scrollLeft;
    _features;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.features = [];
    }

    get features() {
        return this._features;
    }

    set features(features) {
        this._features = features;
    }

    render() {

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
        style.setAttribute('href', './css/tab-info.css');
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

    checkFeature(feature) {
        let isPresent = this.features.some(item => item.coordinates.latitude == feature.coordinates.latitude && item.coordinates.longitude == feature.coordinates.longitude);
        if (!isPresent) {
            this.createCard(feature);
        } else {
            let index = this.features.findIndex(item => item.coordinates.latitude == feature.coordinates.latitude && item.coordinates.longitude == feature.coordinates.longitude);
            this.removeCard(index);            
            this.createCard(feature);
        }
    }

    createCard(feature) {
        let card = document.createElement('app-info-card');
        this.shadow.prepend(card);
        card.feature = feature;
        this.features.unshift(feature);

        card.addEventListener('remove-card', () => {
            let index = this.features.findIndex(item => item.coordinates.latitude == feature.coordinates.latitude && item.coordinates.longitude == feature.coordinates.longitude);
            this.removeCard(index);
        });
    }

    removeCard(index) {
        let cards = this.shadow.querySelectorAll('app-info-card');
        cards[index].remove();
        this.features.splice(index, 1);
    }
}

customElements.define('app-tab-info', TabInfo);