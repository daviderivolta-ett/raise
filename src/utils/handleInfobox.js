export const handleFeatures = (features, infoBox, jsonData) => {

    console.log(features);
    console.log(jsonData);
    // console.log(features.data.id);

    const layerToFind = features.data.id.split('.')[0];

    filterLayerByName(jsonData, layerToFind);


    if (features != null) {
        infoBox.setAttribute('data', JSON.stringify(features.properties));
        infoBox.classList.add('visible');
    } else {
        infoBox.classList.remove('visible');
    }
}







function filterLayerByName(obj, layerToFind) {
    for (const key in obj) {
        const currentValue = obj[key];

        if (Array.isArray(currentValue) || typeof currentValue === 'object') {
            const result = filterLayerByName(currentValue, layerToFind);
            if (result) {
                console.log(result);
                return result;
            }
            
        } else if (typeof currentValue === 'string' && currentValue.includes(layerToFind)) {
            return obj;
        }
    }

    return null;
}