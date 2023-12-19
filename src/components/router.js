export class Router extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.routes = { };
    }

    connectedCallback() {
        console.log('Connected!');
        // this.checkRoute();
        window.addEventListener('hashchange', () => {
            this.checkRoute();
        })
    }

    addRoutes(routes) {
        this.routes = routes;
        this.checkRoute();
    }

    changeRoute(hash) {
        console.log('Route changed:', hash);
        if (!hash) {
            const defaultRoute = Object.entries(this.routes).find(([key, value]) => value.type === 'default');
            if (defaultRoute) {
                window.location.hash = '#/' + defaultRoute[0];
            } else {
                this.sendToNotFound()
            }
        } else {
            this.shadow.innerHTML = this.routes[hash] ? this.routes[hash].routingFunction() : this.sendToNotFound();
        }
    }

    sendToNotFound() {
        const notFoundRoute = Object.entries(this.routes).find(([key, value]) => value.type === 'notFound');
        if (notFoundRoute) {
            window.location.hash = '#/' + defaultRoute[0];
            this.changeRoute(defaultRoute[0]);
        }
    }

    checkRoute() {
        const hash = window.location.hash.slice(2);
        this.changeRoute(hash);
    }
}



customElements.define('app-router', Router);