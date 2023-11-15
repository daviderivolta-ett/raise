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
        // this.viewer.screenSpaceEventHandler.setInputAction(this.onClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
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

        if (!pickedEntity) return;

        if (Array.isArray(pickedEntity.id)) {
            this.viewer.zoomTo(pickedEntity.id);

            // pickedEntity.id.forEach(entity => {
            //     console.log(entity.point.color._value);
            // })
        }

        const features = pickedEntity.id;
        return features;
    }

    async fetchLayerData(wfsUrl, layerName) {
        const url = `${wfsUrl}?service=WFS&typeName=${layerName}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;
        return await fetch(url)
            .then(res => res.json())
            .then(geoJson => Cesium.GeoJsonDataSource.load(geoJson))
            .catch(err => err)
    }

    addLayer(promise) {
        promise.then(dataSource => {
            this.viewer.dataSources.add(dataSource)
        });
    }

    styleEntities(promise, style) {
        let fillColor = 'YELLOW';
        let markerColor = 'YELLOW';
        let opacity = 0.5;

        if (style && style.color) {
            fillColor = style.color.toUpperCase();
            markerColor = style.color.toUpperCase();
        }

        if (style && style.opacity) opacity = style.opacity;

        promise.then(dataSource => {
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

                    case Cesium.defined(entity.polygon):
                        entity.polygon.material = Cesium.Color[fillColor].withAlpha(parseFloat(opacity));
                        entity.polygon.outlineColor = Cesium.Color[fillColor].withAlpha(parseFloat(opacity));
                        break;

                    default:
                        break;
                }
            })
        })
    }

    // clusterEntities(promise, color) {
    //     promise.then(dataSource => {
    //         dataSource.clustering.enabled = true;
    //         dataSource.clustering.pixelRange = 25;
    //         dataSource.clustering.minimumClusterSize = 2;

    //         dataSource.clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
    //             cluster.label.show = false;
    //             cluster.billboard.show = true;
    //             cluster.billboard.color = Cesium.Color.fromCssColorString(color);
    //             cluster.billboard.scale = 0.38;

    //             switch (true) {
    //                 case clusteredEntities.length >= 4:
    //                     cluster.billboard.image = '/images/cluster/cluster-4.svg';
    //                     break;
    //                 case clusteredEntities.length == 3:
    //                     cluster.billboard.image = '/images/cluster/cluster-3.svg';
    //                     break;
    //                 case clusteredEntities.length == 2:
    //                     cluster.billboard.image = '/images/cluster/cluster-2.svg';
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         })
    //     })
    // }

    clusterAllEntities(promises, colors) {
        const color = colors[0];
        const combinedDataSource = new Cesium.CustomDataSource();

        const data = Promise.all(promises);
        data.then(async () => {
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

            ////
            // const icon = await this.fetchSvgIcon();
            // console.log(icon);
            ////

            const icon2 = await this.fetchSvgIcon(2);
            const icon3 = await this.fetchSvgIcon(3);
            const icon4 = await this.fetchSvgIcon(4);

            combinedDataSource.clustering.clusterEvent.addEventListener(async (clusteredEntities, cluster) => {
                cluster.label.show = false;
                cluster.billboard.show = true;
                cluster.billboard.color = Cesium.Color.fromCssColorString(color);
                cluster.billboard.scale = 0.38;
                cluster.billboard.id = cluster.label.id;

                //// TEST
                let colors = [];
                cluster.billboard.id.forEach(entity => {
                    colors.push(entity.point.color.getValue());
                });
                // console.log(colors);

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
        });

        this.viewer.dataSources.add(combinedDataSource);
    }

    async fetchSvgIcon(iconNumber) {
        try {
            const response = await fetch(`./images/cluster/cluster-${iconNumber}.svg`);
            const svgText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgText, 'image/svg+xml');
            return doc;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    styleClusterIcon(svgDoc, colors) {
        // let colors = ['yellow', 'greenyellow', 'cyan', 'steelblue'];
        let rgbColors = [];

        colors.forEach(color => {
            let red = Math.floor(color.red * 255);
            let green = Math.floor(color.green * 255);
            let blue = Math.floor(color.blue * 255);
            let obj = { red, green, blue }
            rgbColors.push(obj);
        });

        let colorIndex = 0;

        const circles = svgDoc.querySelectorAll('circle');

        for (let i = 0; i < circles.length; i++) {
            circles[i].setAttribute('fill', `rgb(${rgbColors[colorIndex].red}, ${rgbColors[colorIndex].green}, ${rgbColors[colorIndex].blue})`);
            colorIndex++;
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