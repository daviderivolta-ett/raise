export class DrawerToggle extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="menu-toggle">
                <a id="menu-toggle">
                    <span class="menu-toggle-bar menu-toggle-bar--top"></span>
                    <span class="menu-toggle-bar menu-toggle-bar--middle"></span>
                    <span class="menu-toggle-bar menu-toggle-bar--bottom"></span>
                </a>
            </div>
            `
        ;

        this.setAttribute('is-open', 'false');
        let isOpen = this.getAttribute('is-open');
        this.btn = this.shadow.querySelector('.menu-toggle');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/drawer-toggle.css');
        this.shadow.append(style);

        // js
        this.btn.addEventListener('click', () => {
            isOpen = this.getAttribute('is-open') === 'true';
            this.setAttribute('is-open', !isOpen + '');
        });
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'is-open') {
            if (this.btn) {
                if (newValue === 'true') {
                    this.btn.classList.add('nav-open');
                    
                } else {
                    this.btn.classList.remove('nav-open');
                }
            }

            const event = new CustomEvent('drawerToggled', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-drawer-toggle', DrawerToggle);