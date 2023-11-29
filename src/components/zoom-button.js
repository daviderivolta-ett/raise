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
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="zoom-btns">
                <button class="zoom-in"><span class="material-symbols-outlined">add</span></button>
                <button class="zoom-out"><span class="material-symbols-outlined">remove</span></button>
            </div>
            `
        ;

        this.zoomIn = this.shadow.querySelector('.zoom-in');
        this.zoomOut = this.shadow.querySelector('.zoom-out');

        // this.button = document.createElement('button');
        
        // switch (this.getAttribute('zoom-type')) {
        //     case "in":
        //         this.button.innerHTML +=
        //             `
        //             <span class="material-symbols-outlined">add</span>
        //             `
        //         ;
        //         break;

        //     case "out":
        //         this.button.innerHTML +=
        //             `
        //             <span class="material-symbols-outlined">remove</span>
        //             `
        //         ;
        //         break;
        
        //     default:
        //         break;
        // }

        // this.shadow.append(this.button);

        // js
        this.zoomIn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('zoomIn'));
        });

        this.zoomOut.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('zoomOut'));
        });

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