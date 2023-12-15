export class BenchLayer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        if (!this.hasAttribute('title')) this.setAttribute('title', '');

        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <span class="add">
                    <span class="icon add-icon">
                        <span class="material-symbols-outlined">add</span>
                    </span>
                    <label>${this.getAttribute('title')}</label>
                </span>
                <span class="delete">
                    <span class="icon delete-icon">
                        <span class="material-symbols-outlined">delete</span>
                    </span>
                </span>
            </div>
            `
            ;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/bench-layer.css');
        this.shadow.append(style);
    }
}

customElements.define('app-bench-layer', BenchLayer);