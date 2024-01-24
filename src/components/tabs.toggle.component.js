export class TabsToggleComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.getAttribute('is-open') == 'false'? this.gliph.innerHTML = 'menu' : this.gliph.innerHTML = 'close';
    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="icon">
                <span class="material-symbols-outlined">menu</span>
            </span>
            `
            ;

        this.shadow.append(this.button);
        this.gliph = this.shadow.querySelector('.material-symbols-outlined');

        this.setAttribute('is-open', 'false');
        let isOpen = this.getAttribute('is-open');
        this.btn = this.shadow.querySelector('button');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tabs.toggle.component.css');
        this.shadow.append(style);

        // js
        this.btn.addEventListener('click', () => {
            isOpen = this.getAttribute('is-open') === 'true';
            this.setAttribute('is-open', !isOpen + '');
        });
    }

    static observedAttributes = ['is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'is-open') {
                const event = new CustomEvent('drawer-toggle', { detail: { isOpen: newValue } });
                this.dispatchEvent(event);
                this.render();
            }
        }
    }
}

customElements.define('app-tabs-toggle', TabsToggleComponent);