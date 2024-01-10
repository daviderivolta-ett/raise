import { EventObservable } from '../observables/EventObservable.js';

export class TabsController extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {
        const activeTab = this.getAttribute('active-tab');
        switch (activeTab) {
            case 'info':
                this.suggestedRouteContent.classList.remove('active');
                this.customRouteContent.classList.remove('active');
                this.infoContent.classList.add('active');
                this.tabs.forEach(tab => {
                    tab.id === 'info-tab' ? tab.classList.add('active-tab') : tab.classList.remove('active-tab');
                });
                break;

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

        this.isOpen == true ? this.classList.add('visible') : this.classList.remove('visible');
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
                    <li class="tab" id="info-tab">INFO</li>
                    <li class="tab" id="suggested-route-tab">PERCORSI SUGGERITI</li>
                    <li class="tab" id="custom-route-tab">PERCORSO CUSTOM</li>
                </ul>
            </div>
            <div class="contents">
                <div class="content info-content"><app-tab-info></app-tab-info></div>
                <div class="content suggested-route-content">PERCORSI SUGGERITI</div>
                <div class="content custom-route-content"><app-tab-custom-route></app-tab-custom-route></div>
            </div>
            `
            ;

        if (!this.hasAttribute('is-open')) this.setAttribute('is-open', false);
        if (!this.hasAttribute('active-tab')) this.setAttribute('active-tab', 'info');
        this.isOpen = JSON.parse(this.getAttribute('is-open'));

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
        EventObservable.instance.subscribe('addtoroutebtn-click', feature => {
            this.setAttribute('active-tab', 'custom-route');
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tabs-controller.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'active-tab'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {
            if (name == 'is-open') {
                this.isOpen = JSON.parse(newValue);
                this.dispatchEvent(new CustomEvent('tabs-toggle', { detail: { isOpen: this.isOpen } }));
                this.render();
            }

            if (name == 'active-tab') {
                this.render();
            }
        }
    }

    addFeature(feature) {
        this.infoList.checkFeature(feature);
    }
}

customElements.define('app-tabs', TabsController);