export class PathDrawer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.data = JSON.parse(this.getAttribute('data'));
        this.titleText.innerText = this.data.name;
        
        this.features = this.data.features;
        this.features.forEach(feature => {
            
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" class="close-icon">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
            <div>
                <h2></h2>
            </div>
            `
        ;

        this.setAttribute('is-active', 'false');
        
        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.titleText = this.shadow.querySelector('h2');
        this.div = this.shadow.querySelector('div');

        // js
        this.closeIcon.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('closeNavigation'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-drawer.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-active', 'data'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'is-active') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
            }

            if (name == 'data') this.render();
        }
    }
}

customElements.define('app-path-drawer', PathDrawer);