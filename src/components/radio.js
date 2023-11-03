export class Radio extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    render() {

    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <div>
                <input type="radio" name="choosen-map" id="acquedotto" value='[ { "name": "Acquedotto storico", "layer": "CULTURA:V_ACQ_STORICO" }, { "name": "Manufatti storici", "layer": "CULTURA:V_ACQ_MANU_STORICI" }, { "name": "Area di sosta", "layer": "CULTURA:V_ACQ_AREA_SOSTA" }, { "name": "Punti di accesso", "layer": "V_ACQ_PTI_ACCESSO" }, { "name": "Punti di interesse storico", "layer": "CULTURA:V_ACQ_PTI_INT_STORICO" }, { "name": "Pannelli informativi", "layer": "SITGEO:V_LOCALIZZAZIONE_PANNELLI_INFORMATIVI" }, { "name": "Fonti acqua potabile", "layer": "SITGEO:V_ACQUA_POTABILE" } ]' checked>
                <label for="acquedotto">Acquedotto di genova</label>
            </div>
            <div>
                <input type="radio" name="choosen-map" id="ciclabile" value='[{ "name": "Parcheggi Bike Sharing", "layer": "SITGEO:V_MOB_PARKS_BIKESHARING" }, { "name": "Piste ciclabili", "layer": "SITGEO:V_MOB_PISTE_CICLABILI" }]'>
                <label for="ciclabile">Piste ciclabili</label>
            </div>
            <div>
                <input type="radio" name="choosen-map" id="ztl" value='[{ "name": "Blu area", "layer": "SITGEO:V_MOB_BLUAREA" }, { "name": "ZTL e ambiente", "layer": "SITGEO:V_MOB_ZTL_AMBIENTE" }]'>
                <label for="ztl">ZTL e aree sosta</label>
            </div>
            `
        ;

        this.setAttribute('selected-map', '[{ "name": "Acquedotto storico", "layer": "CULTURA:V_ACQ_STORICO" }, { "name": "Manufatti storici", "layer": "CULTURA:V_ACQ_MANU_STORICI" }, { "name": "Area di sosta", "layer": "CULTURA:V_ACQ_AREA_SOSTA" }, { "name": "Punti di accesso", "layer": "V_ACQ_PTI_ACCESSO" }, { "name": "Punti di interesse storico", "layer": "CULTURA:V_ACQ_PTI_INT_STORICO" }, { "name": "Pannelli informativi", "layer": "SITGEO:V_LOCALIZZAZIONE_PANNELLI_INFORMATIVI" }, { "name": "Fonti acqua potabile", "layer": "SITGEO:V_ACQUA_POTABILE" }]');

        // js
        this.radios = this.shadow.querySelectorAll('input');
        this.radios.forEach(item => {
            item.addEventListener('change', event => {
                this.setAttribute('selected-map', item.getAttribute('value'));
            })
        });
    }

    static observedAttributes = ['selected-map'];
    attributeChangedCallback(name, oldValue, newValue) {
        const event = new CustomEvent('selectedMapChanged', {
            detail: {name, oldValue, newValue}
        });

        if (newValue != oldValue) {
            this.dispatchEvent(event);
        }
    }
}

customElements.define('app-radio', Radio);