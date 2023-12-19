export class SubmitTagsButton extends HTMLElement {
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
        // html
        this.shadow.innerHTML =
            `
            <button type="submit">Submit</button>
            `
        ;

        this.btn = this.shadow.querySelector('button');

        // js
        if (!this.hasAttribute('tags')) {
            this.btn.disabled = true;    
        }
        
        this.btn.addEventListener('click', () => {
            localStorage.setItem('selectedTags', this.getAttribute('tags'));
            window.location.href = '/#/map';
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/primary-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['tags'];
    attributeChangedCallback(name, oldValue, newValue) {

        if (name == 'tags' && newValue != oldValue) {
            this.render();
        }

    }
}

customElements.define('app-submit-tags-btn', SubmitTagsButton);