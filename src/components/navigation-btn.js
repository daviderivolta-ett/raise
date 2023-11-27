export class NavigationBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
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

        if (!this.hasAttribute('data')) this.setAttribute('data', '[]');

        // js
        this.button.addEventListener('click', () => {
            const data = JSON.parse(this.getAttribute('data'));
            this.dispatchEvent(new CustomEvent('activateNavigation', { detail: { data } }));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/navigation-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['data'];
    attributeChangedCallback(name, oldvalue, newValue) {
        if (newValue != oldvalue && oldvalue != null && newValue != null) {

            if (name == 'data') {
                if (newValue == '[]') { this.classList.remove('visible'); }
                else { this.classList.add('visible') }
            }

        }
    }
}

customElements.define('app-navigation', NavigationBtn);