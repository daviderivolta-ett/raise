export class PlayInfoBtnComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <span class="material-symbols-outlined">play_circle</span>
            <span class="label">Ascolta</span>
            `
        ;

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('read-info'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/play-info-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-play-info-btn', PlayInfoBtnComponent);