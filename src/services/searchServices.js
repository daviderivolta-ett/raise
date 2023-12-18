export class SearchService {

    constructor() {
        if (SearchService._instance) {
            return SearchService._instance;
        }

        this.filteredArray = [];
    }

    static getInstance() {
        if (!SearchService._instance) {
            SearchService._instance = new SearchService();
        }
        return SearchService._instance;
    }

}