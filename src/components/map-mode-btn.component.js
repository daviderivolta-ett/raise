export class MapModeBtnComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <button>
                <span class="icon">
                    <span class="material-symbols-outlined">view_in_ar</span>
                </span>
            </button>
            `
            ;

        this.button = this.shadow.querySelector('button');
        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', false);
        if (!this.hasAttribute('is-maximized')) this.setAttribute('is-maximized', false);
        if (!this.hasAttribute('mode')) this.setAttribute('mode', '2d');

        // js
        this.button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('change-map-mode'));
            this.getAttribute('mode') === '2d' ? this.setAttribute('mode', '3d') : this.setAttribute('mode', '2d');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map-mode-btn.component.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'is-maximized', 'mode'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                newValue === 'true' ? this.classList.add('open') : this.classList.remove('open');
            }

            if (name == 'is-maximized') {
                newValue === 'true' ? this.classList.add('maximized') : this.classList.remove('maximized');
            }

            if (name == 'mode') {
                newValue === '3d' ? this.classList.add('highlight') : this.classList.remove('highlight');
            }
        }
    }
}

customElements.define('app-map-mode-btn', MapModeBtnComponent);