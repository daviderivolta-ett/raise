export class Chip extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        if (this.getAttribute('is-selected') == 'true') {
            this.chip.classList.add('selected');
            this.checkbox.checked = true;
        } else {
            this.chip.classList.remove('selected');
            this.checkbox.checked = false;
        }
    }

    connectedCallback() {
        //html
        this.shadow.innerHTML =
            `
            <label for="chip">
                <input type="checkbox" id="chip">
                <span class="chip-title"></span>               
            </label>
            `
            ;

        this.chip = this.shadow.querySelector('label');
        this.span = this.shadow.querySelector('span');
        this.checkbox = this.shadow.querySelector('input');

        if (this.hasAttribute('tag')) {
            this.span.innerText = this.getAttribute('tag');
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/chip.css');
        this.shadow.append(style);

        // js
        this.checkbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('is-selected', isChecked + '');
        });
    }

    static observedAttributes = ['is-selected'];
    attributeChangedCallback(name, oldValue, newValue) {

        if (name == 'is-selected' && newValue != oldValue) {
            const event = new CustomEvent('chipChanged', {
                detail: { name, newValue, oldValue, tag: this.getAttribute('tag') }
            });

            this.dispatchEvent(event);
            this.render();
        }
    }
}

customElements.define('app-chip', Chip);