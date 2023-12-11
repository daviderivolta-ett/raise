export class CheckboxNew extends HTMLElement {
    _data;
    _output;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    set data(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    set output(output) {
        this._output = output;
        const isChecked = JSON.parse(this.getAttribute('is-checked'));
        this.dispatchEvent(new CustomEvent('checkboxToggled', {
            detail: { layerToAdd: this.output, isChecked }
        }));
    }

    get output() {
        return this._output;
    }

    render() {
        const isOpen = this.getAttribute('is-open');
        isOpen == 'true' ? this.details.setAttribute('open', '') : this.details.removeAttribute('open');

        const isChecked = this.getAttribute('is-checked');
        isChecked == 'true' ? this.checkbox.checked = true : this.checkbox.checked = false;
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
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
            this.setAttribute('is-checked', 'false');
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
                    <span class="material-symbols-outlined">keyboard_arrow_down</span>              
                </summary>
                `
            ;

            for (const component of this.components) {
                this.component = document.createElement(`${component}`);

                if (component == 'app-opacity-slider') {
                    this.opacity = this.data.style.opacity;
                    this.component.setAttribute('opacity', this.opacity);
                    this.component.setAttribute('is-enabled', 'false');

                    this.component.addEventListener('opacityChanged', (event) => {
                        this._data.style.opacity = event.detail.opacity;
                        this.output = this.data;
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
            const isChecked = event.target.checked;
            this.setAttribute('is-checked', isChecked);
            this.output = this.data;
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
                this.toolOpacity ? this.toolOpacity.setAttribute('is-enabled', newValue) : '';

                this.toolRoute = this.shadow.querySelector('app-navigation-btn');
                this.toolRoute ? this.toolRoute.setAttribute('is-enabled', newValue) : '';

                this.render();
            }

            if (name == 'is-open') {
                this.dispatchEvent(new CustomEvent('detailsToggled', {
                    detail: { isOpen: newValue }
                }));
                this.render();
            }

        }
    }

}

customElements.define('app-checkbox-new', CheckboxNew);