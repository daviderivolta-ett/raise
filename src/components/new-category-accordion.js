export class CategoryAccordionNew extends HTMLElement {
    _data;
    _output
    _input

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

        this.accordions.forEach(accordion => {
            let activeLayers = [];
            for (let i = 0; i < this.input.length; i++) {
                const inputLayer = this.input[i];

                accordion.data.layers.forEach(layer => {
                    if (layer.layer == inputLayer.layer) {
                        activeLayers.push(inputLayer);
                    }
                });
            }

            accordion.input = activeLayers;

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

        this.checkbox = this.shadow.querySelector('input');
        this.accordionTitle = this.shadow.querySelector('.accordion-title');
        this.accordionContent = this.shadow.querySelector('.accordion-content');
        this.accordionIcon = this.shadow.querySelector('.accordion-icon');
        this.accordionBtn = this.shadow.querySelector('.accordion-btn');

        this.accordionTitle.textContent = this.data.name;

        this.data.groups.forEach(group => {
            const accordion = document.createElement('app-list-accordion-new');
            accordion.data = group;
            this.accordionContent.append(accordion);
        });

        this.accordions = this.shadow.querySelectorAll('app-list-accordion-new');

        // js
        this.accordionBtn.addEventListener('click', () => {
            const isOpen = JSON.parse(this.getAttribute('is-open'));
            this.setAttribute('is-open', !isOpen + '');
        });

        this.checkbox.addEventListener('click', () => {
            let allChecked = JSON.parse(this.getAttribute('all-checked'));
            allChecked = !allChecked;
            this.setAttribute('all-checked', allChecked + '');

            if (this.input == undefined) this._input = [];
            if (this._output == undefined) {
                this._output = {};
                this._output.layersToAdd = [];
                this._output.layersToRemove = [];
            }

            if (allChecked == true) {
                this.data.groups.forEach(group => {
                    group.layers.forEach(layer => {
                        this._input.push(layer)
                        this._output.layersToAdd.push(layer);
                    });
                });
            } else {
                this._input = [];
                this.data.groups.forEach(group => {
                    group.layers.forEach(layer => this._output.layersToRemove.push(layer));
                })
            }
            this.input = this._input;
            this.output = this._output;
        });

        this.accordions.forEach(accordion => {
            accordion.addEventListener('accordionToggled', event => {
                const isOpen = event.detail.isOpen;

                if (isOpen == 'true') {
                    this.accordions.forEach(accordion => {
                        if (accordion !== event.target) accordion.setAttribute('is-open', 'false');
                    });
                }
            });
        });

        this.accordions.forEach(accordion => {
            accordion.addEventListener('newOutput', event => {
                const layersToAdd = event.detail.layersToAdd;
                const layersToRemove = event.detail.layersToRemove;
                if (this.output == undefined) {
                    this._output = {};
                    this._output.layersToAdd = [];
                    this._output.layersToRemove = [];
                }
                layersToAdd.forEach(layer => this._output.layersToAdd.push(layer));
                layersToRemove.forEach(layer => this._output.layersToRemove.push(layer));
                this.output = this._output;
            });
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/accordion.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open'];
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

customElements.define('app-category-accordion-new', CategoryAccordionNew);