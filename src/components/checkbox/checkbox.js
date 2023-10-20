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

        const components = JSON.parse(this.getAttribute('data')).components;
        if (components != undefined && components.length != 0) {
            this.details = document.createElement('details');
            this.details.innerHTML =
                `
                <summary>
                    Opzioni
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>                
                </summary>
                `
            ;

            for (const component of components) {
                this.details.innerHTML += `<${component}></${component}>`;
            }

            this.shadow.append(this.details);
        } 

        // js
        this.checkbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('is-checked', isChecked + '');
        });

        this.tool = this.shadow.querySelector('app-opacity-slider');
        if (this.tool) {
            this.tool.addEventListener('opacityChanged', (event) => {
                this.setAttribute('opacity', event.detail.newValue);
            });
        }        

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/checkbox.css');
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