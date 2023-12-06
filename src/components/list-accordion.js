export class ListAccordion extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.isActive = this.getAttribute('is-active');
        if (this.isActive == 'true') {
            this.checkbox.checked = true;
            this.accordionContent.classList.add('accordion-show');
            this.accordionIcon.classList.add('accordion-icon-active');
        } else {
            this.checkbox.checked = false;
            this.accordionContent.classList.remove('accordion-show');
            this.accordionIcon.classList.remove('accordion-icon-active');
        }

        this.allActive = this.getAttribute('all-active');
        if (this.allActive == 'true') {
            this.checkbox.checked = true;
            this.list.setAttribute('all-active', 'true');
        } else {
            this.checkbox.checked = false;
            this.list.setAttribute('all-active', 'false');
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

        if (!this.hasAttribute('is-active')) this.setAttribute('is-active', 'false');
        if (!this.hasAttribute('all-active')) this.setAttribute('all-active', 'false');
        if (!this.hasAttribute('input')) return;
        this.setAttribute('data', '[]');

        this.input = JSON.parse(this.getAttribute('input'));
        this.checkbox = this.shadow.querySelector('input');
        this.accordionTitle = this.shadow.querySelector('.accordion-title');
        this.accordionContent = this.shadow.querySelector('.accordion-content');
        this.accordionIcon = this.shadow.querySelector('.accordion-icon');
        this.accordionBtn = this.shadow.querySelector('.accordion-btn');

        this.accordionTitle.textContent = this.input.name;

        this.list = document.createElement('app-checkbox-list');
        this.list.setAttribute('input', JSON.stringify(this.input.layers));
        this.accordionContent.append(this.list);

        // js
        this.accordionBtn.addEventListener('click', () => {
            const isActive = JSON.parse(this.getAttribute('is-active'));
            this.setAttribute('is-active', !isActive + '');
        });

        this.checkbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('all-active', isChecked + '');
        });

        this.list.addEventListener('checkboxListChanged', event => {
            this.setAttribute('data', event.detail.newValue);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/accordion.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-active', 'all-active', 'data'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null && newValue != null) {

            if (name == 'is-active') {
                this.dispatchEvent(new CustomEvent('accordionChanged', { detail: { newValue } }));
                this.render();
            }

            if (name == 'all-active') {
                this.render();
            }

            if (name == 'data') {
                this.dispatchEvent(new CustomEvent('checkboxListChanged', { detail: { newValue } }));
            }

        }
    }
}

customElements.define('app-list-accordion', ListAccordion);