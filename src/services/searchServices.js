export class SearchService {
    constructor() {
        if (SearchService._instance) {
            return SearchService._instance;
        }

        this.data;
        this.filteredData;
        this.search;
        this.tags;
    }

    static get instance() {
        if (!SearchService._instance) {
            SearchService._instance = new SearchService();
        }
        return SearchService._instance;
    }

    get data () {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    get filteredData () {
        return this._filteredData;
    }

    set filteredData(filteredData) {
        this._filteredData = filteredData;
    }

    get search() {
        return this._search;
    }

    set search(search) {
        this._search = search;
        this.filteredData = this.filterLayersByTagName(this.data, this.search);
        this.tags = this.filterTag(this.data, this.search);
    }

    get tags() {
        return this._tags;
    }

    set tags(tags) {
        this._tags = tags;
    }

    filterLayersByTagName(dataToFilter, value) {
        let filteredData = JSON.parse(JSON.stringify(dataToFilter));

        filteredData.categories = filteredData.categories.map(category => {
            category.groups = category.groups.map(group => {
                group.layers = group.layers.filter(layer => {
                    if (layer.tags) {
                        return layer.tags.some(tag => tag.includes(value));
                    }
                    return false;
                });

                return group.layers.length > 0 ? group : null;
            }).filter(Boolean);

            return category.groups.length > 0 ? category : null;
        }).filter(Boolean);

        return filteredData;
    }

    filterTag(data, value) {
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
}