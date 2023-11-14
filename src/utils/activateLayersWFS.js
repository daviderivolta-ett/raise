export const activateLayersWFS = async (allCheckboxLists, activeLayers, promises, viewer) => {
    for (const checkboxList of allCheckboxLists) {
        checkboxList.addEventListener('checkboxListChanged', async (event) => {
            checkLayerToRemove(event, activeLayers);

            if (checkboxList.getAttribute('navigation-data') != 'null') checkboxList.setAttribute('navigation-data', 'null');

            const checkboxListLayersToAdd = JSON.parse(event.detail.newValue);
            checkboxListLayersToAdd.forEach(layer => {
                activeLayers.push(layer);
            });

            await viewer.viewer.dataSources.removeAll();

            for (const layer of activeLayers) {
                const promise = viewer.fetchLayerData(layer.layer_url_wfs, layer.layer);
                promises.push(promise);

                await viewer.addLayer(promise);
                await viewer.styleEntities(promise, layer.style);
                // await viewer.clusterEntities(promise, layer.style.color);
            }

            // await viewer.viewer.dataSources.removeAll();
            
            await viewer.clusterAllEntities(promises);
            // console.log('Active layers:');
            // console.log(activeLayers);
            // console.log('Promises:');
            // console.log(promises);
            // console.log(viewer.viewer.dataSources);
        });
    }
}

function checkLayerToRemove(event, activeLayers) {
    const checkboxListLayersToRemove = event.detail.input;

    checkboxListLayersToRemove.forEach(layer => {
        const layerToRemoveIndex = activeLayers.findIndex(item => item.layer === layer.layer);

        if (layerToRemoveIndex !== -1) {
            activeLayers.splice(layerToRemoveIndex, 1);
        }
    });
}