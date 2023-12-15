export class BenchLayer extends HTMLElement {
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

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <span class="add">
                    <span class="icon add-icon">
                        <span class="material-symbols-outlined">add</span>
                    </span>
                    <label>${this.layer.name}</label>
                </span>
                <span class="delete">
                    <span class="icon delete-icon">
                        <span class="material-symbols-outlined">delete</span>
                    </span>
                </span>
            </div>
            `
        ;

        this.add = this.shadow.querySelector('.add');
        this.delete = this.shadow.querySelector('.delete');

        // js
        this.add.addEventListener('click', e => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('restorelayer', {
                detail: { layer: this.layer }
            }));
        });

        this.delete.addEventListener('click', e => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('deletelayer', {
                detail: { layer: this.layer }
            }));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/bench-layer.css');
        this.shadow.append(style);
    }
}

customElements.define('app-bench-layer', BenchLayer);