export class GoToBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">turn_right</span>
            `
        ;

        this.icon = this.shadow.querySelector('.material-symbols-outlined');

        // js
        this.icon.addEventListener('click', () => {
            this.coordinates = JSON.parse(this.getAttribute('coordinates'));
            const event = new CustomEvent('goto', { detail: { coordinates: this.coordinates } });
            this.dispatchEvent(event);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/goto-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-goto', GoToBtn);