export const activateLayersWFS = async (allCheckboxLists, activeLayers, viewer) => {
    for (const checkboxList of allCheckboxLists) {
        checkboxList.addEventListener('checkboxListChanged', async (event) => {
            const checkboxListLayersToRemove = event.detail.input;

            checkboxListLayersToRemove.forEach(layer => {
                const layerToRemoveIndex = activeLayers.findIndex(item => item.layer === layer.layer);

                if (layerToRemoveIndex !== -1) {
                    activeLayers.splice(layerToRemoveIndex, 1);
                }
            });

            if (checkboxList.getAttribute('navigation-data') != 'null') {
                checkboxList.setAttribute('navigation-data', 'null');
            }

            const checkboxListLayersToAdd = JSON.parse(event.detail.newValue);
            checkboxListLayersToAdd.forEach(layer => {
                activeLayers.push(layer);
            });

            await viewer.viewer.dataSources.removeAll();

            for (const layer of activeLayers) {
                viewer.addLayersWFS(layer.layer_url_wfs, layer.layer, layer.style);
            }

            // console.log('Active layers:');
            // console.log(activeLayers);
        });
    }
}