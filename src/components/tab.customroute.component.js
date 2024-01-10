import { EventObservable } from '../observables/EventObservable.js';

export class TabCustomRoute extends HTMLElement {
    _isGrabbed;
    _features;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.isGrabbed = false;
        this.features = [];
    }

    get features() {
        return this._features;
    }

    set features(features) {
        this._features = features;
    }

    get isGrabbed() {
        return this._isGrabbed;
    }

    set isGrabbed(isGrabbed) {
        this._isGrabbed = isGrabbed;
    }

    connectedCallback() {
        // js
        EventObservable.instance.subscribe('addtoroutebtn-click', feature => {
            this.checkFeature(feature);
            this.resetOrder();
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
        if (!isPresent) {
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
            this.resetOrder();
        });

        card.addEventListener('increase-order', () => {
            let eventCardIndex = this.features.findIndex(item => item.id === feature.id);
            let followingCardIndex = eventCardIndex + 1;
            this.features.splice(eventCardIndex, 1);
            this.features.splice(followingCardIndex, 0, feature);

            let cards = this.shadow.querySelectorAll('app-tab-custom-route-card');
            if (!cards[followingCardIndex]) return;
            cards[followingCardIndex].insertAdjacentElement('afterend', cards[eventCardIndex]);
            this.resetOrder();
        });

        card.addEventListener('decrease-order', () => {
            let eventCardIndex = this.features.findIndex(item => item.id === feature.id);
            let previousCardIndex = eventCardIndex - 1;
            this.features.splice(eventCardIndex, 1);
            this.features.splice(previousCardIndex, 0, feature);

            let cards = this.shadow.querySelectorAll('app-tab-custom-route-card');
            if (!cards[previousCardIndex]) return;
            this.shadow.insertBefore(cards[eventCardIndex], cards[previousCardIndex]);
            this.resetOrder();
        });
    }

    removeCard(index) {
        let cards = this.shadow.querySelectorAll('app-tab-custom-route-card');
        cards[index].remove();
        this.features.splice(index, 1);
    }

    resetOrder() {
        this.cards = this.shadow.querySelectorAll('app-tab-custom-route-card');
        let order = 1;
        this.cards.forEach(card => {
            card.setAttribute('order', order);
            order++;
        });
    }
}

customElements.define('app-tab-custom-route', TabCustomRoute);