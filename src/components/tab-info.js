export class TabInfo extends HTMLElement {
    _feature;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get feature() {
        return this._feature;
    }

    set feature(feature) {
        this._feature = feature;
        this.render();
    }

    render() {
        this.component.innerHTML = '';
        let card = document.createElement('app-info-card');
        this.component.append(card);
        card.feature = this.feature;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = '<div class="component"></div>';
        this.component = this.shadow.querySelector('.component');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab-info.css');
        this.shadow.append(style);
    }
}

customElements.define('app-tab-info', TabInfo);