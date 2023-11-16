// Get config data
export async function fetchJsonData(categoriesUrl) {
    const jsonFile = await fetch(categoriesUrl)
        .then(res => res.json())

    const categories = jsonFile.categories;

    for (const category of categories) {
        const promises = [];

        for (let i = 0; i < category.groups.length; i++) {
            let url = category.groups[i];

            const promise = await fetch(url)
                .then(res => {
                    if (res) {
                        return res.json();
                    }
                })
                .catch(err => console.log(err))

            promises.push(promise);
        }

        const result = await Promise.all(promises)
            .then(res => {
                return res;
            })

        category.groups.splice(0, category.groups.length);

        result.forEach(item => {
            category.groups.push(item);
        })
    }

    return jsonFile;
};

// Get svg cluster icons
export async function fetchSvgIcon(iconNumber) {
    try {
        const response = await fetch(`./images/cluster/cluster-${iconNumber}.svg`);
        const svgText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        return doc;

    } catch (error) {
        console.error(error);
        throw error;
    }
}