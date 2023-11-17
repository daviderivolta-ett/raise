export class Drawer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
    }

    connectedCallabck() {
        this.json = this.getAttribute('data');
    }

    static observedAttributes = ['data'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'data') {
            console.log(JSON.parse(newValue));   
        }
    }
}

customElements.define('app-drawer', Drawer);