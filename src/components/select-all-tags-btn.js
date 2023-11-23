export class SelectAllTagsBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.btn = document.createElement('button');
        this.btn.innerText = 'Select all';
        this.shadow.append(this.btn);

        // js
        this.btn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('selectAllTags'));
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/secondary-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-select-all-tags-btn', SelectAllTagsBtn);