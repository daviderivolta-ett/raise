export class TabInfo extends HTMLElement {
    _isGrabbed;
    _startX;
    _scrollLeft;
    _features;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.features = [];
    }

    get features() {
        return this._features;
    }

    set features(features) {
        this._features = features;
    }

    get customRoute() {
        return this._customRoute;
    }

    set customRoute(customRoute) {
        this._customRoute = customRoute;
    }

    render() {

    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="left-arrow icon">
                <span class="material-symbols-outlined">keyboard_arrow_left</span>
            </div>
            <div class="right-arrow icon">
                <span class="material-symbols-outlined">keyboard_arrow_right</span>
            </div>
            `
        ;

        this.leftArrow = this.shadow.querySelector('.left-arrow');
        this.rightArrow = this.shadow.querySelector('.right-arrow');

        // js
        this.addEventListener('touchstart', e => this.start(e));
        this.addEventListener('mousedown', e => this.start(e));
        this.addEventListener('mousemove', e => this.move(e));
        this.addEventListener('touchmove', e => this.move(e));
        this.addEventListener('mouseup', this.end);
        this.addEventListener('touchend', this.end);
        this.addEventListener('mouseleave', this.end);

        this.leftArrow.addEventListener('click', () => {
            const scrollAmount = this.scrollLeft - this.clientWidth - 24;
            this.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        this.rightArrow.addEventListener('click', () => {
            const scrollAmount = this.scrollLeft + this.clientWidth + 24;
            this.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tab-info.css');
        this.shadow.append(style);
    }

    start(e) {
        this.isGrabbed = true;
        this._startX = e.pageX || e.touches[0].pageX - this.offsetLeft;
        this._scrollLeft = this.scrollLeft;
    }

    move(e) {
        if (this.isGrabbed == false) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX - this.offsetLeft;
        const walk = (x - this._startX) * 3;
        this.scrollLeft = this._scrollLeft - walk;
    }

    end() {
        this.isGrabbed = false;
    }

    checkFeature(feature) {
        let isPresent = this.features.some(item => item.id === feature.id);
        if (!isPresent) {
            this.createCard(feature);
        } else {
            let index = this.features.findIndex(item => item.id === feature.id);
            this.removeCard(index);            
            this.createCard(feature);
        }
    }

    createCard(feature) {
        let card = document.createElement('app-info-card');
        this.shadow.prepend(card);
        card.feature = feature;
        this.features.unshift(feature);
        this.scrollLeft = 0;

        card.addEventListener('remove-card', () => {
            let index = this.features.findIndex(item => item.id === feature.id);
            this.removeCard(index);
        });

        card.addEventListener('centerpositiononfeature-click', e => {
            this.dispatchEvent(new CustomEvent('centerpositiononfeature-click', { detail: { feature: e.detail.feature } }));
        });
    }

    removeCard(index) {
        let cards = this.shadow.querySelectorAll('app-info-card');
        cards[index].remove();
        this.features.splice(index, 1);
    }
}

customElements.define('app-tab-info', TabInfo);