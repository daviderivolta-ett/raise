import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

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

        // this.viewer.imageryLayers.addImageryProvider(CesiumViewer.getImageryProvider());
        this.viewer.screenSpaceEventHandler.setInputAction(this.onClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    changeTheme(theme) {
        // const theme = JSON.parse(stringifiedTheme)
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

                // Load entities
                const dataSourcePromise = Cesium.GeoJsonDataSource.load(geoJson);
                dataSourcePromise.then(dataSource => {
                    this.viewer.dataSources.add(dataSource);
                })

                // Style entities
                dataSourcePromise.then(dataSource => {
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
                                    outlineColor: Cesium.Color[markerColor].withAlpha(parseFloat(opacity)),
                                    outlineWidth: 2
                                })
                                break;

                            default:
                                break;
                        }
                    })
                })

                // Cluster entities
                dataSourcePromise.then(dataSource => {
                    const pixelRange = 20;
                    const minimumClusterSize = 2;
                    const enabled = true;

                    dataSource.clustering.enabled = enabled;
                    dataSource.clustering.pixelRange = pixelRange;
                    dataSource.clustering.minimumClusterSize = minimumClusterSize;

                    dataSource.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
                        cluster.label.show = false;
                        cluster.billboard.show = true;
                        cluster.billboard.scale = 0.38;

                        switch (true) {
                            case clusteredEntities.length >= 4:
                                cluster.billboard.image = '/images/cluster/cluster-4.svg';
                                break;
                            case clusteredEntities.length == 3:
                                cluster.billboard.image = '/images/cluster/cluster-3.svg';
                                break;
                            case clusteredEntities.length == 2:
                                cluster.billboard.image = '/images/cluster/cluster-2.svg';
                                break;
                            default:
                                break;
                        }
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

    createRoute(startingCoordinates, endingCoordinates, pathIndex) {
        const coordinates = [];
        startingCoordinates.forEach(item => coordinates.push(item));
        endingCoordinates.forEach(item => coordinates.push(item));

        const color = '#4A89F3';

        this.viewer.entities.add({
            name: `path-${pathIndex}`,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(coordinates),
                width: 5,
                material: Cesium.Color.fromCssColorString(color),
                clampToGround: true,
            },
        });
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
}