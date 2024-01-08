export class TabCustomRoute extends HTMLElement {
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

    connectedCallback() {
        // js
        document.addEventListener('add-route', e => {
            let feature = e.detail.feature;
            this.checkFeature(feature);
        });

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
        style.setAttribute('href', './css/tab.customroute.component.css');
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
        let isPresent = this.features.some(item => item.id === feature.id);
        if(!isPresent) {
            this.createCard(feature);
        } else {
            let index = this.features.findIndex(item => item.id === feature.id);
            this.removeCard(index);
            this.createCard(feature);
        }
    }

    createCard(feature) {
        let card = document.createElement('app-tab-custom-route-card');
        card.feature = feature;
        this.features.unshift(feature);
        this.shadow.prepend(card);
        this.scrollLeft = 0;

        card.addEventListener('remove-card', () => {
            let index = this.features.findIndex(item => item.id === feature.id);
            this.removeCard(index);
        });
        console.log(this.features);
    }

    removeCard(index) {
        let cards = this.shadow.querySelectorAll('app-tab-custom-route-card');
        cards[index].remove();
        this.features.splice(index, 1);
        console.log(this.features);
    }
}

customElements.define('app-tab-custom-route', TabCustomRoute);