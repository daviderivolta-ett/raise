import { SuggestedRoutesService } from "../services/suggested-routes.service";

export class TabSuggestedRoutesComponent extends HTMLElement {
    _routes;
    _route;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    get routes() {
        return this._routes;
    }

    set routes(routes) {
        this._routes = routes;
    }

    async connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
            </div>
            `
            ;
    }


}

customElements.define('app-tab-suggested-routes', TabSuggestedRoutesComponent);