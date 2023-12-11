export class ListAccordionNew extends HTMLElement {
    _data;
    _output;
    _input;

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
        this.dispatchEvent(new CustomEvent('newOutput', {
            detail: { layersToAdd: this.output.layersToAdd, layersToRemove: this.output.layersToRemove }
        }));
        this._output.layersToAdd = [];
        this._output.layersToRemove = [];
    }

    get output() {
        return this._output;
    }

    set input(input) {
        this._input = input;

        this.checkboxes.forEach(checkbox => {
            if (this.input.length != []) {
                this.input.forEach(inputLayer => {
                    if (checkbox.data.layer == inputLayer.layer) {
                        checkbox.setAttribute('is-checked', 'true');
                    }
                });
            } else {
                checkbox.setAttribute('is-checked', 'false');
            }
        });
    }

    get input() {
        return this._input;
    }

    render() {
        const isOpen = this.getAttribute('is-open');
        if (isOpen == 'true') {
            this.accordionContent.classList.add('accordion-show');
            this.accordionIcon.classList.add('accordion-icon-active');
        } else {
            this.accordionContent.classList.remove('accordion-show');
            this.accordionIcon.classList.remove('accordion-icon-active');
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="accordion-item">
                <div class="accordion-checkbox">
                    <input type="checkbox">
                    <button type="button" class="accordion-btn">
                        <span class="accordion-title"></span>
                        <span class="accordion-icon">
                            <span class="material-symbols-outlined">keyboard_arrow_down</span>
                        </span>
                    </button>
                </div>
                <div class="accordion-content"></div>
            </div>
            `
            ;

        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', 'false');
        if (!this.hasAttribute('all-checked')) this.setAttribute('all-checked', 'false');

        this.checkbox = this.shadow.querySelector('input');
        this.accordionTitle = this.shadow.querySelector('.accordion-title');
        this.accordionContent = this.shadow.querySelector('.accordion-content');
        this.accordionIcon = this.shadow.querySelector('.accordion-icon');
        this.accordionBtn = this.shadow.querySelector('.accordion-btn');

        this.accordionTitle.textContent = this.data.name;

        this.data.layers.forEach(layer => {
            const checkbox = document.createElement('app-checkbox-new');
            checkbox.data = layer;
            this.accordionContent.append(checkbox);
        });

        this.checkboxes = this.shadow.querySelectorAll('app-checkbox-new');

        // js
        this.accordionBtn.addEventListener('click', () => {
            const isOpen = JSON.parse(this.getAttribute('is-open'));
            this.setAttribute('is-open', !isOpen + '');
        });

        this.checkbox.addEventListener('click', () => {
            let allChecked = JSON.parse(this.getAttribute('all-checked'));
            allChecked = !allChecked;
            this.setAttribute('all-checked', allChecked + '');
            allChecked == true ? this.input = this.data.layers : this.input = [];
            if (this._output == undefined) {
                this._output = {};
                this._output.layersToAdd = [];
                this._output.layersToRemove = [];
            }
            if (allChecked == true) {
                this._output.layersToAdd = this.data.layers;
            } else {
                this._output.layersToRemove = this.data.layers;
            }
            this.output = this._output;
        });

        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('checkboxToggled', event => {
                const toggledLayer = event.detail.layerToAdd;
                const isChecked = event.detail.isChecked;
                if (this._output == undefined) {
                    this._output = {};
                    this._output.layersToAdd = [];
                    this._output.layersToRemove = [];
                }
                if (isChecked == true) {
                    this._output.layersToAdd.push(toggledLayer);
                } else {
                    this._output.layersToRemove.push(toggledLayer);
                }
                this.output = this._output;
            });
        });

        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('detailsToggled', event => {
                const isOpen = event.detail.isOpen;
                if (isOpen == 'true') {
                    this.checkboxes.forEach(checkbox => {
                        if (checkbox !== event.target) checkbox.setAttribute('is-open', 'false');
                    });
                }
            });
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/accordion.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'all-checked'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'is-open') {
                this.dispatchEvent(new CustomEvent('accordionToggled', {
                    detail: { isOpen: newValue }
                }));
                this.render();
            }

        }
    }
}

customElements.define('app-list-accordion-new', ListAccordionNew);