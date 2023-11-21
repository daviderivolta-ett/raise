export class CenterPositionBtn extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.button = document.createElement('button');
        this.button.innerHTML =
            `
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M452.424-81.694v-66.807q-123.885-12.231-207.788-96.135-83.904-83.903-96.135-207.788H81.694v-55.96h66.807q12.231-123.885 96.135-207.384 83.903-83.5 207.788-95.731v-66.807h55.96v66.807q123.885 12.231 207.384 95.731 83.5 83.499 95.731 207.384h66.807v55.96h-66.807q-12.231 123.885-95.731 207.788-83.499 83.904-207.384 96.135v66.807h-55.96Zm28.393-121.537q114.895 0 195.423-81.346 80.529-81.346 80.529-196.24 0-114.895-80.529-195.423-80.528-80.529-195.423-80.529-114.894 0-196.24 80.529-81.346 80.528-81.346 195.423 0 114.894 81.346 196.24t196.24 81.346ZM480-344.848q-56.225 0-95.689-39.463-39.463-39.464-39.463-95.689 0-56.225 39.463-95.689 39.464-39.463 95.689-39.463 56.225 0 95.689 39.463 39.463 39.464 39.463 95.689 0 56.225-39.463 95.689-39.464 39.463-95.689 39.463Z"/>
            </svg>
            `
            ;

        this.shadow.append(this.button);

        // js
        this.button.addEventListener('click', () => this.dispatchEvent(new CustomEvent('centerPosition')));

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/center-position-btn.css');
        this.shadow.append(style);
    }
}

customElements.define('app-center-position', CenterPositionBtn);