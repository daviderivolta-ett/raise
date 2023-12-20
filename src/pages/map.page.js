import { SettingService } from '../services/SettingService.js';
import { UserPositionService } from '../services/UserPositionService.js';

export class PageMap extends HTMLElement {
    _data;
    _position;

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

    get position() {
        return this._position;
    }

    set position(position) {
        this._position = position;
    }

    async connectedCallback() {
        // services
        this.data = await SettingService.instance.getData();

        let p = await UserPositionService.instance.getPosition();
        this.position = {};
        this.position.latitude = p.coords.latitude;
        this.position.longitude = p.coords.longitude;

        // html
        this.shadow.innerHTML =
            `
            <app-cesium></app-cesium>
            <div class="header">
                <div class="search">
                    <div class="upper-search">
                        <app-drawer-toggle></app-drawer-toggle>
                        <app-searchbar></app-searchbar>
                        <div class="divider"><span class="vr"></span></div>       
                        <app-link icon='tag' link ="/"></app-link>
                    </div>
                    <div class="lower-search">
                        <app-autocomplete></app-autocomplete>
                    </div>
                </div>
            </div>
            <app-search-result></app-search-result>
            `
        ;

        /** @type {CesiumViewer} */
        this.map = this.shadow.querySelector('app-cesium');

        // js
        this.map.setCameraToPosition(this.position);
        this.map.createUserPin(this.position);

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/map.page.css');
        this.shadow.append(style);
    }
}

customElements.define('app-map', PageMap);