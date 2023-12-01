export class EmptyPathDrawerMsg extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <img src="/images/undraw_my_current_location_re_whmt.svg" alt="Nessuna location">
                <h2>Ops!</h2>
                <p>Cerca dei punti di interesse ed aggiungili alla lista per iniziare il tuo percorso personalizzato.</p>
                <button>Aggiungi</button>
            </div>
            `
            ;

        this.button = this.shadow.querySelector('button');

        // js
        this.button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('empty'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/empty-path-drawer-msg.css');
        this.shadow.append(style);
    }
}

customElements.define('app-empty-msg', EmptyPathDrawerMsg);