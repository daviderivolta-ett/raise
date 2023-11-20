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

    changeTheme (theme) {
        const themeLayerToRemove = this.viewer.imageryLayers._layers[1];
        this.viewer.imageryLayers.remove(themeLayerToRemove);
    
        if (theme != '') {
            theme = JSON.parse(theme);
            const style = this.getImageryProvider(theme.url, theme.layer, theme. credit);
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

    async onClick(movement, jsonData, div, drawerToggle, infoboxCounter, isNavigation) {
        drawerToggle.setAttribute('is-open', 'false');
        const windowPosition = movement.position;
        const pickedEntity = this.viewer.scene.pick(windowPosition);
        if (!pickedEntity) return;
        if (pickedEntity == null) return;
        const features = pickedEntity.id;
        if (Array.isArray(pickedEntity.id)) this.viewer.zoomTo(features);
        if (typeof features === 'object' && !Array.isArray(features)) {
            if (isNavigation == false) {
                const infoContent = await this.handleFeatures(features, jsonData);
                let allInfoBoxes = document.querySelectorAll('app-infobox');

                if (infoContent) {
                    if (Object.keys(infoContent).length !== 0) {
                        this.createInfobox(infoboxCounter, allInfoBoxes, infoContent, div);
                    }
                }

            } else {
                this.startNavigation(windowPosition);
            }
        }
    }

    async handleFeatures(features, jsonData) {
        if (features != null) {

            let layerToFind = '';

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

            const foundLayer = this.filterLayerByName(jsonData, layerToFind);
            const foundLayerName = foundLayer.name;
            const relevantProperties = foundLayer.relevant_properties;

            const properties = this.getRelevantProperties(features.properties, relevantProperties, foundLayerName);
            // console.log(properties);

            return properties;
        }
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

    async handleCheckbox(activeLayers, clusterIcons) {
        const requests = activeLayers.map(layer => this.fetchLayerData(layer).then(data => ({ layer, data })));

        await Promise.all(requests).then(sources => {
            this.viewer.dataSources.removeAll();
            sources.forEach(async source => {
                this.viewer.dataSources.add(source.data);
                await this.styleEntities(source.data, source.layer.style);
            });
        });
        await this.clusterAllEntities(clusterIcons);
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
            .then(geoJson => Cesium.GeoJsonDataSource.load(geoJson))
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
        })
    }

    async clusterAllEntities(clusterIcons) {
        const color = 'WHITE';
        const combinedDataSource = new Cesium.CustomDataSource();

        const dataSources = this.viewer.dataSources;

        for (let i = 0; i < dataSources.length; i++) {
            dataSources.get(i).entities.values.forEach(entity => {
                combinedDataSource.entities.add(entity);
            });
        }

        const combinedDataSourceIndex = dataSources.indexOf(combinedDataSource);
        for (let i = dataSources.length - 1; i >= 0; i--) {
            if (i !== combinedDataSourceIndex) dataSources.remove(dataSources.get(i));
        }

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

        this.viewer.dataSources.add(combinedDataSource);
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

    async createRoute(position, navigationData) {
        const entities = this.viewer.entities;
        this.removeAllEntities(entities);

        if (navigationData == null) return;
        const data = await this.fetchEntitiesData(navigationData);
        const features = data.features;

        let startingPosition = [position.coords.longitude, position.coords.latitude];
        let pathIndex = 1;
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

            const endingPosition = this.findFeatureCoordinates(features[shortestDistanceIndex]);

            // viewer.createRoute(startingPosition, endingPosition, pathIndex);
            this.createPointsOrderLabels(endingPosition, pathIndex);

            if (shortestDistanceIndex !== -1) {
                features.splice(shortestDistanceIndex, 1);
            }

            pathIndex++;
            startingPosition = endingPosition;
        }

        this.viewer.zoomTo(entities);
    }

    async fetchEntitiesData(obj) {
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
                fillColor: Cesium.Color.WHITE
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
            position: Cesium.Cartesian3.fromDegrees(userPosition.coords.longitude, userPosition.coords.latitude, 20.0),
            cylinder: {
                length: 40.0,
                topRadius: 10.0,
                bottomRadius: 10.0,
                material: Cesium.Color.GREEN.withAlpha(1)
            },
        })
    }

    async addBuilding() {
        const buildingTileset = await Cesium.createOsmBuildingsAsync();
        this.viewer.scene.primitives.add(buildingTileset);
    }

    zoom(btn) {
        switch (btn.getAttribute('zoom-type')) {
            case "in":
                btn.addEventListener('click', () => {
                    this.viewer.camera.zoomIn(500.0);
                });
                break;

            case "out":
                btn.addEventListener('click', () => {
                    this.viewer.camera.zoomOut(500.0);
                });
                break;

            default:
                break;
        }
    }
}