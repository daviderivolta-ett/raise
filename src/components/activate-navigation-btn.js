export class NavigationBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    render() {
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <label for="checkbox">Crea percorso</label>
                <input type="checkbox" id="checkbox">
            </div>
            `
            ;

        this.input = this.shadow.querySelector('input');

        if (!this.hasAttribute('is-enable')) {
            this.setAttribute('is-enable', 'false');
            this.input.disabled = true;
        }

        if (!this.hasAttribute('is-checked')) {
            this.setAttribute('is-checked', 'false');
        }

        // js
        this.input.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('is-checked', isChecked + '');
        })

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/activate-navigation-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-enable', 'is-checked'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'is-enable' && oldValue !== null && newValue !== null && newValue !== oldValue) {

            this.getAttribute('is-enable') == 'true' ? this.input.disabled = false : this.input.disabled = true;
            this.getAttribute('is-enable') == 'false' ? this.setAttribute('is-checked', 'false') : '';
            this.getAttribute('is-enable') == 'false' ? this.input.checked = false : '';
        }

        if (name == 'is-checked' && oldValue !== null && newValue !== null && newValue !== oldValue) {

            const event = new CustomEvent('routeTriggered', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);

        }
    }
}

customElements.define('app-navigation-btn', NavigationBtn);