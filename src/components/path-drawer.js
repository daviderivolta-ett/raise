export class PathDrawer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.data = JSON.parse(this.getAttribute('data'));
        console.log(this.data);
        this.titleText.innerText = this.data.name;
        
        this.div.innerHTML = '';

        this.features = this.data.features;

        for (let i = 0; i < this.features.length; i++) {
            const feature = this.features[i];
            const infobox = document.createElement('app-path-infobox');
            const properties = feature.properties;
            infobox.setAttribute('data', JSON.stringify(properties));
            if(i == this.features.length - 1) infobox.classList.add('last');
            this.div.append(infobox);
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="path-drawer-header">
                <span class="material-symbols-outlined close-icon">close</span>
                <h2></h2>
            </div>
            <div class="info-container"></div>
            `
        ;

        this.setAttribute('is-active', 'false');
        
        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.titleText = this.shadow.querySelector('h2');
        this.div = this.shadow.querySelector('.info-container');

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