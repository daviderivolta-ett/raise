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

    getRelevantProperties(data, properties) {
        const relevantProperties = {};

        if (!properties) return;

        for (const property of properties) {
            if (data[property.property_name]) {
                relevantProperties[property.display_name] = data[property.property_name]._value;
            }

            if (data[property.display_name]) {
                relevantProperties[property.display_name] = data[property.display_name]._value;
            }
        }

        relevantProperties["raiseName"] = data.raiseName._value;
        relevantProperties["layerName"] = data.layerName._value;

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
}