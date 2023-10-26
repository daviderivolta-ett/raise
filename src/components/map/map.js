import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

export default class CesiumViewer {

    constructor() {
        const element = document.querySelector('app-map');

        this.viewer = new Cesium.Viewer(element, {
            //imageryProvider: CesiumViewer.getImageryProvider(),
            baseLayerPicker: false,
            geocoder: false,
            timeline: false,
            animation: false,
            homeButton: false,
            navigationInstructionsInitiallyVisible: true,
            navigationHelpButton: false,
            sceneModePicker: false,
            fullscreenButton: false,
            // infoBox: false
            // terrain: Cesium.Terrain.fromWorldTerrain()
        });

        // this.viewer.imageryLayers.addImageryProvider(CesiumViewer.getImageryProvider());
        this.toColor = false;
        this.viewer.screenSpaceEventHandler.setInputAction(this.onClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    static getImageryProvider() {
        return new Cesium.WebMapTileServiceImageryProvider({
            // url: 'https://c.basemaps.cartocdn.com/light_nolabels/{TileMatrix}/{TileCol}/{TileRow}.png',
            url: 'https://c.basemaps.cartocdn.com/rastertiles/voyager/{TileMatrix}/{TileCol}/{TileRow}.png',
            layer: 'carto-light',
            style: 'default',
            format: 'image/jpeg',
            maximumLevel: 19,
            tileMatrixSetID: 'default',
            credit: new Cesium.Credit('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>')
        });
    }

    async onClick(windowPosition) {
        // const pickRay = this.viewer.camera.getPickRay(windowPosition);
        // const featuresPromise = this.viewer.imageryLayers.pickImageryLayerFeatures(pickRay, this.viewer.scene);

        // if (!Cesium.defined(featuresPromise)) {
        //     console.log('No features picked.');
        //     return null;

        // } else {

        //     try {
        //         const features = await Promise.resolve(featuresPromise);
        //         console.log(`Number of features: ${features.length}`);

        //         if (features.length > 0) {
        //             return features[0];

        //         } else {
        //             console.log(null);
        //             return null;
        //         }

        //     } catch (error) {
        //         console.error('Errore nella raccolta delle features:', error);
        //         return null;
        //     }
        // }

        const pickedEntity = this.viewer.scene.pick(windowPosition);

        if (pickedEntity) {
            const features = pickedEntity.id;
            return features;
        }
    }

    addLayerWMS(wmsUrl, wmsLayerName, wmsParameters) {
        const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
            url: wmsUrl,
            layers: wmsLayerName,
            parameters: wmsParameters
        });

        this.viewer.imageryLayers.addImageryProvider(wmsImageryProvider);
    }

    removeLayerWMS(layerName) {
        const imageryLayers = this.viewer.imageryLayers;
        const numLayers = imageryLayers.length;

        for (let i = 0; i < numLayers; i++) {
            const layer = imageryLayers.get(i);

            if (layer._imageryProvider._layers === layerName) {
                imageryLayers.remove(layer);
                return;
            }
        }
    }

    addLayersWFS(wfsUrl, layerName, style) {
        let strokeColor = 'YELLOW';
        let fillColor = 'YELLOW';
        let markerColor = 'YELLOW';
        let opacity = 0.5;

        if (style && style.color) {
            strokeColor = style.color.toUpperCase();
            fillColor = style.color.toUpperCase();
            markerColor = style.color.toUpperCase();
        }

        if (style && style.opacity) {
            opacity = style.opacity;
        }

        const url = `${wfsUrl}?service=WFS&typeName=${layerName}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`
        fetch(url)
            .then(response => response.json())
            .then(geoJson => {

                const geoJsonLayer = this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geoJson, {
                    stroke: Cesium.Color[strokeColor].withAlpha(parseFloat(opacity)),
                    strokeWidth: 2,
                    fill: Cesium.Color[fillColor].withAlpha(parseFloat(opacity)),
                }))
                    .then(dataSource => {
                        dataSource.entities.values.forEach(entity => {
                            entity.billboard = undefined,
                                entity.point = new Cesium.PointGraphics({
                                    pixelSize: 18,
                                    color: Cesium.Color[markerColor].withAlpha(parseFloat(opacity)),
                                    outlineColor: Cesium.Color[markerColor].withAlpha(parseFloat(opacity)),
                                    outlineWidth: 2
                                })
                        })
                    })
            })
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

    async addBuilding() {
        const buildingTileset = await Cesium.createOsmBuildingsAsync();
        this.viewer.scene.primitives.add(buildingTileset);
    }
}