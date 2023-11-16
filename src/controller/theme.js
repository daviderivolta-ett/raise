export function changeTheme (map, theme) {
    const themeLayerToRemove = map.viewer.imageryLayers._layers[1];
    map.viewer.imageryLayers.remove(themeLayerToRemove);

    if (theme != '') {
        theme = JSON.parse(theme);
        const style = map.getImageryProvider(theme.url, theme.layer, theme. credit);
        map.viewer.imageryLayers.addImageryProvider(style);
    }
}

export async function fetchThemes(themesUrl) {
    const themesJson = await fetch(themesUrl)
        .then(res => res.json());

    return themesJson;
}