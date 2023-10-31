export class Button extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        if (JSON.parse(this.getAttribute('tags')).length === 0) {
            this.btn.disabled = true;
        } else {
            this.btn.disabled = false;
        }
    }

    connectedCallback() {
        this.shadow.innerHTML =
            `
            <button type="submit">Submit</button>
            `
        ;

        this.btn = this.shadow.querySelector('button');

        if (!this.hasAttribute('tags')) {
            this.btn.disabled = true;    
        }
        
        this.btn.addEventListener('click', () => {
            localStorage.setItem('selectedTags', this.getAttribute('tags'));
            window.open('/', '_blank');
        });
    }

    static observedAttributes = ['tags'];
    attributeChangedCallback(name, oldValue, newValue) {

        if (name == 'tags' && newValue != oldValue) {
            this.render();
        }

    }
}

customElements.define('app-btn', Button);