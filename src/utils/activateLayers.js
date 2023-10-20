export const activateLayers = (allCheckboxLists, activeLayers, viewer) => {
    const url = 'https://mappe.comune.genova.it/geoserver/wms';
    const parameters = {
        format: 'image/png',
        transparent: true
    }

    allCheckboxLists.forEach(checkboxList => {

        checkboxList.addEventListener('checkboxListChanged', (event) => {

            const checkboxListLayersToRemove = event.detail.input;

            checkboxListLayersToRemove.forEach(layer => {
                const layerToRemoveIndex = activeLayers.findIndex(item => item.layer === layer.layer);

                if (layerToRemoveIndex !== -1) {
                    activeLayers.splice(layerToRemoveIndex, 1);
                }
            });

            const checkboxListLayersToAdd = JSON.parse(event.detail.newValue);
            checkboxListLayersToAdd.forEach(layer => {
                activeLayers.push(layer);
            });

            const toRemove = [...viewer.viewer.imageryLayers._layers].splice(1);
            toRemove.forEach(item => {
                viewer.removeLayer(item._imageryProvider._layers);
            });

            for (const layer of activeLayers) {
                if (layer.hasOwnProperty('opacity')) {
                    parameters.opacity = layer.opacity;
                }

                viewer.addLayer(url, layer.layer, parameters);
            }

            console.log('Active layers:');
            console.log(activeLayers);

        });
    });
}