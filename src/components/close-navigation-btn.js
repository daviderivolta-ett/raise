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
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M516-120 402-402 120-516v-56l195-73-203-203 57-57 736 736-57 57-203-203-73 195h-56Zm191-361-63-63 60-160-160 60-63-63 359-133-133 359ZM542-268l41-109-206-206-109 41 196 78 78 196Zm52-326ZM480-480Z"/>
            </svg>
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