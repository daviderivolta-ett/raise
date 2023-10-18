export class Tool extends HTMLElement {
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
            <details>
                <summary>
                    Opacità
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>                
                </summary>

                <input type="${this.getAttribute('tool')}">
            </details>
            `
        ;

        this.setAttribute('is-enable', 'false');
        this.input = this.shadow.querySelector('input');

        if (this.getAttribute('is-enable') == 'false') {
            this.input.disabled = true;
        }

        // if range tool
        if (this.getAttribute('tool') == 'range') {
            this.input.setAttribute('min', 0);
            this.input.setAttribute('max', 1);
            this.input.setAttribute('step', 0.1);
            this.input.value = 1;

            this.input.addEventListener('change', () => {
                this.setAttribute('opacity', this.input.value);
            });
        }

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

customElements.define('app-tool', Tool);