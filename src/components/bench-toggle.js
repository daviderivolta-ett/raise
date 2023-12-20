export class BenchToggle extends HTMLElement {
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
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `
        ;

        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="icon">
                <span class="material-symbols-outlined">apps</span>
            </span>
            `
        ;

        this.shadow.append(this.button);

        this.setAttribute('is-open', 'false');
        let isOpen = this.getAttribute('is-open');
        this.btn = this.shadow.querySelector('button');

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
        if (newValue != oldValue) {

            if (name == 'is-open') {
                const event = new CustomEvent('drawerToggled', { detail: { isOpen: newValue } });
                this.dispatchEvent(event);
            }
        }
    }
}

customElements.define('app-bench-toggle', BenchToggle);