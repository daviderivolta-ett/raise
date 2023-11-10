export const startNavigation = (Cesium, viewer, windowPosition) => {
    const destination = convertCoordinates(Cesium, viewer, windowPosition);

    const url = `https://www.google.com/maps/dir/?api=1` +
        `&destination=${destination.latitude},${destination.longitude}`;

    window.open(url, '_blank');
}

function convertCoordinates(Cesium, viewer, windowPosition) {
    const featurePositionCartesian3 = viewer.viewer.scene.pickPosition(windowPosition);
    const featurePositionCartographic = Cesium.Cartographic.fromCartesian(featurePositionCartesian3);

    const longitude = Cesium.Math.toDegrees(featurePositionCartographic.longitude);
    const latitude = Cesium.Math.toDegrees(featurePositionCartographic.latitude);

    return { longitude, latitude }
}