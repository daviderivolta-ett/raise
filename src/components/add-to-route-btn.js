export class AddToRouteBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `
        ;

        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="material-symbols-outlined">add</span>
            <span class="label">Aggiungi a percorso</span>
            `
        ;

        this.shadow.append(this.button);

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/add-to-route-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-add-to-route', AddToRouteBtn);