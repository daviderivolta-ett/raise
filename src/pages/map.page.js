import { SettingService } from '../services/SettingService.js';

export class PageMap extends HTMLElement {
    _data;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    async connectedCallback() {
        this.data = await SettingService.instance.getData();
        console.log(this.data);
        this.shadow.innerHTML =
            `
            <app-cesium></app-cesium>
            `
            ;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map.page.css');
        this.shadow.append(style);
    }
}

customElements.define('app-map', PageMap);