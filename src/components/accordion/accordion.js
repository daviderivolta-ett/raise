export class Accordion extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.accordionTitle.textContent = this.title;

        this.accordionContent = this.shadow.querySelector('.accordion-content');

        if (this.getAttribute('is-active') === 'true') {
            this.accordionContent.classList.add('accordion-show');
        } else {
            this.accordionContent.classList.remove('accordion-show');
        }
    }

    connectedCallback() {
        //html
        this.setAttribute('is-active', 'false');

        this.shadow.innerHTML =
            `
            <div class="accordion-item">
                <button type="button" class="accordion-btn">
                    <span class="accordion-title">${this.getAttribute('title')}</span><span class="accordion-icon"></span>
                </button>
                <div class="accordion-content">
                    <slot></slot>
                </div>
            </div>
            `
        ;

        this.accordionTitle = this.shadow.querySelector('.accordion-title');

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
                // this.accordionContent.classList.add('accordion-show');
            } else {
                this.setAttribute('is-active', 'true');
                // this.accordionContent.classList.remove('accordion-show');
            }
        });
    }

    static observedAttributes = ['title', 'is-active'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'title' && newValue != oldValue) {
            this.render();
        }

        if (name == 'is-active' && newValue != oldValue) {
            const event = new CustomEvent('accordionChanged', {
                detail: { name, oldValue, newValue }
            });

            this.render();
            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-accordion', Accordion);