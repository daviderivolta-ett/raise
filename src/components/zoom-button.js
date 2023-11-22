export class ZoomBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        
        switch (this.getAttribute('zoom-type')) {
            case "in":
                this.button.innerHTML =
                    `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                    </svg>
                    `
                ;
                break;

            case "out":
                this.button.innerHTML =
                    `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24">
                        <path d="M200-440v-80h560v80H200Z"/>
                    </svg>
                    `
                ;
                break;
        
            default:
                break;
        }

        this.shadow.append(this.button);

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/zoom-button.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback() {}
}

customElements.define('app-zoom-btn', ZoomBtn);