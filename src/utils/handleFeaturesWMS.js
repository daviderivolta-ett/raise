export const handleFeaturesWMS = (features, jsonData) => {

    if (features != null) {

        let layerToFind = '';

        if (features.data.id.includes('.')) {
            layerToFind = features.data.id.split('.')[0];
        }

        const foundLayer = filterLayerByName(jsonData, layerToFind);
        const foundLayerName = foundLayer.name;
        const relevantProperties = foundLayer.relevant_properties;

        const properties = getRelevantProperties(features.properties, relevantProperties, foundLayerName);
        // console.log(properties);

        return properties;
    }
}

function filterLayerByName(obj, layerToFind) {
    for (const key in obj) {
        const currentValue = obj[key];

        if (Array.isArray(currentValue) || typeof currentValue === 'object') {
            const result = filterLayerByName(currentValue, layerToFind);
            if (result) {
                return result;
            }

        } else if (typeof currentValue === 'string' && currentValue.includes(layerToFind)) {
            return obj;
        }
    }

    return null;
}

function getRelevantProperties(object, array, title) {
    const risultati = {};

    if (array) {
        for (const obj of array) {
            if (obj.property_name && object[obj.property_name]) {
                risultati[obj.display_name] = object[obj.property_name];
            }
        }

        // risultati["title"] = title;

        return risultati;
    }

    return risultati;
}