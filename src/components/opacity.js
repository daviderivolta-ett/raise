export class Opacity extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.getAttribute('is-enabled') == 'true' ? this.input.disabled = false : this.input.disabled = true;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <label>Opacità</label>
            <input type="range">
            `
        ;

        if (!this.hasAttribute('is-enabled')) this.setAttribute('is-enabled', 'false');
        if (!this.hasAttribute('opacity')) this.setAttribute(1);

        this.input = this.shadow.querySelector('input');

        this.input.setAttribute('min', 0);
        this.input.setAttribute('max', 1);
        this.input.setAttribute('step', 0.1);
        this.input.disabled = true;
        this.input.value = this.getAttribute('opacity');

        this.input.addEventListener('change', () => {
            this.setAttribute('opacity', this.input.value);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/opacity.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-enabled', 'opacity'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue && oldValue != null) {

            if (name == 'is-enabled') {
                this.render();
            }

            if (name == 'opacity') {
                this.dispatchEvent(new CustomEvent('opacityChanged', {
                    detail: { opacity: JSON.parse(this.getAttribute('opacity')) }
                }))
            }

        }
    }
}

customElements.define('app-opacity-slider', Opacity);