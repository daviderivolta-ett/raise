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