export class Autocomplete extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        // Empty list
        this.tags = JSON.parse(this.getAttribute('data'));
        this.div.innerHTML = '';

        // Create list
        if (this.tags) {
            for (let i = 0; i < this.tags.length; i++) {
                this.span = document.createElement('span');
                this.span.textContent = this.tags[i];
                this.span.setAttribute('name', this.tags[i]);
                this.span.setAttribute('tabindex', i + 1);
                this.div.append(this.span);
            }
        }

        // List element behaviour on click
        this.spans = this.shadow.querySelectorAll('span');
        this.spans.forEach(span => {

            span.addEventListener('click', () => {
                this.setAttribute('selected', span.getAttribute('name'));
            });

        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div></div>
            `
            ;

        this.selectedSpan = 0;

        this.div = this.shadow.querySelector('div');
        this.setAttribute('selected', '');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', '../../../css/autocomplete.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['data', 'selected', 'last-key-pressed'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'data' && newValue != oldValue) {
            this.render();
        }

        if (name == 'selected' && newValue != oldValue) {
            const event = new CustomEvent('autocompleteSelected', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
            this.div.innerHTML = '';
        }

        if (name == 'last-key-pressed' && newValue != 'Enter' && newValue != 'ArrowDown' && newValue != 'ArrowUp') {
            this.selectedSpan = 0;
            this.render();
        }

        if (name == 'last-key-pressed' && newValue == 'ArrowUp' || newValue == 'ArrowDown') {

            if (newValue == 'ArrowDown') {
                this.selectedSpan++;
                if (this.selectedSpan == this.spans.length + 1) {
                    this.selectedSpan = 1;
                }

                this.shadow.querySelector(`span[tabindex="${this.selectedSpan}"]`).focus();
            }

            if (newValue == 'ArrowUp') {
                this.selectedSpan++;
                if (this.selectedSpan == this.spans.length + 1) {
                    this.selectedSpan = 1;
                }

                this.shadow.querySelector(`span[tabindex="${this.selectedSpan}"]`).focus();
            }
        }

        if (name == 'last-key-pressed' && newValue == 'Enter') {
            this.setAttribute('selected', this.shadow.activeElement.getAttribute('name'));
            this.div.innerHTML = '';
        }
    }
}

customElements.define('app-autocomplete', Autocomplete);