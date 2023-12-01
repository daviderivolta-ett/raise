export class PathDrawerToggle extends HTMLElement {
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
            <span class="material-symbols-outlined">list</span>
            `
            ;

        if (!this.getAttribute('is-open')) this.setAttribute('is-open', 'false');

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', () => {
            let isOpen = JSON.parse(this.getAttribute('is-open'));
            this.setAttribute('is-open', !isOpen + '');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-drawer-toggle.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && newValue != null && oldValue != null) {

            if (name == 'is-open') {
                this.dispatchEvent(new CustomEvent('togglePathDrawer', {
                    detail: { newValue }
                }));

                newValue == 'true' ? this.classList.add('open') : this.classList.remove('open');
            }

        }
    }
}

customElements.define('app-path-drawer-toggle', PathDrawerToggle);