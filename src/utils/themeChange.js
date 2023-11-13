export const themeChange = (Cesium, viewer, stringifiedTheme) => {
    const themeLayerToRemove = viewer.viewer.imageryLayers._layers[1];
    viewer.viewer.imageryLayers.remove(themeLayerToRemove);

    if (stringifiedTheme != '') {
        const theme = JSON.parse(stringifiedTheme);
        viewer.changeTheme(theme);
        const entitiesArray = Array.from(viewer.viewer.entities.values);
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

function changeLabelsColor(Cesium, entitiesArray, color) {
    for (const entity of entitiesArray) {
        if (entity.label !== undefined) {
            entity.label.fillColor = Cesium.Color.fromCssColorString(color);
        }
    }
}