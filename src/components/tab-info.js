export class TabInfo extends HTMLElement {
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
        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab-info.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback(name, oldValue, newValue) {
    }

    addFeature(feature) {
        this.features.push(feature);
        this.createCard(feature);
    }

    createCard(feature) {
        let card = document.createElement('app-info-card');
        this.shadow.append(card);
        card.feature = feature;
    }
}

customElements.define('app-tab-info', TabInfo);