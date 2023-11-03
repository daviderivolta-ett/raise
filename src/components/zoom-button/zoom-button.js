export class ZoomBtn extends HTMLElement {
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
            <div class="zoom-icon"></div>
            `
        ;

        this.div = this.shadow.querySelector('.zoom-icon');
        switch (this.getAttribute('zoom-type')) {
            case "in":
                this.div.innerHTML =
                    `
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    `
                ;
                break;

            case "out":
                this.div.innerHTML =
                    `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                    `
                ;
                break;
        
            default:
                break;
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/zoom-button.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback() {

    }
}

customElements.define('app-zoom-btn', ZoomBtn);