export class CheckboxNew extends HTMLElement {
    _data;
    _output;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.opacityComponent;
        this.navigationComponent;
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
        isOpen == 'true' ? this.componentsDetails.classList.add('active') : this.componentsDetails.classList.remove('active');

        const isChecked = JSON.parse(this.getAttribute('is-checked'));
        this.checkbox.checked = isChecked;
        this.opacityComponent.setAttribute('is-enabled', isChecked + '');
        if (this.navigationComponent != undefined) this.navigationComponent.setAttribute('is-enabled', isChecked + '');
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
                <div class="checkbox">
                    <input type="checkbox" id="checkbox">
                    <div class="legend"></div>
                    <label for="checkbox">Label</label>
                </div>
                <div class="tools">
                    <div class="icon">
                        <span class="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>
                </div>
            </div>
            <div class="components"></div>
            `
            ;

        this.checkbox = this.shadow.querySelector('input');
        this.legend = this.shadow.querySelector('.legend');
        this.label = this.shadow.querySelector('label');
        this.tools = this.shadow.querySelector('.tools');
        this.icon = this.shadow.querySelector('.icon');
        this.componentsDetails = this.shadow.querySelector('.components');

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
            for (const component of this.components) {
                this.component = document.createElement(`${component}`);

                if (component == 'app-opacity-slider') {
                    this.opacity = this.data.style.opacity;
                    this.opacityComponent = this.component;
                    this.opacityComponent.setAttribute('opacity', this.opacity);
                    this.opacityComponent.setAttribute('is-enabled', 'false');

                    this.opacityComponent.addEventListener('opacityChanged', (event) => {
                        this._data.style.opacity = event.detail.opacity;
                        this.output = this.data;
                    });
                }

                if (component == 'app-navigation-btn') {
                    this.navigationComponent = this.component;
                    this.navigationComponent.setAttribute('is-enabled', 'false');
                    this.tools.insertBefore(this.navigationComponent, this.icon);

                    this.navigationComponent.addEventListener('routeToggled', () => {
                        this.dispatchEvent(new CustomEvent('routeToggled', {
                            detail: { layer: this.data }
                        }));
                    });
                    continue;
                }

                this.componentsDetails.append(this.component);
            }

            this.setAttribute('is-open', 'false');
        }

        // js
        this.checkbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('is-checked', isChecked);
            this.output = this.data;
        });

        this.icon.addEventListener('click', () => {
            const isOpen = JSON.parse(this.getAttribute('is-open'));
            this.setAttribute('is-open', !isOpen + '');
        });

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