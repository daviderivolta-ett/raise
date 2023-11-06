export class NavigationBtn extends HTMLElement {
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
                <label>Crea percorso</label>
                <input type="checkbox">
            </div>
            `
        ;
    }

    static observedAttributes = [];
    attributeChangedCallback() {

    }
}

customElements.define('app-navigation-btn', NavigationBtn);