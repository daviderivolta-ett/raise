export class CheckboxList extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        this.shadow.innerHTML = '';
        // html
        this.input = JSON.parse(this.getAttribute('input'));
        this.array = [...this.input];
        this.setAttribute('data', JSON.stringify(this.array));

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
    }

    connectedCallback() {
        document.addEventListener('DOMContentLoaded', () => {

            if (!this.hasAttribute('input')) return;

            // html
            this.input = JSON.parse(this.getAttribute('input'));
            this.array = [...this.input];
            this.setAttribute('data', JSON.stringify(this.array));

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

    static observedAttributes = ['data', 'input'];
    attributeChangedCallback(name, oldValue, newValue) {
        const event = new CustomEvent('checkboxListChanged', {
            detail: { name, oldValue, newValue }
        });

        if (oldValue == null) return;

        if (newValue != oldValue && name == 'data') {
            this.dispatchEvent(event);
        }

        if (newValue != oldValue && name == 'input') {
            this.render();
        }
    }
}

customElements.define('app-checkbox-list', CheckboxList);