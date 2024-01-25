import * as Cesium from 'cesium';
import cesiumCss from 'cesium/Build/Cesium/Widgets/widgets.css?raw';

import { EventObservable } from '../observables/EventObservable.js';
import { FeatureService } from '../services/feature.service.js';

import { SnackBarComponent } from './snackbar.component';

export default class CesiumViewer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.transitioner = null;
    }

    connectedCallback() {
        // html
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MjY2YmYxNy1mNTM2LTRlOWYtYTUyZC01ZmY0NjBhNzllMWEiLCJpZCI6MTY5MDU3LCJpYXQiOjE2OTU4ODQ4NzB9.bN66rOR5h37xuKVsuUSYRSLOGJy-34IhH9S1hr4NOOE';

        this.viewer = new Cesium.Viewer(this.shadow, {
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
            sceneMode: Cesium.SceneMode.SCENE2D,
            mapMode2D: Cesium.MapMode2D.ROTATE,
            mapProjection: new Cesium.WebMercatorProjection()
        });

        // js
        this.viewer.screenSpaceEventHandler.setInputAction(movement => {
            this.dispatchEvent(new CustomEvent('map-click', { detail: { movement } }));
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.viewer.screenSpaceEventHandler.setInputAction(movement => {
            this.mouseOver(movement)
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        EventObservable.instance.subscribe('customroute-load', geoJson => {
            this.loadCustomDataSource(geoJson, 'custom-route', '#01fdc0');
        });

        EventObservable.instance.subscribe('feature-selected', feature => {
            const geoJson = FeatureService.instance.createGeoJson([feature]);
            this.loadCustomDataSource(geoJson, 'selected-feature', '#185FD9');
        });

        EventObservable.instance.subscribe('customroutecard-click', feature => {
            const geoJson = FeatureService.instance.createGeoJson([feature]);
            this.loadCustomDataSource(geoJson, 'selected-feature', '#185FD9');
        });

        this.viewer.dataSources.dataSourceAdded.addEventListener(() => {
            const snackbar = document.querySelector('#loading-layer');
            if (snackbar) snackbar.remove();
        });

        // css
        const style = document.createElement('style');
        style.innerHTML = cesiumCss;
        this.shadow.append(style);

        const customStyle = document.createElement('link');
        customStyle.setAttribute('rel', 'stylesheet');
        customStyle.setAttribute('href', './css/cesium.css');
        this.shadow.append(customStyle);
    }

    getEntity(movement) {
        const windowPosition = movement.position;
        const pickedEntity = this.viewer.scene.pick(windowPosition);
        return pickedEntity;
    }

    setCameraToPosition(position) {
        let currentCameraPosition = this.viewer.camera.positionCartographic;
        currentCameraPosition.height > 2000000 ? currentCameraPosition.height = 2000 : currentCameraPosition.height;
        const initialPosition = Cesium.Cartesian3.fromDegrees(
            position.longitude,
            position.latitude,
            currentCameraPosition.height
        )

        this.viewer.camera.flyTo({
            destination: initialPosition,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0
            },
            duration: 0.5
        });
    }

    checkUserPin(position) {
        const userPin = this.viewer.entities.getById('user-pin');
        userPin ? this.updateUserPin(userPin, position) : this.createUserPin(position);
    }

    createUserPin(position) {
        this.viewer.entities.add({
            name: 'user_pin',
            id: 'user-pin',
            position: Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, 0.0),
            point: {
                pixelSize: 8,
                color: Cesium.Color.BLUE,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 1
            }
        });
    }

    updateUserPin(userPin, newPosition) {
        userPin.position = Cesium.Cartesian3.fromDegrees(newPosition.longitude, newPosition.latitude, 0.0);
    }

    mouseOver(movement) {
        const windowPosition = movement.endPosition;
        const pickedEntity = this.viewer.scene.pick(windowPosition);

        if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.id)) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    changeMapMode() {
        let currentMode = this.viewer.scene.mode;
        if (currentMode === Cesium.SceneMode.SCENE3D) {
            this.viewer.scene.morphTo2D(0);
        } else if (currentMode === Cesium.SceneMode.SCENE2D) {
            this.viewer.scene.morphTo3D(0);
        }

    }

    changeTheme(themeIndex) {
        for (let i = 0; i <= 2; i++) {
            if (i === themeIndex) {
                this.viewer.imageryLayers.get(i).show = true
            } else {
                this.viewer.imageryLayers.get(i).show = false;
            }
        }
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

    loadImageryProviders(layers) {
        layers.forEach(layer => {
            const style = this.getImageryProvider(layer.url, layer.layer, layer.credit);
            this.viewer.imageryLayers.addImageryProvider(style);
        });
    }

    async loadLayers(layers) {
        const requests = layers.map(layer => this.createlayer(layer).then((result) => {
            let req = {
                layer: layer,
                success: result.success,
                data: result.data
            }
            return req
        }));

        await Promise.all(requests).then(async sources => {

            const existingDataSourceNames = this.viewer.dataSources._dataSources.map(dataSource => dataSource.name);
            existingDataSourceNames.forEach(existingDataSourceName => {
                if (existingDataSourceName !== 'custom-route') {
                    const existingDataSource = this.viewer.dataSources.getByName(existingDataSourceName);
                    existingDataSource.forEach(dataSource => this.viewer.dataSources.remove(dataSource));
                }
            });

            // this.viewer.dataSources.removeAll();

            await Promise.all(sources.map(async source => {
                if (source.success) {
                    const dataSource = await source.data.layer;
                    dataSource.name = source.layer.layer;
                    this.viewer.dataSources.add(dataSource);
                    this.styleEntities(dataSource, source.layer.style);
                } else {
                    const loaderSnackbars = document.querySelectorAll('#loading-layer');
                    const errorSnackbars = document.querySelectorAll('#error-snackbar');
                    if (loaderSnackbars.length !== 0) loaderSnackbars.forEach(loader => loader.remove());
                    if (errorSnackbars.length !== 0) errorSnackbars.forEach(error => error.remove());
                    SnackBarComponent.createErrorSnackbar(source.layer.name);
                }

            }));
        });
    }

    async createlayer(layer) {
        const url = `${layer.layer_url_wfs}?service=WFS&typeName=${layer.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;

        try {
            const response = await fetch(url);
            const rawGeoJson = await response.json();
            const geoJson = await this.createAdditionalProperties(rawGeoJson, layer);

            return {
                success: true,
                data: {
                    features: geoJson.features,
                    layer: Cesium.GeoJsonDataSource.load(geoJson)
                }
            }
        } catch (err) {
            console.log('Problema nel recupero del layer');

            return {
                success: false,
                error: err
            }
        }
    }

    createAdditionalProperties(geoJson, layer) {
        geoJson.features = geoJson.features.map((f, i) => {
            f.properties.raiseName = layer.name + ' ' + i;
            f.properties.layerName = layer.layer;
            return f;
        });
        return geoJson;
    }

    async loadCustomDataSource(geoJson, dataSourceName, color) {
        const existingDataSources = this.viewer.dataSources.getByName(dataSourceName);

        existingDataSources.forEach(existingDataSource => {
            this.viewer.dataSources.remove(existingDataSource);
        });

        let dataSource = await Cesium.GeoJsonDataSource.load(geoJson);
        dataSource.name = dataSourceName;
        await this.viewer.dataSources.add(dataSource);
        this.styleCustomDataSource(dataSource, color);
    }

    styleCustomDataSource(dataSource, color) {
        dataSource.entities.values.forEach(entity => {
            entity.billboard = undefined;
            entity.point = new Cesium.PointGraphics({
                pixelSize: 16,
                color: Cesium.Color.fromCssColorString(color).withAlpha(0.01),
                outlineColor: Cesium.Color.fromCssColorString(color),
                outlineWidth: 3
            })
        });
    }

    styleEntities(dataSource, style) {
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
                    entity.polyline.material = Cesium.Color.fromCssColorString(fillColor).withAlpha(parseFloat(opacity));
                    entity.polyline.width = 2;
                    break;

                case Cesium.defined(entity.billboard):
                    entity.billboard = undefined;
                    entity.point = new Cesium.PointGraphics({
                        pixelSize: 8,
                        // color: Cesium.Color.fromCssColorString(markerColor).withAlpha(parseFloat(opacity)),
                        color: Cesium.Color.fromCssColorString(markerColor).withAlpha(0.5),
                        outlineColor: Cesium.Color.fromCssColorString(markerColor),
                        outlineWidth: 1
                    })
                    break;

                case Cesium.defined(entity.polygon):
                    entity.polygon.material = Cesium.Color.fromCssColorString(fillColor).withAlpha(parseFloat(opacity));
                    entity.polygon.outlineColor = Cesium.Color.fromCssColorString(fillColor).withAlpha(parseFloat(opacity));
                    break;

                default:
                    break;
            }
        });
    }
}

customElements.define('app-cesium', CesiumViewer);