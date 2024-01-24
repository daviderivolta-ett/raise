export class GoToBtn extends HTMLElement {
    _coordinates;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get coordinates() {
        return this._coordinates;
    }

    set coordinates(coordinates) {
        this._coordinates = coordinates;
    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="material-symbols-outlined">directions</span>
            <span class="label">Indicazioni</span>
            `
            ;

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('go-to', { detail: { coordinates: this.coordinates } }));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/goto-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-goto', GoToBtn);