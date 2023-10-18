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