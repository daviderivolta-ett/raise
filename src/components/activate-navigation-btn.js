export class NavigationBtn extends HTMLElement {
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
            <div>
                <label>Percorso</label>
                <button type="button">Indicazioni</button>
            </div>
            `
        ;

        this.btn = this.shadow.querySelector('button');

        if (!this.hasAttribute('is-enable')) {
            this.setAttribute('is-enable', 'false');
            this.btn.disabled = true;
        }

        if (!this.hasAttribute('is-route-active')) {
            this.setAttribute('is-route-active', 'false');
        }

        // js
        this.btn.addEventListener('click', (event) => {
            this.setAttribute('is-route-active', 'true');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/activate-navigation-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-enable', 'is-route-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'is-enable' && oldValue !== null && newValue !== null && newValue !== oldValue) {

            this.getAttribute('is-enable') == 'true' ? this.btn.disabled = false : this.btn.disabled = true;
            this.getAttribute('is-enable') == 'false' ? this.setAttribute('is-route-active', 'false') : '';
        }

        if (name == 'is-route-active' && oldValue !== null && newValue !== null && newValue !== oldValue) {

            const event = new CustomEvent('routeTriggered', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);

        }
    }
}

customElements.define('app-navigation-btn', NavigationBtn);