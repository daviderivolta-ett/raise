export class SearchResultChip extends HTMLElement {
    _layer;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get layer() {
        return this._layer;
    }

    set layer(layer) {
        this._layer = layer;
    }

    render() { }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <label>${this.layer.name}</label>
                <span class="icon add-icon">
                <span class="material-symbols-outlined">add</span>
                </span>
            </div>
            `
        ;
    }
}

customElements.define('app-search-result-chip', SearchResultChip);