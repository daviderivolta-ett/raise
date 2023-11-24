export class PathInfobox extends HTMLElement {
    static counter = 0;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        PathInfobox.counter++;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="wrapper">
                <div class="info">
                    <app-play-info-btn></app-play-info-btn>
                    <app-goto></app-goto>
                </div>
                <div class="content"></div>
            </div>
            `
        ;

        this.data = JSON.parse(this.getAttribute('data'));
        this.content = this.shadow.querySelector('.content');
        this.info = this.shadow.querySelector('.info');
        this.playBtn = this.shadow.querySelector('app-play-info-btn');

        const p = document.createElement('p');
        p.innerText = PathInfobox.counter;
        this.info.insertBefore(p, this.playBtn);

        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                const value = this.data[key];
                const p = document.createElement('p');
                p.innerText = value;
                this.content.append(p);
            }
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-infobox.css');
        this.shadow.append(style);
    }

    static observedAttributes = [];
    attributeChangedCallback(name, newValue, oldValue) {

    }

    disconnectedCallback() {
        PathInfobox.counter = 0;
    }
}

customElements.define('app-path-infobox', PathInfobox);