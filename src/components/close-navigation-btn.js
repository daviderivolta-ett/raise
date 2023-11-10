export class CloseNavigationBtn extends HTMLElement {
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
            <div class="close-navigation-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-slash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/>
                </svg>
            </div>
            `
        ;

        if (!this.hasAttribute('is-active')) {
            this.setAttribute('is-active', false);
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/close-navigation-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'is-active' && oldValue != null && newValue != null && newValue != oldValue) {
            this.classList.toggle('show');
        }
    }
}

customElements.define('app-close-navigation-btn', CloseNavigationBtn);