export class NavigationBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.isNavigation = this.getAttribute('is-navigation');

        if (this.isNavigation == 'true') {
            this.icon.innerHTML = 'close';
            this.label.innerHTML = 'Chiudi navigazione';
        } else {
            this.icon.innerHTML = 'directions';
            this.label.innerHTML = 'Avvia percorso';
        }
    }

    connectedCallback() {
        if (!this.hasAttribute('features')) this.setAttribute('features', '[]');
        if (!this.hasAttribute('is-active')) this.setAttribute('is-active', 'false');
        if (!this.hasAttribute('is-navigation')) this.setAttribute('is-navigation', 'false');

        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `
            ;

        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="material-symbols-outlined">directions</span>
            <span class="label">Avvia percorso</span>
            `
            ;

        this.shadow.append(this.button);

        this.icon = this.shadow.querySelector('.material-symbols-outlined');
        this.label = this.shadow.querySelector('.label');

        // js
        this.button.addEventListener('click', () => {
            const isNavigation = JSON.parse(this.getAttribute('is-navigation'));
            this.setAttribute('is-navigation', !isNavigation + '');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/navigation-btn.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-active', 'is-navigation', 'features'];
    attributeChangedCallback(name, oldvalue, newValue) {
        if (newValue != oldvalue && oldvalue != null && newValue != null) {

            if (name == 'features') {
                newValue == '[]' ? this.setAttribute('is-active', 'false') : this.setAttribute('is-active', 'true');
            }

            if (name == 'is-active') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
            }

            if (name == 'is-navigation') {
                const features = JSON.parse(this.getAttribute('features'));
                this.dispatchEvent(new CustomEvent('activateNavigation', {
                    detail: { features, isNavigation: newValue }
                }));

                this.render();
            }

        }
    }
}

customElements.define('app-navigation', NavigationBtn);