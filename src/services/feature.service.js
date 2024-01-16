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
        console.log(pickedEntity);
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
}