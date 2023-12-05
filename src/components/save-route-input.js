export class SaveRouteInput extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        if (this.getAttribute('value')) {
            this.input.value = this.getAttribute('value');
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="container">
                <label for="title">
                    <span class="material-symbols-outlined">edit</span>
                </label>
                <input type="text" id="title">
            </div>
            `
        ;

        this.input = this.shadow.querySelector('input');
        if (!this.getAttribute('value')) this.setAttribute('value', 'Nuovo percorso');
        if (this.hasAttribute('value')) this.input.value = this.getAttribute('value');

        // js
        this.input.addEventListener('input', () => {
            this.setAttribute('value', this.input.value);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/save-route-input.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['value'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'value') {
                this.render();
            }

        }
    }
}

customElements.define('app-save-route-input', SaveRouteInput);