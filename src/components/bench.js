export class Bench extends HTMLElement {
    _data;
    _input;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._data = [];
    }

    get input() {
        return this._input;
    }

    set input(input) {
        this._input = input;
        this._data.push(this.input);
        this.data = this._data;
        console.log(this.data);
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
        this.render();
    }

    render() {
        this.div.innerHTML = '';
        this.data.forEach(layer => {
            let p = document.createElement('p');
            p.innerText = layer.name;
            this.div.append(p);
        });
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div></div>
            `
        ;

        this.div = this.shadow.querySelector('div');

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/bench.css');
        this.shadow.append(style);

    }
}

customElements.define('app-bench', Bench);