export class Loader extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() { }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <p></p>
            </div>
            `
        ;

        if (!this.hasAttribute('is-loading')) this.setAttribute('is-loading', 'false');
        if (!this.hasAttribute('text')) this.setAttribute('text', '');

        this.text = this.shadow.querySelector('p');        
        
        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/loader.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-loading', 'text'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && newValue != null && oldValue != null) {

            if (name == 'is-loading') {
                this.classList.toggle('loading', newValue === 'true');
            }

            if (name == 'text') {
                this.text.innerHTML = newValue;
            }
        }
    }

}

customElements.define('app-loader', Loader);