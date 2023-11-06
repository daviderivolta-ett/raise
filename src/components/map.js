import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

export default class CesiumViewer {

    constructor() {
        const element = document.querySelector('app-map');

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMmEyNDlkYS1iYTg4LTQ4MDktOTU0ZS05Yjg2ZTcyZGI1ZGMiLCJpZCI6MTY5MDU3LCJpYXQiOjE2OTU5MDI3ODB9.xSyAfYggSQ_UaYmqQLfI4Rf-Hl_Ip0ubYKLQakKadvA';

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

        // this.viewer.imageryLayers.addImageryProvider(CesiumViewer.getImageryProvider());
        this.viewer.screenSpaceEventHandler.setInputAction(this.onClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    changeTheme(stringifiedTheme) {
        const theme = JSON.parse(stringifiedTheme);
        const mapStyle = new Cesium.WebMapTileServiceImageryProvider({
            url: theme.url,
            layer: theme.layer,
            style: 'default',
            format: 'image/jpeg',
            maximumLevel: 19,
            tileMatrixSetID: 'default',
            credit: new Cesium.Credit(theme.credit)
        })
        this.viewer.imageryLayers.addImageryProvider(mapStyle);
    }

    static getImageryProvider() {
        return new Cesium.WebMapTileServiceImageryProvider({
            url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{TileMatrix}/{TileCol}/{TileRow}.png',
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

    addLayerWMS(wmsUrl, wmsLayerName) {
        const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
            url: wmsUrl,
            layers: wmsLayerName,
            // parameters: wmsParameters
        });

        console.log(this.viewer.imageryLayers);
        this.viewer.imageryLayers.addImageryProvider(wmsImageryProvider);
        console.log(this.viewer.imageryLayers);
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

                // console.log(geoJson);

                // Style data
                this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geoJson, {
                    stroke: Cesium.Color[strokeColor].withAlpha(parseFloat(opacity)),
                    strokeWidth: 2,
                    fill: Cesium.Color[fillColor].withAlpha(parseFloat(opacity)),
                }))

                    .then(dataSource => {

                        // Clustering
                        dataSource.entities.values.forEach(entity => {
                            entity.billboard = undefined,
                                entity.point = new Cesium.PointGraphics({
                                    pixelSize: 18,
                                    color: Cesium.Color[markerColor].withAlpha(parseFloat(opacity)),
                                    outlineColor: Cesium.Color[markerColor].withAlpha(parseFloat(opacity)),
                                    outlineWidth: 2
                                })
                        })

                        const pixelRange = 100;
                        const minimumClusterSize = 3;
                        const enabled = true;

                        dataSource.clustering.enabled = enabled;
                        dataSource.clustering.pixelRange = pixelRange;
                        dataSource.clustering.minimumClusterSize = minimumClusterSize;

                        let removeListener;

                        if (Cesium.defined(removeListener)) {
                            removeListener();
                            removeListener = undefined;
                        } else {
                            removeListener = dataSource.clustering.clusterEvent.addEventListener(
                                function (clusteredEntities, cluster) {

                                    // Points
                                    cluster.billboard.show = false;
                                    cluster.point.show = true;
                                    cluster.point.pixelSize = 48;

                                    if (clusteredEntities.length >= 50) {
                                        cluster.point.color = Cesium.Color.RED.withAlpha(parseFloat(opacity));
                                        cluster.point.outlineColor = Cesium.Color.RED;
                                    } else if (clusteredEntities.length >= 40) {
                                        cluster.point.color = Cesium.Color.ORANGE.withAlpha(parseFloat(opacity));
                                        cluster.point.outlineColor = Cesium.Color.ORANGE;
                                    } else if (clusteredEntities.length >= 30) {
                                        cluster.point.color = Cesium.Color.YELLOW.withAlpha(parseFloat(opacity));
                                        cluster.point.outlineColor = Cesium.Color.YELLOW;
                                    } else if (clusteredEntities.length >= 20) {
                                        cluster.point.color = Cesium.Color.GREEN.withAlpha(parseFloat(opacity));
                                        cluster.point.outlineColor = Cesium.Color.GREEN;
                                    } else if (clusteredEntities.length >= 10) {
                                        cluster.point.color = Cesium.Color.BLUE.withAlpha(parseFloat(opacity));
                                        cluster.point.outlineColor = Cesium.Color.BLUE;
                                    } else {
                                        cluster.point.color = Cesium.Color.VIOLET.withAlpha(parseFloat(opacity));
                                        cluster.point.outlineColor = Cesium.Color.VIOLET;
                                    }

                                    // Labels
                                    cluster.label.show = true;
                                    cluster.label.text = clusteredEntities.length.toLocaleString();
                                    cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
                                    cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                                    cluster.label.pixelOffset = new Cesium.Cartesian2(0.0, 0.0);
                                    cluster.label.pixelOffsetScaleByDistance = undefined;
                                    cluster.label.position.z += 5;
                                }
                            );
                        }
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
            name: "Green cylinder with black outline",
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
}