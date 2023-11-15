export const changeTheme = (Cesium, map, stringifiedTheme) => {
    const themeLayerToRemove = map.viewer.imageryLayers._layers[1];
    map.viewer.imageryLayers.remove(themeLayerToRemove);

    if (stringifiedTheme != '') {
        const theme = JSON.parse(stringifiedTheme);
        map.loadTileFromTheme(theme);
        const entitiesArray = Array.from(map.viewer.entities.values);
        let color;
        if (theme.layer && theme.layer.includes('light')) {
            color = 'DARKSLATEGRAY';
            changeLabelsColor(Cesium, entitiesArray, color);
        } else {
            color = 'WHITE';
            changeLabelsColor(Cesium, entitiesArray, color);
        }

    }
}

export async function fetchThemes(themesUrl) {
    const themesJson = await fetch(themesUrl)
        .then(res => res.json())

    return themesJson;
}

function changeLabelsColor(Cesium, entitiesArray, color) {
    for (const entity of entitiesArray) {
        if (entity.label !== undefined) {
            entity.label.fillColor = Cesium.Color.fromCssColorString(color);
        }
    }
}