export class Infobox extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    render() {
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div class="infobox">
                <div class="drag-handler">
                    <svg id="grip-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>

                    <svg id="close-icon" viewPort="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="11" x2="11" y2="1" stroke="black" stroke-width="2"/>
                        <line x1="1" y1="1" x2="11" y2="11" stroke="black" stroke-width="2"/>
                    </svg>
                </div>

                <div class="info-content"></div>
            </div>
            `
            ;

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/infobox.css');
        this.shadow.append(style);

        // Fill data
        this.info = this.shadow.querySelector('.info-content');
        this.data = JSON.parse(this.getAttribute('data'));

        Object.keys(this.data).forEach((key) => {
            const value = this.data[key];
            this.text = document.createElement('p');
            this.text.innerHTML =
                `
                <span class="info-key">${key}:</span> <span class="info-value">${value}</span>
                `
                ;
            this.info.append(this.text);
        });

        // js
        // close icon
        this.closeIcon = this.shadow.querySelector('#close-icon');
        this.closeIcon.addEventListener('click', () => {
            this.remove();
        });

        // draggable
        this.div = this.shadow.querySelector('.infobox');
        this.dragHandler = this.shadow.querySelector('.drag-handler');
        this.positions = [];

        const makeDraggable = (element) => {
            let isDragging = false;
            let offsetX, offsetY;

            this.dragHandler.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    element.style.left = (e.clientX - offsetX) + 'px';
                    element.style.top = (e.clientY - offsetY) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                this.setAttribute('position', JSON.stringify(element.getBoundingClientRect()));

                ////////
                // this.position = element.getBoundingClientRect();
                // this.elementPosition = {
                //     uuid: this.getAttribute('uuid'),
                //     position: this.position
                // }

                // const existingIndex = this.positions.findIndex(item => item.uuid === this.elementPosition.uuid);
                // if (existingIndex === -1) {
                //     this.positions.push(this.elementPosition);
                // } else {
                //     this.positions[existingIndex].position = this.position;
                // }


                // console.log(element.getBoundingClientRect());
                // console.log(this.positions);
            });
        }

        makeDraggable(this.div);
    }

    static observedAttributes = ['position'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            const event = new CustomEvent('positionChanged', {
                detail: { name, oldValue, newValue }
            });

            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-infobox', Infobox);