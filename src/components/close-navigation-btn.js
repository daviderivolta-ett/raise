export class CloseNavigationBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">near_me_disabled</span>
            `
        ;

        this.shadow.append(this.button);

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
        if (oldValue != null && newValue != null && newValue != oldValue) {

            if (name == 'is-active') {
                newValue == 'true' ? this.classList.add('show') : this.classList.remove('show');
            }
            
        }
    }
}

customElements.define('app-close-navigation-btn', CloseNavigationBtn);