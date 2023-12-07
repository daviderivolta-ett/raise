export class Drawer extends HTMLElement {
    _data;
    _output;
    _input;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    set data(data) {
        this._data = data;
        this.render();
    }

    get data() {
        return this._data;
    }

    set output(output) {
        this._output = output;
        this.dispatchEvent(new CustomEvent('activeLayers', {
            detail: { activeLayers: this.output }
        }));
    }

    get output() {
        return this._output;
    }

    set input(input) {
        this._input = input;

        console.log(this.input);
        this.accordions.forEach(accordion => {
            console.log(accordion.data);
            this.input.forEach(layer => {
                
            });
        });
    }

    get input() {
        return this._input;
    }

    render() {
        // Render
        if (localStorage.length != 0) {
            let tags = JSON.parse(localStorage.selectedTags);
            this.filterLayersBySelectedTags(this.data, tags);
            this.createDrawer(this.data, this.div);

            if (this.data.categories.length == 0) {
                const msg = document.createElement('p');
                msg.innerText = 'Nessun livello trovato';
                this.div.append(msg);
            }
        } else {
            this.createDrawer(this.data, this.div);
        }

        // DOM nodes
        this.accordions = this.shadow.querySelectorAll('app-category-accordion-new');

        // js
        this.accordions.forEach(accordion => {
            accordion.addEventListener('accordionToggled', event => {
                const isOpen = event.detail.isOpen;

                if (isOpen == 'true') {
                    this.accordions.forEach(accordion => {
                        if (accordion !== event.target) accordion.setAttribute('is-open', 'false');
                    });
                }
            });
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div id="categories-section"></div>
            `
            ;

        this.div = this.shadow.querySelector('#categories-section');
    }

    filterLayersBySelectedTags(dataToFilter, array) {
        dataToFilter.categories.forEach(category => {
            category.groups.forEach(group => {
                group.layers = group.layers.filter(layer => {
                    if (layer.tags) {
                        return array.some(value => layer.tags.includes(value));
                    }
                    return false;
                });

                if (group.layers.length === 0) {
                    category.groups = category.groups.filter(existingGroup => existingGroup !== group);
                }
            });

            if (category.groups.length === 0) {
                dataToFilter.categories = dataToFilter.categories.filter(existingCategory => existingCategory !== category);
            }
        });
    };

    createDrawer(data, div) {
        data.categories.forEach(category => {
            const categoryAccordion = document.createElement('app-category-accordion-new');
            categoryAccordion.data = category;
            div.append(categoryAccordion);
        });
    }
}

customElements.define('app-drawer', Drawer);