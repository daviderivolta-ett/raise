// Get config data
export async function fetchJsonData(categoriesUrl) {
    try {
        const jsonFile = await fetch(categoriesUrl).then(res => res.json());

        const categoryPromises = jsonFile.categories.map(async category => {
            const groupPromises = category.groups.map(async url => {
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error(`Errore durante il recupero dei dati da ${url}`);
                } catch (err) {
                    console.error(err);
                    return null;
                }
            });

            category.groups = await Promise.all(groupPromises);
        });

        await Promise.all(categoryPromises);
        return jsonFile;

    } catch (error) {
        console.error('Errore durante il recupero dei dati JSON', error);
        throw error;
    }
}


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