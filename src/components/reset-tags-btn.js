export class ResetTagsButton extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.btn = document.createElement('button');
        this.btn.innerText = 'Reset';
        this.shadow.append(this.btn);

        // js
        this.btn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('resetTags'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/secondary-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-reset-tags-btn', ResetTagsButton);