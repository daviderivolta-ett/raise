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
        this.button.innerHTML = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />';
        
        switch (this.getAttribute('zoom-type')) {
            case "in":
                this.button.innerHTML +=
                    `
                    <span class="material-symbols-outlined">add</span>
                    `
                ;
                break;

            case "out":
                this.button.innerHTML +=
                    `
                    <span class="material-symbols-outlined">remove</span>
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