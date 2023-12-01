export class RemoveBtn extends HTMLElement {
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
            <span class="material-symbols-outlined">close</span>
            <span class="label">Rimuovi</span>
            `
        ;

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('remove'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/remove-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-remove-btn', RemoveBtn);