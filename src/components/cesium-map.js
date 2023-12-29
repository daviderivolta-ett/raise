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

    getFeature(movement, data) {
        const windowPosition = movement.position;
        const pickedEntity = this.viewer.scene.pick(windowPosition);

        if (!pickedEntity || pickedEntity == null) return;

        const layerToFind = this.getLayerName(pickedEntity.id.id);
        const layer = this.getLayerByName(data, layerToFind);

        const properties = this.getRelevantProperties(pickedEntity.id.properties, layer.relevant_properties);
        let feature;

        let coordinates;
        if (pickedEntity.id.point) {
            let cartesian = pickedEntity.id.position._value;
            coordinates = this.checkCoordinates(cartesian);
            feature = Feature.fromPoint(properties, layer, coordinates);
        }

        if (pickedEntity.id.polyline) {
            let cartesian = pickedEntity.id.polyline.positions._value;
            coordinates = this.checkCoordinates(cartesian);
            feature = Feature.fromPolyline(properties, layer, coordinates);
        }

        return feature;
    }

    getLayerName(id) {
        let layer;
        switch (true) {
            case id.includes('.'):
                layer = id.split('.')[0];
                break;
            case id.includes('/'):
                layer = id.split('/')[0];
                break;
            default:
                break;
        }
        return layer;
    }

    getLayerByName(data, layerName) {
        for (const key in data) {
            const currentValue = data[key];
            if (Array.isArray(currentValue) || typeof currentValue === 'object') {
                const result = this.getLayerByName(currentValue, layerName);
                if (result) return result;
            } else if (typeof currentValue === 'string' && currentValue.includes(layerName)) {
                return data;
            }
        }
        return null;
    }

    getRelevantProperties(data, properties) {
        const risultati = {};

        if (properties) {
            for (const obj of properties) {
                if (obj.property_name && data[obj.property_name]) {
                    if (data[obj.property_name]._value) {
                        risultati[obj.display_name] = data[obj.property_name]._value;
                    } else {
                        risultati[obj.display_name] = data[obj.property_name];
                    }
                }
            }

            risultati["raiseName"] = data.raiseName._value;

            return risultati;
        }

        return risultati;
    }

    checkCoordinates(cartesian) {
        if (Array.isArray(cartesian)) {
            let coordinates = []
            cartesian.map(item => {
                let pair = this.cartesianToCartographic(item);
                coordinates.push(pair);
            });
            return coordinates;
        } else {
            let coordinates = this.cartesianToCartographic(cartesian);
            return coordinates;
        }
    }

    cartesianToCartographic(cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        longitude = parseFloat(longitude.toFixed(8));
        latitude = parseFloat(latitude.toFixed(8));
        return { longitude, latitude };
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