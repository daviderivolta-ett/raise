export class Dropdown extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        
    }
}

customElements.define('app-dropdown', Dropdown);