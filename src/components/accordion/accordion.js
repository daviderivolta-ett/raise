export class Accordion extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });        
    }

    render() {
        //html
        if (this.hasAttribute('title')) {
            this.title = this.getAttribute('title');
        } else {
            this.title = 'Titolo dell\'accordion';
        }

        this.shadow.innerHTML =
            `
            <div class="accordion-item">
                <button type="button" class="accordion-btn">
                    <span class="accordion-title">${this.title}</span><span class="accordion-icon"></span>
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
            this.accordionContent.classList.toggle('accordion-show');
        });
    }

    connectedCallback() {
    }

    static observedAttributes = ['title'];
    attributeChangedCallback(name, oldValue, NewValue) {
        if (NewValue != oldValue) {
            this.render();
        }
    }

}

customElements.define('app-accordion', Accordion);