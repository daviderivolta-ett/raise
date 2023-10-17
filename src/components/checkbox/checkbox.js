export class Checkbox extends HTMLElement {

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
                <input type="checkbox" id="checkbox">
                <label for="checkbox">Label</label>
            </div>

            <details>
                <summary style="cursor: pointer">Opzioni</summary>
                <app-tool tool="range"></app-tool>
            </details>
            `
        ;

        this.checkbox = this.shadow.querySelector('input');
        this.tool = this.shadow.querySelector('app-tool');

        if (this.hasAttribute('is-checked')) {
            this.setAttribute('is-checked', this.getAttribute('is-checked'))
        } else {
            this.setAttribute('is-checked', 'false');
        }

        this.label = this.shadow.querySelector('label');
        if (this.hasAttribute('data')) {
            this.label.innerHTML = JSON.parse(this.getAttribute('data')).name;
        }

        // js
        this.checkbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('is-checked', isChecked + '');
        });

        this.tool.addEventListener('opacityChanged', (event) => {
            this.setAttribute('opacity', event.detail.newValue);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'src/components/checkbox/checkbox.css');
        this.shadow.append(style);

        this.render();
    }

    static observedAttributes = ['is-checked', 'opacity'];
    attributeChangedCallback(name, oldValue, newValue) {

        if (name == 'is-checked' && oldValue !== null && newValue !== null && newValue !== oldValue) {
            const event = new CustomEvent('checkboxChanged', {
                detail: { name, oldValue, newValue }
            });

            this.tool.setAttribute('is-enable', newValue);
            this.dispatchEvent(event);
        }

        if (name == 'opacity' && newValue !== oldValue) {
            const event = new CustomEvent('opacityChanged', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-checkbox', Checkbox);