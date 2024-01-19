import { Feature } from './Feature.js';

export class Route {
    constructor(name, features, type, lastSelected) {
        this.name = name;
        this.features = features.map(featureData => new Feature(
            featureData.properties,
            featureData.layer,
            featureData.startingCoordinates,
            featureData.coordinatesArray
        ));
        this.type = type;
        this.lastSelected = lastSelected;
    }
}