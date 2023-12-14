export class BenchLayer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        if(!this.hasAttribute('title')) this.setAttribute('title', '');
        
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span>
                <label>${this.getAttribute('title')}</label>
                <span class="icon">
                    <span class="material-symbols-outlined">delete</span>
                </span>
            </span>
            `
        ;


    }
}

customElements.define('app-bench-layer', BenchLayer);