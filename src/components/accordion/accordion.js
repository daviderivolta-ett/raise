// import componentCss from '/public/css/accordion.css?raw';

export class Accordion extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        // Checkbox
        this.slots.forEach(slot => {
            const assignedNodes = slot.assignedNodes();
            assignedNodes.forEach(node => {
                if (node.nodeName === 'APP-ACCORDION' || node.tagName === 'APP-ACCORDION') {
                    node.setAttribute('all-active', this.getAttribute('all-active'));
                }

                if (node.nodeName === 'APP-CHECKBOX-LIST' || node.tagName === 'APP-CHECKBOX-LIST') {
                    node.setAttribute('all-active', this.getAttribute('all-active'));
                }
            });
        });

        if (this.getAttribute('all-active') == 'true') {
            this.checkbox.checked = true;
        } else {
            this.checkbox.checked = false;
        }
    }

    connectedCallback() {
        //html
        this.setAttribute('is-active', 'false');
        this.setAttribute('all-active', 'false');

        this.shadow.innerHTML = `
            
            <div class="accordion-item">

                <div class="accordion-checkbox">
                <input type="checkbox"></input>                

                <button type="button" class="accordion-btn">
                    <span class="accordion-title"></span>
                    <span class="accordion-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </span>
                </button>

                </div>

                <div class="accordion-content">
                    <slot></slot>
                </div>
            </div>
            `
            ;

        this.accordionTitle = this.shadow.querySelector('.accordion-title');

        if (this.accordionTitle) {
            this.accordionTitle.textContent = this.title;
        }

        this.accordionContent = this.shadow.querySelector('.accordion-content');
        this.accordionIcon = this.shadow.querySelector('.accordion-icon');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/accordion.css');
        this.shadow.append(style);

        //js
        // accordion
        this.accordionBtn = this.shadow.querySelector('.accordion-btn');
        this.accordionBtn.addEventListener('click', () => {
            this.accordionContent = this.shadow.querySelector('.accordion-content');

            if (this.getAttribute('is-active') === 'true') {
                this.setAttribute('is-active', 'false');
                this.accordionContent.classList.remove('accordion-show');
                this.accordionIcon.classList.remove('accordion-icon-active');
            } else {
                this.setAttribute('is-active', 'true');
                this.accordionContent.classList.add('accordion-show');
                this.accordionIcon.classList.add('accordion-icon-active');
            }

            const event = new CustomEvent('accordionChanged', {
                detail: {
                    name: 'is-active',
                    oldValue: this.getAttribute('is-active'),
                    newValue: this.getAttribute('is-active')
                }
            });

            this.dispatchEvent(event);
        });

        if (this.classList.contains('last-accordion')) {
            this.accordionContent.classList.add('last-accordion');
        }

        // checkbox
        this.checkbox = this.shadow.querySelector('input[type="checkbox"]');
        if (this.getAttribute('all-active') == 'true') {
            this.checkbox.checked = true;
        } else {
            this.checkbox.checked = false;
        }

        this.checkbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            this.setAttribute('all-active', isChecked + '');
        });

        // slot
        this.slots = this.shadow.querySelectorAll('slot');
    }

    static observedAttributes = ['is-active', 'all-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'is-active' && oldValue !== null && newValue !== null && newValue != oldValue) {

            if (this.getAttribute('is-active') === 'true') {
                this.accordionContent.classList.add('accordion-show');
                this.accordionIcon.classList.add('accordion-icon-active');

            } else {
                this.accordionContent.classList.remove('accordion-show');
                this.accordionIcon.classList.remove('accordion-icon-active');
            }
        }

        if (name == 'all-active' && oldValue !== null && newValue !== null && newValue != oldValue) {
            this.render();
        }
    }
}

customElements.define('app-accordion', Accordion);