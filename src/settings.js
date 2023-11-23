// Get config data
// export async function fetchJsonData(categoriesUrl) {
//     const jsonFile = await fetch(categoriesUrl)
//         .then(res => res.json())

//     const categories = jsonFile.categories;

//     for (const category of categories) {
//         const promises = [];

//         for (let i = 0; i < category.groups.length; i++) {
//             let url = category.groups[i];

//             const promise = await fetch(url)
//                 .then(res => {
//                     if (res) {
//                         return res.json();
//                     }
//                 })
//                 .catch(err => console.log(err))

//             promises.push(promise);
//         }

//         const result = await Promise.all(promises)
//             .then(res => {
//                 return res;
//             })

//         category.groups.splice(0, category.groups.length);

//         result.forEach(item => {
//             category.groups.push(item);
//         })
//     }

//     return jsonFile;
// };

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
                    throw new Error(`Failed to fetch data from ${url}`);
                } catch (err) {
                    console.error(err);
                    return null; // Handle the error gracefully, return null or a default value
                }
            });

            category.groups = await Promise.all(groupPromises);
        });

        await Promise.all(categoryPromises);

        return jsonFile;
    } catch (error) {
        console.error('Error fetching JSON data', error);
        throw error; // Rethrow the error for the calling code to handle if needed
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