export class AddToRouteBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="material-symbols-outlined">add</span>
            <span class="label">Aggiungi</span>
            `
        ;

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-route'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/add-to-route-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-add-to-route', AddToRouteBtn);