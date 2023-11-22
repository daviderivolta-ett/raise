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

        // js
        this.btn.addEventListener('click', () => {
            const event = new CustomEvent('routeTriggered');
            this.dispatchEvent(event);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/activate-navigation-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-enable'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== null && newValue !== null && newValue !== oldValue) {

            if (name == 'is-enable') {
                this.getAttribute('is-enable') == 'true' ? this.btn.disabled = false : this.btn.disabled = true;
                this.getAttribute('is-enable') == 'false' ? this.setAttribute('is-route-active', 'false') : '';
            }

        }
    }
}

customElements.define('app-navigation-btn', NavigationBtn);