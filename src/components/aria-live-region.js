export class AriaLiveRegion extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div role="status" aria-live="assertive"></div>
            `
        ;

        if (!this.hasAttribute('text')) this.setAttribute('text', 'Ciao, sono un contenuto accessibile');
        this.div = this.shadow.querySelector('div');
        this.p = document.createElement('p');
        this.p.innerText = this.getAttribute('text');
        this.div.append(this.p);

        // css
        const style = document.createElement('style');
        style.textContent =
            `
            :host {
                position: fixed;
                bottom: 0;
                z-index: 9999;
                width: 100%;
                height: 40px;
                background-color: white;
            }
            `
        ;

        this.shadow.append(style);
    }
}

customElements.define('app-aria', AriaLiveRegion);