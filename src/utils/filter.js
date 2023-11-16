export const filterLayersBySelectedTags = (dataToFilter, array) => {
    dataToFilter.categories.forEach(category => {
        category.groups.forEach(group => {
            group.layers = group.layers.filter(layer => {
                if (layer.tags) {
                    return array.some(value => layer.tags.includes(value));
                }
                return false;
            });

            if (group.layers.length === 0) {
                category.groups = category.groups.filter(existingGroup => existingGroup !== group);
            }
        });

        if (category.groups.length === 0) {
            dataToFilter.categories = dataToFilter.categories.filter(existingCategory => existingCategory !== category);
        }
    });
};

export const filterLayersByTagName = (dataToFilter, value) => {
    dataToFilter.categories.forEach(category => {
        category.groups.forEach(group => {
            group.layers = group.layers.filter(layer => {
                if (layer.tags) {
                    return layer.tags.some(tag => tag.includes(value));
                }
                return false;
            });

            if (group.layers.length === 0) {
                category.groups = category.groups.filter(existingGroup => existingGroup !== group);
            }
        });

        if (category.groups.length === 0) {
            dataToFilter.categories = dataToFilter.categories.filter(existingCategory => existingCategory !== category);
        }
    });
}

export const filterTag = (data, value) => {
    let foundTags = [];
    data.categories.forEach(category => {
        category.groups.forEach(group => {
            group.layers.forEach(layer => {
                if (layer.tags) {
                    layer.tags.forEach(tag => {
                        if (tag.includes(value)) {
                            foundTags.push(tag);
                        }
                    });
                }
            });
        });
    });

    const uniqueFoundTags = [...new Set(foundTags)];
    return uniqueFoundTags;
}

export function filterLayerByName(obj, layerToFind) {
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

export async function getRelevantProperties(object, array, title) {
    const risultati = {};

    if (array) {
        for (const obj of array) {
            if (obj.property_name && object[obj.property_name]) {
                risultati[obj.display_name] = object[obj.property_name]._value;
            }
        }

        risultati["Title"] = title;
        return risultati;
    }

    return risultati;
}