import * as Cesium from 'cesium';
import cesiumCss from 'cesium/Build/Cesium/Widgets/widgets.css?raw';

export default class CesiumViewer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        /** @type { Cesium.Viewer } */
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
            this.mouseOver(movement)
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // css
        const style = document.createElement('style');
        style.innerHTML = cesiumCss;
        this.shadow.append(style);
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
            duration: 0
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

    async loadLayers(layers) {
        const requests = layers.map(layer => this.createlayer(layer).then((data) => ({ layer, data })));

        await Promise.all(requests).then(async sources => {
            this.viewer.dataSources.removeAll();

            await Promise.all(sources.map(async source => {
                const layer = await source.data.layer;
                this.viewer.dataSources.add(layer);
            }));
        });
    }

    async createlayer(layer) {
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
}

customElements.define('app-cesium', CesiumViewer);