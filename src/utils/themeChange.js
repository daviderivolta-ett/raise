const themes = [
    {},
    {
        url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{TileMatrix}/{TileCol}/{TileRow}.png',
    },
    {
        url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{TileMatrix}/{TileCol}/{TileRow}.png',
    }
]

let currentIndex = 0;

export const themeChange = (viewer, themeBtn) => {
    themeBtn.addEventListener('click', () => {
        // console.log(viewer.viewer.imageryLayers);
        const themeLayerToRemove = viewer.viewer.imageryLayers._layers[1];
        viewer.viewer.imageryLayers.remove(themeLayerToRemove);

        currentIndex = (currentIndex + 1) % themes.length;
        if (currentIndex === 0) {
            return
        } else {
            const themeUrl = themes[currentIndex].url
            viewer.changeTheme(themeUrl);
        }
    });
}