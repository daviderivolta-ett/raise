export class CheckboxList extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
    }

    connectedCallback() {
        document.addEventListener('DOMContentLoaded', () => {

            if (!this.hasAttribute('input')) return;

            // html
            this.input = JSON.parse(this.getAttribute('input'));
            this.data = [];

            const checkboxes = [];

            for (let i = 0; i < this.input.length; i++) {
                this.checkbox = document.createElement('app-checkbox');
                this.checkbox.setAttribute('is-checked', 'false');
                this.checkbox.setAttribute('data', JSON.stringify(this.input[i]));

                checkboxes.push(this.checkbox);

                this.shadow.append(this.checkbox);
            }

            // js
            checkboxes.forEach(item => {
                item.addEventListener('checkboxChanged', () => {
                    this.itemData = JSON.parse(item.getAttribute('data'));

                    const isPresentIndex = this.data.findIndex(obj => {
                        return JSON.stringify(obj) === JSON.stringify(this.itemData);
                    });

                    if (isPresentIndex !== -1) {
                        this.data.splice(isPresentIndex, 1);
                    } else {
                        this.data.push(this.itemData);
                    }

                    this.setAttribute('data', JSON.stringify(this.data));
                });
            });
        });
    }

    static observedAttributes = ['data'];
    attributeChangedCallback(name, oldValue, newValue) {
        const event = new CustomEvent('checkboxListChanged', {
            detail: { name: 'data', oldValue, newValue, input: this.input }
        });


        if (newValue != oldValue) {
            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-checkbox-list', CheckboxList);