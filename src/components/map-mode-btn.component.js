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
                <div class="icon">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480h80q0 115 72.5 203T418-166l-58-58 56-56L598-98q-29 10-58.5 14T480-80Zm20-280v-240h120q17 0 28.5 11.5T660-560v160q0 17-11.5 28.5T620-360H500Zm-200 0v-60h100v-40h-60v-40h60v-40H300v-60h120q17 0 28.5 11.5T460-560v160q0 17-11.5 28.5T420-360H300Zm260-60h40v-120h-40v120Zm240-60q0-115-72.5-203T542-794l58 58-56 56-182-182q29-10 58.5-14t59.5-4q83 0 156 31.5T763-763q54 54 85.5 127T880-480h-80Z"/></svg>
                    </span>
                </div>
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