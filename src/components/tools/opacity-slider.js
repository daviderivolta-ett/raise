export class OpacitySlider extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.getAttribute('is-enable') == 'true' ? this.input.disabled = false : this.input.disabled = true;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <label>Opacità</label>
                <input type="range">
            </div>
            `
        ;

        this.setAttribute('is-enable', 'false');
        this.input = this.shadow.querySelector('input');

        if (this.getAttribute('is-enable') == 'false') {
            this.input.disabled = true;
        }

        this.input.setAttribute('min', 0);
        this.input.setAttribute('max', 1);
        this.input.setAttribute('step', 0.1);
        this.input.value = 1;

        this.input.addEventListener('change', () => {
            this.setAttribute('opacity', this.input.value);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tool.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-enable', 'opacity'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'opacity' && newValue != oldValue) {

            const event = new CustomEvent('opacityChanged', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
        }

        if (name == 'is-enable' && oldValue !== null && newValue !== null && newValue !== oldValue) {
            this.render();
        }
    }
}

customElements.define('app-opacity-slider', OpacitySlider);