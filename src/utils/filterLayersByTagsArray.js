export const filterLayersByTagsArray = (dataToFilter, array) => {
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
