export class CheckboxList extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
    }

    connectedCallback() {
        this.shadow.innerHTML =
            `
            <div></div>
            `
            ;

        this.div = this.shadow.querySelector('div');
        this.setAttribute('all-active', 'false');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/checkbox-list.css');
        this.shadow.append(style);


        if (!this.hasAttribute('input')) return;

        // html
        this.input = JSON.parse(this.getAttribute('input'));
        this.data = [];

        this.checkboxes = [];

        for (let i = 0; i < this.input.length; i++) {
            this.checkbox = document.createElement('app-checkbox');
            this.checkbox.setAttribute('is-checked', 'false');
            this.checkbox.setAttribute('data', JSON.stringify(this.input[i]));

            this.checkboxes.push(this.checkbox);

            this.div.append(this.checkbox);
        }

        // js
        this.checkboxes.forEach(item => {

            item.addEventListener('checkboxChanged', () => {
                this.itemData = JSON.parse(item.getAttribute('data'));

                const isPresentIndex = this.data.findIndex(obj => {
                    return obj.layer === this.itemData.layer;
                });

                if (isPresentIndex !== -1) {
                    this.data.splice(isPresentIndex, 1);
                } else {
                    this.data.push(this.itemData);
                }

                this.setAttribute('data', JSON.stringify(this.data));

                // if (this.checkboxes.length === JSON.parse(this.getAttribute('data')).length) {
                //     this.setAttribute('all-active', 'true');
                // } else {
                //     this.setAttribute('all-active', 'false');
                // }
            });

            item.addEventListener('opacityChanged', (event) => {
                this.itemData = JSON.parse(item.getAttribute('data'));
                this.itemData.opacity = event.detail.newValue;

                const isPresentIndex = this.data.findIndex(obj => {
                    return obj.layer === this.itemData.layer;
                });

                if (isPresentIndex !== -1) {
                    this.data.splice(isPresentIndex, 1);
                    this.data.push(this.itemData);
                } else {
                    this.data.push(this.itemData);
                }

                this.setAttribute('data', JSON.stringify(this.data));
            });

            item.addEventListener('detailStatusChanged', (event) => {
                if (event.detail.newValue == 'true') {
                    this.checkboxes.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.setAttribute('is-details-open', 'false');
                        }
                    });
                }
            })

        });
    }

    static observedAttributes = ['data', 'all-active'];
    attributeChangedCallback(name, oldValue, newValue) {

        if (name == 'data' && newValue != oldValue) {
            const event = new CustomEvent('checkboxListChanged', {
                detail: {
                    name: 'data',
                    oldValue: oldValue,
                    newValue: newValue,
                    input: this.input
                }
            });

            this.dispatchEvent(event);
        }

        if (name == 'all-active' && oldValue != null && newValue != null && newValue != oldValue) {
            this.checkboxes.forEach(item => {
                item.setAttribute('is-checked', this.getAttribute('all-active'));
            })
        }
    }
}

customElements.define('app-checkbox-list', CheckboxList);