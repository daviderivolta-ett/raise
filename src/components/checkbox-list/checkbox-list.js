export class CheckboxList extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "closed" });
    }

    render() {

    }

    connectedCallback() {        
        document.addEventListener('DOMContentLoaded', event => {

            if (!this.hasAttribute('data')) return;

            // html
            this.array = JSON.parse(this.getAttribute('data'));

            const checkboxes = [];

            for (let i = 0; i < this.array.length; i++) {
                this.checkbox = document.createElement('app-checkbox');
                this.checkbox.setAttribute('is-checked', 'true');
                this.checkbox.setAttribute('data', JSON.stringify(this.array[i]));

                checkboxes.push(this.checkbox);

                this.shadow.append(this.checkbox);
            }

            // js
            checkboxes.forEach(item => {
                item.addEventListener('checkboxChanged', (event) => {
                    this.itemData = JSON.parse(item.getAttribute('data'));

                    const isPresentIndex = this.array.findIndex(obj => {
                        return JSON.stringify(obj) === JSON.stringify(this.itemData);
                    });

                    if (isPresentIndex !== -1) {
                        this.array.splice(isPresentIndex, 1);
                    } else {
                        this.array.push(this.itemData);
                    }

                    this.setAttribute('data', JSON.stringify(this.array));
                });
            });
        });
    }

    static observedAttributes = ['data'];
    attributeChangedCallback(name, oldValue, newValue) {
        const event = new CustomEvent('checkboxListChanged', {
            detail: { name, oldValue, newValue }
        });

        if (newValue != oldValue) {
            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-checkbox-list', CheckboxList);