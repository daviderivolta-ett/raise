import { SettingService } from '../services/data.service.js';
import { LocalStorageService } from '../services/local-storage.service.js';

export class TagsPage extends HTMLElement {
    _tags;
    _selected;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._selected = [];
    }

    get tags() {
        return this._tags;
    }

    set tags(tags) {
        this._tags = tags;
    }

    get selected() {
        return this._selected;
    }

    set selected(selected) {
        this._selected = selected;
    }

    render() {
        // html
        this.tags.forEach(tag => {
            this.chip = document.createElement('app-chip');
            this.chip.setAttribute('tag', tag);
            this.list.append(this.chip);
        });

        this.chips = this.shadow.querySelectorAll('app-chip');

        // js
        this.chips.forEach(chip => {
            chip.addEventListener('chipChanged', e => {
                if (e.detail.newValue == 'true') {
                    if (this.selected.includes(e.detail.tag)) return;
                    this.selected.push(e.detail.tag);    
                } else {
                    this.selected = this.selected.filter(item => item !== e.detail.tag);
                }
                this.selected.length === 0 ? this.submit.disabled = true : this.submit.disabled = false;
            });
        });

        if (localStorage.selectedTags) {
            this.selected = JSON.parse(localStorage.selectedTags);
            this.selected.forEach(tag => {
                this.chips.forEach(chip => {
                    if (chip.getAttribute('tag') == tag) {
                        chip.setAttribute('is-selected', 'true');
                    }
                });
            });
            this.selected.length === 0 ? this.submit.disabled = true : this.submit.disabled = false;
        }
    }

    async connectedCallback() {
        // services
        LocalStorageService.instance.resetLayers();
        const data = await SettingService.instance.getData();
        this.tags = this.getTags(data);
        console.log('Tag attualmente salvati:', LocalStorageService.instance.getData().selectedTags);

        // html
        this.shadow.innerHTML =
            `
            <div class="page">
                <div class="box">
                    <div class="header">
                        <img src="../../images/RAISE_pictogram_nobg.svg" alt="Raise logo" class="logo">
                        <h1>Ecco alcuni dati che potrebbero interessarti:</h1>
                        <p class="info">Seleziona almeno una categoria di dati per iniziare. Non preoccuparti, potrai sceglierne altre successivamente.</p>
                    </div>
                    <div class="list"></div>
                    <div class="buttons">
                        <button type="submit" class="skip">Continua senza preferenze</button>
                        <button type="submit" class="submit">Continua</button>
                    </div>
                </div>
                <button type="button" class="clear">Clear local storage</button>
            </div>
            `
            ;

        this.list = this.shadow.querySelector('.list');
        this.submit = this.shadow.querySelector('.submit');
        this.skip = this.shadow.querySelector('.skip');
        this.clear = this.shadow.querySelector('.clear');

        this.submit.disabled = true;

        // js
        let redirectUri = '/#/map';
        
        this.submit.addEventListener('click', () => {
            localStorage.setItem('selectedTags', JSON.stringify(this.selected));
            window.location.href = redirectUri;
        });

        this.skip.addEventListener('click', () => {
            localStorage.setItem('selectedTags', JSON.stringify([]));
            window.location.href = redirectUri;
        });

        this.clear.addEventListener('click', () => localStorage.clear());

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/tags.page.css');
        this.shadow.append(style);

        this.render();
    }

    getTags(data) {
        let foundTags = [];

        data.categories.forEach(category => {
            category.groups.forEach(group => {
                group.layers.forEach(layer => {

                    if (layer.tags) {
                        layer.tags.forEach(tag => {
                            foundTags.push(tag);
                        });
                    }

                });
            });
        });

        const uniqueFoundTags = [...new Set(foundTags)];
        uniqueFoundTags.sort();
        return uniqueFoundTags;
    }
}

customElements.define('page-tags', TagsPage);