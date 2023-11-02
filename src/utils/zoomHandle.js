export const zoomHandle = (viewer, zoomBtns) => {
    zoomBtns.forEach(btn => {

        switch (btn.getAttribute('zoom-type')) {
            case "in":
                btn.addEventListener('click', () => {
                    viewer.viewer.camera.zoomIn(500.0);
                })
                break;

            case "out":
                btn.addEventListener('click', () => {
                    viewer.viewer.camera.zoomOut(500.0);
                })
                break;

            default:
                break;
        }
    })
}