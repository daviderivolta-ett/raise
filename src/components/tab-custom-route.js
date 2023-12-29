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
        document.addEventListener('add-route', e => {
            let feature = e.detail.feature;
            this.createCard(feature);
            console.log(this.features);
        });
    }

    createCard(feature) {
        let card = document.createElement('p');
        card.innerText = feature.layer.name;
        this.features.unshift(feature);
        this.shadow.prepend(card);
    }
}

customElements.define('app-tab-custom-route', TabCustomRoute);