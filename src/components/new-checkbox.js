export class CheckboxNew extends HTMLElement {
    _data;
    _isChecked;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.isChecked = false;
    }

    set data(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    set isChecked(isChecked) {
        this._isChecked = isChecked;
    }

    get isChecked() {
        return this._isChecked;
    }

    render() {
        const isOpen = this.getAttribute('is-open');
        isOpen == 'true' ? this.details.setAttribute('open', '') : this.details.removeAttribute('open');
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
        this.legend = this.shadow.querySelector('.legend');
        this.label = this.shadow.querySelector('label');

        if (!this.hasAttribute('is-checked')) {
            this.setAttribute('is-checked', JSON.stringify(this.isChecked));
        }

        if (this.data) {
            this.label.textContent = this.data.name;
        }

        this.color = this.data.style.color;
        this.legend.style.backgroundColor = this.color;

        this.components = this.data.components;
        if (this.components != undefined && this.components != 0) {
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

            for (const component of this.components) {
                this.component = document.createElement(`${component}`);

                if (component == 'app-opacity-slider') {
                    this.opacity = this.data.style.opacity;
                    this.component.setAttribute('opacity', this.opacity);

                    this.component.addEventListener('opacityChanged', (event) => {
                        this.data.style.opacity = event.detail.newValue;
                        this.setAttribute('data', this.data);
                    });
                }

                if (component == 'app-navigation-btn') {
                    this.setAttribute('is-navigation-active', 'false');

                    this.component.addEventListener('routeTriggered', () => {
                        this.setAttribute('is-navigation-active', 'true');
                    });
                }

                this.details.append(this.component);
            }

            this.shadow.append(this.details);
            this.setAttribute('is-open', 'false');
        }

        // js
        this.checkbox.addEventListener('change', (event) => {
            this.isChecked = event.target.checked;
            this.setAttribute('is-checked', this.isChecked);
        });

        if (this.details) {
            this.details.addEventListener('toggle', (event) => {
                if (event.target.open) {
                    this.setAttribute('is-open', 'true');
                } else {
                    this.setAttribute('is-open', 'false');
                }
            });
        }

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/checkbox.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-checked', 'is-open'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'is-checked') {
                this.toolOpacity = this.shadow.querySelector('app-opacity-slider');
                this.toolOpacity ? this.toolOpacity.setAttribute('is-enable', newValue) : '';

                this.toolRoute = this.shadow.querySelector('app-navigation-btn');
                this.toolRoute ? this.toolRoute.setAttribute('is-enable', newValue) : '';
            }

            if (name == 'is-open') {
                this.render();
            }

        }
    }

}

customElements.define('app-checkbox-new', CheckboxNew);