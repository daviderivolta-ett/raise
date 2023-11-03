export const themeChange = (viewer, themeUrl) => {
    const themeLayerToRemove = viewer.viewer.imageryLayers._layers[1];
    viewer.viewer.imageryLayers.remove(themeLayerToRemove);

    if (themeUrl != '') {
        viewer.changeTheme(themeUrl);
    }
}