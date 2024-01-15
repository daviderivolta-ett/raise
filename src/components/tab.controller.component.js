import { EventObservable } from '../observables/EventObservable.js';

export class TabsController extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        const activeTab = this.getAttribute('active-tab');
        switch (activeTab) {
            case 'suggested-route':
                this.suggestedRouteContent.classList.add('active');
                this.customRouteContent.classList.remove('active');
                this.infoContent.classList.remove('active');
                this.tabs.forEach(tab => {
                    tab.id === 'suggested-route-tab' ? tab.classList.add('active-tab') : tab.classList.remove('active-tab');
                });
                break;

            case 'custom-route':
                this.suggestedRouteContent.classList.remove('active');
                this.customRouteContent.classList.add('active');
                this.infoContent.classList.remove('active');
                this.tabs.forEach(tab => {
                    tab.id === 'custom-route-tab' ? tab.classList.add('active-tab') : tab.classList.remove('active-tab');
                });
                break;

            default:
                this.suggestedRouteContent.classList.remove('active');
                this.customRouteContent.classList.remove('active');
                this.infoContent.classList.add('active');
                this.tabs.forEach(tab => {
                    tab.id === 'info-tab' ? tab.classList.add('active-tab') : tab.classList.remove('active-tab');
                });
                break;
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="toggle">
                <div class="close"></div>
            </div>
            <div class="controller">
                <ul class="tabs">
                    <li class="tab" id="info-tab">Informazioni</li>
                    <li class="tab" id="suggested-route-tab">Percorsi suggeriti</li>
                    <li class="tab" id="custom-route-tab">Percorso custom</li>
                </ul>
            </div>
            <div class="contents">
                <div class="content info-content"><app-tab-info></app-tab-info></div>
                <div class="content suggested-route-content"></div>
                <div class="content custom-route-content"><app-tab-custom-route></app-tab-custom-route></div>
            </div>
            `
            ;

        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', false);
        if (!this.hasAttribute('is-maximized')) this.setAttribute('is-maximized', false);

        this.isOpen = JSON.parse(this.getAttribute('is-open'));
        this.isMaximized = JSON.parse(this.getAttribute('is-maximized'));

        this.toggle = this.shadow.querySelector('.toggle');
        this.tabs = this.shadow.querySelectorAll('.tab');

        this.infoTab = this.shadow.querySelector('#info-tab');
        this.suggestedRouteTab = this.shadow.querySelector('#suggested-route-tab');
        this.customRouteTab = this.shadow.querySelector('#custom-route-tab');

        this.infoContent = this.shadow.querySelector('.info-content');
        this.infoComponent = this.shadow.querySelector('app-tab-info');

        this.suggestedRouteContent = this.shadow.querySelector('.suggested-route-content');

        this.customRouteContent = this.shadow.querySelector('.custom-route-content');
        this.customRouteComponent = this.shadow.querySelector('app-tab-custom-route');

        this.infoTab.addEventListener('click', () => this.setAttribute('active-tab', 'info'));
        this.suggestedRouteTab.addEventListener('click', () => this.setAttribute('active-tab', 'suggested-route'));
        this.customRouteTab.addEventListener('click', () => this.setAttribute('active-tab', 'custom-route'));
        this.toggle.addEventListener('click', () => this.setAttribute('is-open', !this.isOpen));

        this.infoList = this.shadow.querySelector('app-tab-info');

        // js
        EventObservable.instance.subscribe('addtocustomroutebtn-click', feature => {
            this.setAttribute('active-tab', 'custom-route');
        });

        EventObservable.instance.subscribe('customroutecard-click', feature => {
            this.infoList.feature = feature;
            this.setAttribute('active-tab', 'info');
            this.setAttribute('is-maximized', false);
        });

        this.toggle.addEventListener('wheel', e => {
            if (e.deltaY > 0) {
                this.setAttribute('is-maximized', true);
            } else {
                this.setAttribute('is-maximized', false);
            }
        });

        this.infoContent.addEventListener('wheel', e => {
            if (e.deltaY > 0) this.setAttribute('is-maximized', true);
        });

        this.customRouteComponent.addEventListener('wheel', e => {
            if (e.deltaY > 0) this.setAttribute('is-maximized', true);
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab.controller.component.css');
        this.shadow.append(style);

        if (!this.hasAttribute('active-tab')) this.setAttribute('active-tab', 'info');
    }

    static observedAttributes = ['is-open', 'active-tab', 'is-maximized'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            if (name == 'active-tab') {
                this.render();
            }

            if (name == 'is-open') {
                this.isOpen = JSON.parse(newValue);

                if (this.isOpen == true) {
                    this.classList.add('visible')
                } else {
                    this.classList.remove('visible');
                    this.setAttribute('is-maximized', this.isOpen);
                }

                this.dispatchEvent(new CustomEvent('tabs-toggle', { detail: { isOpen: this.isOpen } }));
            }

            if (name == 'is-maximized') {
                this.isMaximized = JSON.parse(newValue);
                this.isMaximized == true ? this.classList.add('maximized') : this.classList.remove('maximized');
                EventObservable.instance.publish('tab-maximize', this.isMaximized);
            }
        }
    }

    addFeature(feature) {
        this.infoList.feature = feature;
    }
}

customElements.define('app-tabs', TabsController);