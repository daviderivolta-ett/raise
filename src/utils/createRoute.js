export const createRoute = async (Cesium, position, navigationData, viewer) => {

    const entities = viewer.viewer.entities;
    removeAllEntities(entities);

    if (navigationData == null) return;
    const data = await fetchEntitiesData(navigationData);
    const features = data.features;

    let startingPosition = [position.coords.longitude, position.coords.latitude];
    let pathIndex = 1;
    while (features.length != 0) {

        let shortestDistance = Infinity;
        let shortestDistanceIndex = -1;
        for (let i = 0; i < features.length; i++) {
            let feature = features[i];
            const distance = calculateDistance(Cesium, startingPosition, feature);

            if (distance < shortestDistance) {
                shortestDistance = distance;
                shortestDistanceIndex = i;
            }
        }

        const endingPosition = findFeatureCoordinates(features[shortestDistanceIndex]);

        // viewer.createRoute(startingPosition, endingPosition, pathIndex);
        viewer.createPointsOrderLabels(endingPosition, pathIndex);

        if (shortestDistanceIndex !== -1) {
            features.splice(shortestDistanceIndex, 1);
        }

        pathIndex++;
        startingPosition = endingPosition;
    }

    viewer.viewer.zoomTo(viewer.viewer.entities);
}


async function fetchEntitiesData(obj) {
    const url = `${obj.url}?service=WFS&typeName=${obj.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Errore durante la richiesta fetch:', error);
        throw error;
    }
}

function calculateDistance(Cesium, initialPosition, feature) {
    const endingPosition = findFeatureCoordinates(feature);

    const start = Cesium.Cartographic.fromDegrees(initialPosition[0], initialPosition[1]);
    const end = Cesium.Cartographic.fromDegrees(endingPosition[0], endingPosition[1]);
    const ellipsoidGeodesic = new Cesium.EllipsoidGeodesic(start, end);
    const distance = ellipsoidGeodesic.surfaceDistance;
    return distance;
}

function findFeatureCoordinates(feature) {
    let endingPosition = [];
    if (Array.isArray(feature.geometry.coordinates)) {
        let coordinates = feature.geometry.coordinates;

        if (coordinates.length == 1) {
            coordinates[0].forEach(item => endingPosition.push(item));
        } else {
            coordinates.splice(2);
            coordinates.forEach(item => endingPosition.push(item));
        }

    } else {
        endingPosition = [feature.geometry.coordinates];
    }

    return endingPosition;
}

export async function removeAllEntities(entities) {
    const entitiesArray = Array.from(entities.values);

    for (const entity of entitiesArray) {
        if (entity.polyline !== undefined) {
            await entities.remove(entity);
        }

        if (entity.label !== undefined) {
            await entities.remove(entity);
        }
    }
}