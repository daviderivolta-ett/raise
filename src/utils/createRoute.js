export const createRoute = async (Cesium, position, allCheckboxLists, viewer) => {
    for (const checkboxList of allCheckboxLists) {
        checkboxList.addEventListener('navigationTriggered', async (event) => {

            const entities = viewer.viewer.entities;
            const entitiesArray = Array.from(entities.values);

            for (const entity of entitiesArray) {
                if (entity.polyline !== undefined) {
                    await entities.remove(entity);
                }
            }

            const navigationData = JSON.parse(event.detail.newValue);

            if (navigationData == null) return;
            const data = await fetchEntitiesData(navigationData);
            const features = data.features;

            let startingPosition = [position.coords.longitude, position.coords.latitude];
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

                viewer.createPolyline(startingPosition, endingPosition);

                if (shortestDistanceIndex !== -1) {
                    features.splice(shortestDistanceIndex, 1);
                }

                startingPosition = endingPosition;
            }
        })
    }
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