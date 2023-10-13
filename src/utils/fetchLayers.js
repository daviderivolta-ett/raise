export const activateLayers = (allCheckboxLists, viewer, url, parameters) => {

    allCheckboxLists.forEach(checkboxList => {
        const activeLayers = [];
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

            // console.log(activeLayers);

            const toRemove = [...viewer.viewer.imageryLayers._layers].splice(1);
            toRemove.forEach(item => {
                viewer.removeLayer(item._imageryProvider._layers);
            });

            for (const layer of activeLayers) {
                viewer.addLayer(url, layer.layer, parameters);
            }

        });
    });
}