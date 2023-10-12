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
            `
        ;

        this.checkbox = this.shadow.querySelector('input');

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

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'src/components/checkbox/checkbox.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-checked'];
    attributeChangedCallback(name, oldValue, newValue) {

        const event = new CustomEvent('checkboxChanged', {
            detail: { name, oldValue, newValue }
        });

        if (newValue != oldValue) {
            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-checkbox', Checkbox);