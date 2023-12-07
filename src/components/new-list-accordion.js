export class ListAccordionNew extends HTMLElement {
    _data;

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

        this.data.layers.forEach(layer => {
            const checkbox = document.createElement('app-checkbox-new');
            checkbox.data = layer;
            this.accordionContent.append(checkbox);
        });

        // js
        this.accordionBtn.addEventListener('click', () => {
            const isOpen = JSON.parse(this.getAttribute('is-open'));
            this.setAttribute('is-open', !isOpen + '');
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

customElements.define('app-list-accordion-new', ListAccordionNew);