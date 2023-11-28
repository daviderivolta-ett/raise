import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export default class CesiumViewer {

    constructor() {
        const element = document.querySelector('app-map');

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MjY2YmYxNy1mNTM2LTRlOWYtYTUyZC01ZmY0NjBhNzllMWEiLCJpZCI6MTY5MDU3LCJpYXQiOjE2OTU4ODQ4NzB9.bN66rOR5h37xuKVsuUSYRSLOGJy-34IhH9S1hr4NOOE';

        this.viewer = new Cesium.Viewer(element, {
            baseLayerPicker: false,
            geocoder: false,
            timeline: false,
            animation: false,
            homeButton: false,
            navigationInstructionsInitiallyVisible: false,
            navigationHelpButton: false,
            sceneModePicker: false,
            fullscreenButton: false,
            infoBox: false,
            // terrain: Cesium.Terrain.fromWorldTerrain()
        });
    }

    changeTheme(theme) {
        const themeLayerToRemove = this.viewer.imageryLayers._layers[1];
        this.viewer.imageryLayers.remove(themeLayerToRemove);

        if (theme != '') {
            theme = JSON.parse(theme);
            const style = this.getImageryProvider(theme.url, theme.layer, theme.credit);
            this.viewer.imageryLayers.addImageryProvider(style);
        }
    }

    async fetchThemes(themesUrl) {
        const themesJson = await fetch(themesUrl)
            .then(res => res.json());
        return themesJson;
    }

    getImageryProvider(url, layer, credit) {
        return new Cesium.WebMapTileServiceImageryProvider({
            url: url,
            layer: layer,
            style: 'default',
            format: 'image/jpeg',
            maximumLevel: 19,
            tileMatrixSetID: 'default',
            credit: new Cesium.Credit(credit)
        });
    }

    onClick(movement, jsonData) {
        const windowPosition = movement.position;
        const pickedEntity = this.viewer.scene.pick(windowPosition);

        if (!pickedEntity) return;
        if (pickedEntity == null) return;

        if (Array.isArray(pickedEntity.id)) {
            this.viewer.zoomTo(pickedEntity.id);
            return;
        }

        const layerNameToFetch = this.getLayerToFind(pickedEntity.id);
        const foundLayer = this.filterLayerByName(jsonData, layerNameToFetch);

        const ray = this.viewer.camera.getPickRay(windowPosition);
        const cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        const coordinates = this.cartesianToCartographic(cartesian);

        const properties = pickedEntity.id.properties;
        const propertiesToFind = foundLayer.relevant_properties;
        const layerName = foundLayer.name;

        const relevantProperties = this.getRelevantProperties(properties, propertiesToFind, layerName);

        let feature = {};
        feature.properties = relevantProperties;
        feature.coordinates = coordinates;

        return feature;
    }

    getLayerToFind(features) {
        if (features == null) return;

        let layerToFind;

        switch (true) {
            case features.id.includes('.'):
                layerToFind = features.id.split('.')[0];
                break;

            case features.id.includes('/'):
                layerToFind = features.id.split('/')[0];
                break;

            default:
                break;
        }

        return layerToFind;
    }

    cartesianToCartographic(cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        return { longitude, latitude };
    }

    createInfobox(counter, elements, info, div) {
        let isElementPresent = false;

        elements.forEach(element => {
            if (element.getAttribute('data') === JSON.stringify(info)) {
                isElementPresent = true;
            }
        });

        if (!isElementPresent && info) {
            const element = document.createElement('app-infobox');

            element.setAttribute('data', JSON.stringify(info));
            counter++;
            element.setAttribute('uuid', counter);
            div.append(element);
        }
    }

    filterLayerByName(obj, layerToFind) {
        for (const key in obj) {
            const currentValue = obj[key];

            if (Array.isArray(currentValue) || typeof currentValue === 'object') {
                const result = this.filterLayerByName(currentValue, layerToFind);
                if (result) {
                    return result;
                }

            } else if (typeof currentValue === 'string' && currentValue.includes(layerToFind)) {
                return obj;
            }
        }

        return null;
    }

    getRelevantProperties(object, array, title) {
        const risultati = {};

        if (array) {
            for (const obj of array) {
                if (obj.property_name && object[obj.property_name]) {
                    risultati[obj.display_name] = object[obj.property_name]._value;
                }
            }

            risultati["Title"] = title;
            return risultati;
        }

        return risultati;
    }

    startNavigation(windowPosition) {
        const destination = this.convertCoordinates(windowPosition);
        const url = `https://www.google.com/maps/dir/?api=1` +
            `&destination=${destination.latitude},${destination.longitude}`;
        window.open(url, '_blank');
    }

    convertCoordinates(windowPosition) {
        const featurePositionCartesian3 = this.viewer.scene.pickPosition(windowPosition);
        const featurePositionCartographic = Cesium.Cartographic.fromCartesian(featurePositionCartesian3);

        const longitude = Cesium.Math.toDegrees(featurePositionCartographic.longitude);
        const latitude = Cesium.Math.toDegrees(featurePositionCartographic.latitude);

        return { longitude, latitude }
    }

    goto(coordinates) {
        const url = `https://www.google.com/maps/dir/?api=1` +
            `&destination=${coordinates.latitude},${coordinates.longitude}`;
        window.open(url, '_blank');
    }

    async handleCheckbox(activeLayers, clusterIcons) {
        const requests = activeLayers.map(layer => this.fetchLayerData(layer).then((data) => ({ layer, data })));

        await Promise.all(requests).then(async sources => {
            this.viewer.dataSources.removeAll();

            await Promise.all(sources.map(async source => {
                const layer = await source.data.layer;
                this.viewer.dataSources.add(layer);
                await this.styleEntities(layer, source.layer.style);
            }));

            const combinedDataSource = this.combineDataSource();
            const clusteredDataSource = await this.clusterAllEntities(clusterIcons, combinedDataSource);
            this.viewer.dataSources.add(clusteredDataSource);
        });
    }

    async checkLayerToRemove(allLayers, activeLayers) {
        allLayers.forEach(layer => {
            const layerToRemoveIndex = activeLayers.findIndex(item => item.layer === layer.layer);

            if (layerToRemoveIndex !== -1) {
                activeLayers.splice(layerToRemoveIndex, 1);
            }
        });
    }

    async fetchLayerData(layer) {
        const url = `${layer.layer_url_wfs}?service=WFS&typeName=${layer.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;
        return fetch(url)
            .then(res => res.json())
            .then(geoJson => ({
                features: geoJson.features,
                layer: Cesium.GeoJsonDataSource.load(geoJson)
            }))
            .catch(err => {
                console.error(err);
                throw err;
            });
    }

    async styleEntities(dataSource, style) {
        let fillColor = 'YELLOW';
        let markerColor = 'YELLOW';
        let opacity = 0.5;

        if (style && style.color) {
            fillColor = style.color.toUpperCase();
            markerColor = style.color.toUpperCase();
        }

        if (style && style.opacity) opacity = style.opacity;

        dataSource.entities.values.forEach(entity => {

            switch (true) {
                case Cesium.defined(entity.polyline):
                    entity.polyline.material = Cesium.Color[fillColor].withAlpha(parseFloat(opacity));
                    entity.polyline.width = 2;
                    break;

                case Cesium.defined(entity.billboard):
                    entity.billboard = undefined;
                    entity.point = new Cesium.PointGraphics({
                        pixelSize: 18,
                        color: Cesium.Color[markerColor].withAlpha(parseFloat(opacity)),
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2
                    })
                    break;

                case Cesium.defined(entity.polygon):
                    entity.polygon.material = Cesium.Color[fillColor].withAlpha(parseFloat(opacity));
                    entity.polygon.outlineColor = Cesium.Color[fillColor].withAlpha(parseFloat(opacity));
                    break;

                default:
                    break;
            }
        });
    }

    combineDataSource() {
        const dataSources = this.viewer.dataSources;
        const combinedDataSource = new Cesium.CustomDataSource();

        for (let i = 0; i < dataSources.length; i++) {
            dataSources.get(i).entities.values.forEach(entity => {
                combinedDataSource.entities.add(entity);
            });
        }

        const combinedDataSourceIndex = dataSources.indexOf(combinedDataSource);
        for (let i = dataSources.length - 1; i >= 0; i--) {
            if (i !== combinedDataSourceIndex) dataSources.remove(dataSources.get(i));
        }

        return combinedDataSource;
    }

    async clusterAllEntities(clusterIcons, combinedDataSource) {
        const color = 'WHITE';
        combinedDataSource.clustering.enabled = true;
        combinedDataSource.clustering.pixelRange = 25;
        combinedDataSource.clustering.minimumClusterSize = 2;

        const icon2 = clusterIcons[0];
        const icon3 = clusterIcons[1];
        const icon4 = clusterIcons[2];

        combinedDataSource.clustering.clusterEvent.addEventListener(async (clusteredEntities, cluster) => {
            cluster.label.show = false;
            cluster.billboard.show = true;
            cluster.billboard.color = Cesium.Color.fromCssColorString(color);
            cluster.billboard.scale = 0.38;
            cluster.billboard.id = cluster.label.id;

            let colors = [];
            cluster.billboard.id.forEach(entity => {
                colors.push(entity.point.color.getValue());
                if (colors.length > 4) colors.shift();
            });

            switch (true) {
                case clusteredEntities.length >= 4:
                    const styledIcon4 = this.styleClusterIcon(icon4, colors);
                    const url4 = this.createClusterIconUrl(styledIcon4);
                    cluster.billboard.image = url4;
                    break;
                case clusteredEntities.length == 3:
                    const styledIcon3 = this.styleClusterIcon(icon3, colors);
                    const url3 = this.createClusterIconUrl(styledIcon3);
                    cluster.billboard.image = url3;
                    break;
                case clusteredEntities.length == 2:
                    const styledIcon2 = this.styleClusterIcon(icon2, colors);
                    const url2 = this.createClusterIconUrl(styledIcon2);
                    cluster.billboard.image = url2;
                    break;
                default:
                    break;
            }

        });

        return combinedDataSource;
    }

    styleClusterIcon(svgDoc, colors) {
        let rgbColors = [];

        colors.forEach(color => {
            let red = Math.floor(color.red * 255);
            let green = Math.floor(color.green * 255);
            let blue = Math.floor(color.blue * 255);
            let obj = { red, green, blue };
            rgbColors.push(obj);
        });

        let colorIndex = 0;
        const circles = svgDoc.querySelectorAll('circle');

        if (circles.length == 4) {
            circles.forEach(circle => circle.setAttribute('fill', '#1E233A'));
        } else {
            for (let i = 0; i < circles.length; i++) {
                circles[i].setAttribute('fill', `rgb(${rgbColors[colorIndex].red}, ${rgbColors[colorIndex].green}, ${rgbColors[colorIndex].blue})`);
                colorIndex++;
            }
        }

        return svgDoc;
    }

    createClusterIconUrl(svgDoc) {
        let serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgDoc);
        let blob = new Blob([svgString], { type: 'image/svg+xml' });
        let url = URL.createObjectURL(blob);

        return url;
    }

    removeLayerWFS(layerName) {
        const imageryLayers = this.viewer._dataSourceCollection._dataSources;
        const numLayers = imageryLayers.length;

        for (let i = 0; i < numLayers; i++) {
            const layer = imageryLayers.get(i);

            if (layer._imageryProvider._layers === layerName) {
                imageryLayers.remove(layer);
                return;
            }
        }
    }

    removeAllLayers() {
        const imageryLayers = this.viewer.imageryLayers;
        imageryLayers.removeAll();
    }

    getActiveLayers() {
        const imageryLayers = this.viewer.imageryLayers._layers;
        return imageryLayers;
    }

    removeAllEntities(entities) {
        const entitiesToRemove = [];

        for (const entity of entities.values) {
            if (entity.name !== 'user-position') {
                entitiesToRemove.push(entity);
            }
        }

        for (const entityToRemove of entitiesToRemove) {
            entities.remove(entityToRemove);
        }
    }

    async createRoute(jsonData, position, layers) {
        const entities = this.viewer.entities;
        this.removeAllEntities(entities);

        if (layers == null) return;

        let features = [];

        await Promise.all(layers.map(async layer => {
            const data = await this.fetchEntitiesData(layer);
            data.features.forEach(feature => {
                if (feature.geometry.type == 'Point' || feature.geometry.type == 'MultiPoint') {
                    features.push(feature);
                }
            });
        }));

        const featuresByProximity = this.orderFeaturesByProximity(position, features);

        let i = 1;
        let startingPosition = [position.coords.longitude, position.coords.latitude];

        featuresByProximity.forEach(feature => {
            const endingPosition = this.findFeatureCoordinates(feature);
            this.createPointsOrderLabels(endingPosition, i);
            i++;
            startingPosition = endingPosition;
        });

        featuresByProximity.forEach(f => {
            const layerToFind = this.getLayerToFind(f);
            const layer = this.filterLayerByName(jsonData, layerToFind);
            f.layer = layer.layer;
            f.name = layer.name;
            f.relevant_properties = layer.relevant_properties;
        });

        featuresByProximity.forEach(f => {
            f.properties = Object.entries(f.properties).reduce((acc, [key, value]) => {
                const matchingProperty = f.relevant_properties.find(rp => rp.property_name === key);
                if (matchingProperty) {
                    acc[matchingProperty.display_name] = value;
                }
                return acc;
            }, {});
        });

        let featuresToExport = [];

        featuresByProximity.forEach(f => {
            const feature = {};
            const properties = f.properties;
            properties.Title = f.name;
            feature.properties = properties;

            let longitude;
            let latitude;
            if (Array.isArray(f.geometry.coordinates)) {
                if (f.geometry.coordinates.length == 1) {
                    longitude = f.geometry.coordinates[0][0];
                    latitude = f.geometry.coordinates[0][1];
                    const coordinates = { longitude, latitude };
                    feature.coordinates = coordinates;
                } else if (f.geometry.coordinates.length == 2) {
                    longitude = f.geometry.coordinates[0];
                    latitude = f.geometry.coordinates[1];
                    const coordinates = { longitude, latitude };
                    feature.coordinates = coordinates;
                }
            }
            
            featuresToExport.push(feature);
        });

        this.viewer.zoomTo(entities);

        return featuresToExport;
    }

    orderFeaturesByProximity(position, features) {
        let featuresByProximity = [];
        let startingPosition = [position.coords.longitude, position.coords.latitude];

        while (features.length != 0) {
            let shortestDistance = Infinity;
            let shortestDistanceIndex = -1;

            for (let i = 0; i < features.length; i++) {
                let feature = features[i];
                const distance = this.calculateDistance(startingPosition, feature);

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    shortestDistanceIndex = i;
                }
            }

            featuresByProximity.push(features[shortestDistanceIndex]);
            features.splice(shortestDistanceIndex, 1);
        }

        return featuresByProximity;
    }

    async fetchEntitiesData(obj) {
        const url = `${obj.layer_url_wfs}?service=WFS&typeName=${obj.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Errore durante la richiesta fetch:', error);
            throw error;
        }
    }

    calculateDistance(initialPosition, feature) {
        const endingPosition = this.findFeatureCoordinates(feature);

        const start = Cesium.Cartographic.fromDegrees(initialPosition[0], initialPosition[1]);
        const end = Cesium.Cartographic.fromDegrees(endingPosition[0], endingPosition[1]);
        const ellipsoidGeodesic = new Cesium.EllipsoidGeodesic(start, end);
        const distance = ellipsoidGeodesic.surfaceDistance;
        return distance;
    }

    findFeatureCoordinates(feature) {
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

    createPointsOrderLabels(coordinates, pathIndex) {
        const positionX = coordinates[0];
        const positionY = coordinates[1];
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(positionX, positionY, 1.0),
            label: {
                text: `${pathIndex}`,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20),
                scale: 0.5,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
                fillColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE
            }
        });
    }

    setCamera() {
        const initialPosition = Cesium.Cartesian3.fromDegrees(
            8.909041078781357,
            44.410209942448475,
            4000
        )

        this.viewer.camera.flyTo({
            destination: initialPosition,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0
            }
        })
    }

    setCameraToUserPosition(userPosition) {
        const initialPosition = Cesium.Cartesian3.fromDegrees(
            userPosition.coords.longitude,
            userPosition.coords.latitude,
            4000
        )

        this.viewer.camera.flyTo({
            destination: initialPosition,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0
            }
        })
    }

    createUserPin(userPosition) {
        this.viewer.entities.add({
            name: "user-position",
            position: Cesium.Cartesian3.fromDegrees(userPosition.coords.longitude, userPosition.coords.latitude, 0.0),
            // cylinder: {
            //     length: 40.0,
            //     topRadius: 10.0,
            //     bottomRadius: 10.0,
            //     material: Cesium.Color.GREEN.withAlpha(1)
            // },
            ellipse: {
                semiMinorAxis: 20.0,
                semiMajorAxis: 20.0,
                height: 0.0,
                material: Cesium.Color.BLUE,
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 200.0
            }
        })
    }

    async addBuilding() {
        const buildingTileset = await Cesium.createOsmBuildingsAsync();
        this.viewer.scene.primitives.add(buildingTileset);
    }
}