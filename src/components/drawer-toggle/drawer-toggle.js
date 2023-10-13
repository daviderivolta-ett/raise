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
            <a id="menu-toggle" class="menu-toggle">
                <span class="menu-toggle-bar menu-toggle-bar--top"></span>
                <span class="menu-toggle-bar menu-toggle-bar--middle"></span>
                <span class="menu-toggle-bar menu-toggle-bar--bottom"></span>
            </a>
            `
            ;

        this.setAttribute('is-open', 'false');
        let isOpen = this.getAttribute('is-open');
        this.a = this.shadow.querySelector('a');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'src/components/drawer-toggle/drawer-toggle.css');
        this.shadow.append(style);

        // js
        this.a.addEventListener('click', () => {
            console.log(isOpen);
            isOpen = this.getAttribute('is-open') === 'true';
            this.a.classList.toggle('nav-open');
            this.setAttribute('is-open', !isOpen + '');
        });
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            const event = new CustomEvent('drawerToggled', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-drawer-toggle', DrawerToggle);