export class Radio extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <input type="radio" name="choosen-map" id="acquedotto" value="acquedotto" checked>
                <label for="acquedotto">Acquedotto di genova</label>
            </div>
            <div>
                <input type="radio" name="choosen-map" id="ciclabile" value="ciclabile">
                <label for="ciclabile">Piste ciclabili</label>
            </div>
            `
        ;

        this.setAttribute('selected-map', 'acquedotto');

        // js
        this.radios = this.shadow.querySelectorAll('input');
        this.radios.forEach(item => {
            item.addEventListener('change', event => {
                this.setAttribute('selected-map', item.getAttribute('value'));
            })
        });
    }

    static observedAttributes = ['selected-map'];
    attributeChangedCallback(name, oldValue, newvalue) {
        const event = new CustomEvent('selectedMapChanged', {
            detail: {name, oldValue, newvalue}
        });

        if (newvalue != oldValue) {
            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-radio', Radio);