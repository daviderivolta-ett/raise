export class CenterPositionBtnComponent extends HTMLElement {
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
            <span class="icon">
                <span class="material-symbols-outlined">my_location</span>
            </span>
            `
            ;

        this.shadow.append(this.button);
        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', false);
        if (!this.hasAttribute('is-maximized')) this.setAttribute('is-maximized', false);

        // js
        this.button.addEventListener('click', () => this.dispatchEvent(new CustomEvent('center-position')));

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/center-position-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'is-maximized'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                newValue === 'true' ? this.classList.add('open') : this.classList.remove('open');
            }

            if (name == 'is-maximized') {
                newValue === 'true' ? this.classList.add('maximized') : this.classList.remove('maximized');
            }
        }
    }
}

customElements.define('app-center-position', CenterPositionBtnComponent);