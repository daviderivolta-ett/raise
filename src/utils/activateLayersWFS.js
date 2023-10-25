export const activateLayersWFS = (allCheckboxLists, activeLayers, viewer) => {
    const url = 'https://mappe.comune.genova.it/geoserver/wfs';

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

            viewer.viewer.dataSources.removeAll();

            for (const layer of activeLayers) {
                if (layer.hasOwnProperty('opacity')) {
                    parameters.opacity = layer.opacity;
                }

                viewer.addLayersWFS(url, layer.layer);
            }

            console.log('Active layers:');
            console.log(activeLayers);

        });
    });



}