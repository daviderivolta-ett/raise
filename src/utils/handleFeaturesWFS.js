export const handleFeaturesWFS = (features, jsonData) => {

    if (features != null) {

        let layerToFind = '';

        switch (true) {
            case features.id.includes('.'):
                layerToFind = features.id.split('.')[0];
                break;

            case features.id.includes('/'):
                layerToFind = features.id.split('/')[0];
                break;

            default:
                break;
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

async function getRelevantProperties(object, array, title) {
    const risultati = {};

    // console.log(object);
    // console.log(array);

    if (array) {
        for (const obj of array) {
            if (obj.property_name && object[obj.property_name]) {
                risultati[obj.display_name] = object[obj.property_name]._value;
            }

            // if (obj.property_name == 'wikidata') {
            //     const wikidataId = object[obj.property_name]._value;
            //     await getWikidata(wikidataId, array);
            // }
        }

        risultati["Title"] = title;

        return risultati;
    }

    return risultati;
}

async function getWikidata(wikidataId, relevantProperties) {
    const risultati = {};
    const wikiDataRaw = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`)
    const wikidata = await wikiDataRaw.json();    

    const properties = wikidata.entities[wikidataId].claims;

    console.log(relevantProperties);
    console.log(properties);

    for (const key in properties) {
        // console.log(key + ": " + properties[key][0].mainsnak.datavalue.value);
        console.log(properties[key]);
    }
}