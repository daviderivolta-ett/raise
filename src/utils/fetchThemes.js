export async function fetchThemes(themesUrl) {
    const themesJson = await fetch(themesUrl)
    .then(res => res.json())

    return themesJson;
}