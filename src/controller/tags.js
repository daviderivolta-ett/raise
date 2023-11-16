export const getAllTags = (data) => {

    let foundTags = [];

    data.categories.forEach(category => {
        category.groups.forEach(group => {
            group.layers.forEach(layer => {

                if (layer.tags) {
                    layer.tags.forEach(tag => {
                        foundTags.push(tag);
                    });
                }

            });
        });
    });

    const uniqueFoundTags = [...new Set(foundTags)];
    uniqueFoundTags.sort();
    return uniqueFoundTags;
}