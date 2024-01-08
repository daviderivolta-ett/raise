import * as Cesium from 'cesium';
import cesiumCss from 'cesium/Build/Cesium/Widgets/widgets.css?raw';
import { Feature } from '../models/Feature.js';

export default class CesiumViewer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
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
        });

        this.viewer.screenSpaceEventHandler.setInputAction(movement => {
            this.dispatchEvent(new CustomEvent('map-click', { detail: { movement } }));
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.viewer.screenSpaceEventHandler.setInputAction(movement => {
            this.mouseOver(movement)
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

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
        const initialPosition = Cesium.Cartesian3.fromDegrees(
            position.longitude,
            position.latitude,
            4000
        )

        this.viewer.camera.flyTo({
            destination: initialPosition,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0
            },
            duration: 0.5
        })
    }

    createUserPin(position) {
        this.viewer.entities.add({
            name: 'user_pin',
            position: Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, 0.0),
            ellipse: {
                semiMinorAxis: 20.0,
                semiMajorAxis: 20.0,
                height: 0.0,
                material: Cesium.Color.BLUE,
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 200
            }
        });
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


    changeTheme(theme) {
        const themeLayerToRemove = this.viewer.imageryLayers._layers[1];
        this.viewer.imageryLayers.remove(themeLayerToRemove);

        if (Object.keys(theme).length != 0) {
            const style = this.getImageryProvider(theme.url, theme.layer, theme.credit);
            this.viewer.imageryLayers.addImageryProvider(style);
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

    async loadLayers(layers) {
        const requests = layers.map(layer => this.createlayer(layer).then((data) => ({ layer, data })));

        await Promise.all(requests).then(async sources => {
            this.viewer.dataSources.removeAll();

            await Promise.all(sources.map(async source => {
                const layer = await source.data.layer;
                this.viewer.dataSources.add(layer);
                this.styleEntities(layer, source.layer.style);
            }));
        });
    }

    async createlayer(layer) {
        const url = `${layer.layer_url_wfs}?service=WFS&typeName=${layer.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;
        return fetch(url)
            .then(res => res.json())
            .then(geoJson => this.createAdditionalProperties(geoJson, layer.name))
            .then(geoJson => ({
                features: geoJson.features,
                layer: Cesium.GeoJsonDataSource.load(geoJson)
            }))
            .catch(err => {
                console.error(err);
                throw err;
            });
    }

    createAdditionalProperties(geoJson, name) {
        geoJson.features = geoJson.features.map((f, i) => {
            f.properties.raiseName = name + ' ' + i;
            return f;
        });
        return geoJson;
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