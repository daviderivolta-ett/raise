export class SearchResult extends HTMLElement {
    _layers;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', false);
    }

    get layers() {
        return this._layers;
    }

    set layers(layers) {
        this._layers = layers;
        this.render();
    }

    render() {
        this.div.innerHTML = '';
        if (this.layers.length == 0) {
            let msg = document.createElement('p');
            msg.innerText = 'Nessun livello trovato'
            this.div.append(msg);
        } else {
            this.layers.forEach(layer => {
                let chip = document.createElement('app-search-result-chip');
                chip.layer = layer;
                this.div.append(chip);
                chip.addEventListener('add-layer', e => {
                    document.dispatchEvent(new CustomEvent('add-layer', {
                        detail: { layers: [ e.detail.layer ] }
                    }));
                    this.setAttribute('is-open', false);
                });
                this.div.scrollTop = 0;
            });
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML = `<div></div>`;
        this.div = this.shadow.querySelector('div');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/search-result.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'is-open') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
            }
        }
    }
}

customElements.define('app-search-result', SearchResult);