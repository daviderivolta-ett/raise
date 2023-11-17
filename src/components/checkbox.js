export class Checkbox extends HTMLElement {

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
            <div class="checkbox">
                <input type="checkbox" id="checkbox">
                <div class="legend"></div>
                <label for="checkbox">Label</label>
            </div>                      
            `
            ;

        this.checkbox = this.shadow.querySelector('input');

        // checkbox
        if (this.hasAttribute('is-checked') && this.getAttribute('is-checked') == 'true') {
            this.setAttribute('is-checked', this.getAttribute('is-checked'));
            this.checkbox.checked = true;
        } else {
            this.setAttribute('is-checked', 'false');
            this.checkbox.checked = false;
        }

        this.label = this.shadow.querySelector('label');
        if (this.hasAttribute('data')) {
            this.label.innerHTML = JSON.parse(this.getAttribute('data')).name;
        }

        // legend
        this.legend = this.shadow.querySelector('.legend');
        const color = JSON.parse(this.getAttribute('data')).style.color;
        this.legend.style.backgroundColor = color;

        // components
        const components = JSON.parse(this.getAttribute('data')).components;
        if (components != undefined && components.length != 0) {
            this.details = document.createElement('details');
            this.details.innerHTML =
                `
                <summary>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>                
                </summary>
                `
                ;

            for (const component of components) {
                this.component = document.createElement(`${component}`);

                if (component == 'app-opacity-slider') {
                    this.opacity = JSON.parse(this.getAttribute('data')).style.opacity;
                    this.component.setAttribute('opacity', this.opacity);

                    this.component.addEventListener('opacityChanged', (event) => {
                        const data = JSON.parse(this.getAttribute('data'));
                        data.style.opacity = event.detail.newValue;
                        this.setAttribute('data', JSON.stringify(data));
                    });
                }

                if (component == 'app-navigation-btn') {
                    this.component.addEventListener('routeTriggered', () => {

                        const layer = JSON.parse(this.getAttribute('data')).layer;
                        const url = JSON.parse(this.getAttribute('data')).layer_url_wfs;

                        const event = new CustomEvent('routeTriggered', {
                            detail: { layer: layer, url: url }
                        });

                        this.dispatchEvent(event);
                    });
                }
                this.details.append(this.component);
            }

            this.shadow.append(this.details);
            this.setAttribute('is-details-open', 'false');
        }

        // js
        this.checkbox.addEventListener('click', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('is-checked', isChecked + '');

            const layer = JSON.parse(this.getAttribute('data'));
            const click = new CustomEvent('checkboxClicked', { detail: { layer } });
            this.dispatchEvent(click);
        });

        if (this.details) {
            this.details.addEventListener('toggle', (event) => {
                if (event.target.open) {
                    this.setAttribute('is-details-open', 'true');
                } else {
                    this.setAttribute('is-details-open', 'false');
                }
            });
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/checkbox.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-checked', 'data', 'is-details-open', 'is-route-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue && oldValue !== null && newValue !== null) {

            if (name == 'data' && newValue !== oldValue) {
                const event = new CustomEvent('opacityChanged', { detail: { name, oldValue, newValue } });
                this.dispatchEvent(event);
            }

            if (name == 'is-checked') {
                newValue == 'true' ? this.checkbox.checked = true : this.checkbox.checked = false;

                this.toolOpacity = this.shadow.querySelector('app-opacity-slider');
                this.toolOpacity ? this.toolOpacity.setAttribute('is-enable', newValue) : '';

                this.toolRoute = this.shadow.querySelector('app-navigation-btn');
                this.toolRoute ? this.toolRoute.setAttribute('is-enable', newValue) : '';
            }

            if (name == 'is-details-open') {
                const event = new CustomEvent('detailStatusChanged', { detail: { name, oldValue, newValue } });
                this.dispatchEvent(event);

                if (this.getAttribute('is-details-open') == 'true') {
                    this.details.setAttribute('open', '')
                } else {
                    this.details.removeAttribute('open');
                }
            }
        }
    }
}

customElements.define('app-checkbox', Checkbox);