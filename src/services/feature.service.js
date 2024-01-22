import { Feature } from '../models/Feature.js';
import * as Cesium from 'cesium';

export class FeatureService {
    _instance;

    constructor() {
        if (FeatureService._instance) {
            return FeatureService._instance;
        }
        FeatureService._instance = this;
    }

    static get instance() {
        if (!FeatureService._instance) {
            FeatureService._instance = new FeatureService();
        }
        return FeatureService._instance;
    }

    getFeature(pickedEntity, data) {
        const layerToFind = this.getLayerName(pickedEntity.id);
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

        if (pickedEntity.id.polygon) {
            let cartesian = pickedEntity.id.polygon.hierarchy._value.positions;
            coordinates = this.checkCoordinates(cartesian);
            let center = this.getPolygonCenter(pickedEntity.id.polygon);
            feature = Feature.fromPolygon(properties, layer, center, coordinates);
        }

        return feature;
    }

    getLayerName(id) {
        let layer;
        layer = id.properties.layerName._value;
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

    getRelevantProperties(entity, properties) {
        const relevantProperties = {};
        if (!properties) return;

        for (const property of properties) {
            if (entity[property.property_name]) {
                let p = {
                    property_name: property.property_name,
                    display_name: property.display_name,
                    type: property.type,
                }

                typeof entity[property.property_name]._value == 'string' ? p.value = entity[property.property_name]._value : p.value = entity[property.property_name]._value.value;

                relevantProperties[property.property_name] = p;
            }
        }

        relevantProperties["raiseName"] = entity.raiseName._value;
        relevantProperties["layerName"] = entity.layerName._value;

        return relevantProperties;
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

    getPolygonCenter(polygon) {
        const positions = polygon.hierarchy.getValue().positions;

        if (positions && positions.length == 0) return;
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < positions.length; i++) {
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            sumX += Cesium.Math.toDegrees(cartographic.longitude);
            sumY += Cesium.Math.toDegrees(cartographic.latitude);
        }

        let centerX = sumX / positions.length;
        let centerY = sumY / positions.length;

        return { latitude: centerY, longitude: centerX };
    }

    createGeoJson(features) {
        const geoJsonFeatures = features.map(f => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [f.startingCoordinates.longitude, f.startingCoordinates.latitude]
            },
            properties: f.properties
        }));

        const geoJson = {
            type: "FeatureCollection",
            features: geoJsonFeatures
        };

        return geoJson;
    }
}