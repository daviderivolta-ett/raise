export class Accordion extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.accordionTitle = this.shadow.querySelector('.accordion-title');

        if (this.accordionTitle) {
            this.accordionTitle.textContent = this.title;
        }

        this.accordionContent = this.shadow.querySelector('.accordion-content');
        if (this.accordionContent) {
            if (this.getAttribute('is-active') === 'true') {
                this.accordionContent.classList.add('accordion-show');
            } else {
                this.accordionContent.classList.remove('accordion-show');
            }
        }
    }

    connectedCallback() {
        //html
        this.setAttribute('is-active', 'false');

        this.shadow.innerHTML =
            `
            <div class="accordion-item">
                <button type="button" class="accordion-btn">
                    <span class="accordion-title"></span><span class="accordion-icon"></span>
                </button>
                <div class="accordion-content">
                    <slot></slot>
                </div>
            </div>
            `
            ;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'src/components/accordion/accordion.css');
        this.shadow.append(style);

        //js
        this.accordionBtn = this.shadow.querySelector('.accordion-btn');
        this.accordionBtn.addEventListener('click', () => {
            this.accordionContent = this.accordionBtn.nextElementSibling;


            if (this.getAttribute('is-active') === 'true') {
                this.setAttribute('is-active', 'false');
            } else {
                this.setAttribute('is-active', 'true');
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
    }

    static observedAttributes = ['title', 'is-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'title' && newValue != oldValue) {
            this.render();
        }

        if (name == 'is-active' && newValue != oldValue) {
            this.render();
        }
    }
}

customElements.define('app-accordion', Accordion);