export const zoomHandle = (viewer, btn) => {

    switch (btn.getAttribute('zoom-type')) {
        case "in":
            btn.addEventListener('click', () => {
                viewer.viewer.camera.zoomIn(500.0);
                console.log(viewer.viewer.scene);
                // this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10000;
            });
            break;

        case "out":
            btn.addEventListener('click', () => {
                viewer.viewer.camera.zoomOut(500.0);
            });
            break;

        default:
            break;
    }
}
