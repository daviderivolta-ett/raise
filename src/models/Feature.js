export class Feature {
    constructor(properties, layer, startingCoordinates, coordinatesArray = []) {
        this.properties = properties;
        this.layer = layer;
        this.startingcoordinates = startingCoordinates;
        this.coordinatesArray = coordinatesArray;
        if (this.coordinatesArray.length === 0) this.coordinatesArray.push(startingCoordinates);
    }

    get id() {
        return this.layer.layer + this.startingcoordinates.latitude + this.startingcoordinates.longitude;
    }

    static fromPoint(properties, layer, startingCoordinates) {
        return new Feature(properties, layer, startingCoordinates);
    }

    static fromPolyline(properties, layer, coordinatesArray) {
        return new Feature(properties, layer, coordinatesArray[0], coordinatesArray);
    }
}