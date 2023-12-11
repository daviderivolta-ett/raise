export class NavigationBtn extends HTMLElement {
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
            <span class="material-symbols-outlined">navigation</span>
            `
        ;

        this.shadow.append(this.button);

        if (!this.hasAttribute('is-enabled')) this.setAttribute('is-enabled', 'false');
        this.button.addEventListener('click', () => {
            const isEnabled = this.getAttribute('is-enabled');
            if (isEnabled == 'true') this.dispatchEvent(new CustomEvent('routeToggled'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/activate-navigation-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-enabled'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue && oldValue != null) {

            if (name == 'is-enabled') {

            }

        }
    }
}

customElements.define('app-navigation-btn', NavigationBtn);