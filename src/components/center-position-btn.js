export class CenterPositionBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">my_location</span>
            `
        ;

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', () => this.dispatchEvent(new CustomEvent('centerPosition')));

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/center-position-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-center-position', CenterPositionBtn);