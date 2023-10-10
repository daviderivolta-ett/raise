// Fetahc layers name from geoserver
const fetchLayers = () => {
    const wmsUrl = 'https://mappe.comune.genova.it/geoserver/wms';

    const getCapabilitiesUrl = `${wmsUrl}?request=GetCapabilities&service=WMS`;

    fetch(getCapabilitiesUrl)

        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nella richiesta GetCapabilities');
            }
            return response.text();
        })

        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const layers = xmlDoc.getElementsByTagName('Name');

            for (let i = 0; i < layers.length; i++) {
                console.log(layers[i].textContent);
            }
        })

        .catch(error => {
            console.error('Si è verificato un errore:', error);
        });
}

// viewer.removeAllLayers();
// viewer.viewer.imageryLayers.addImageryProvider(CesiumViewer.getImageryProvider());

export { fetchLayers }