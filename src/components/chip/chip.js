export class Chip extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
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
            if (newValue == 'true') {
                this.chip.classList.add('selected');
            } else {
                this.chip.classList.remove('selected');
            }
        }
    }
}

customElements.define('app-chip', Chip);