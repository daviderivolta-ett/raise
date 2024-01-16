export class ColorManager {
    _hex;
    _rgba;

    constructor() {
        this.hex;
        this.rgba;
        this.opacity = 1;
    }

    get hex() {
        return this._hex;
    }

    set hex(hex) {
        this._hex = hex;
    }

    get rgba() {
        return this._rgba;
    }

    set rgba(rgba) {
        this._rgba = rgba;
    }

    convertHexToRgba(hexCode, opacity = this.opacity) {
        let hex = hexCode.replace('#', '');

        if (hex.length === 3) {
            hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        /* Backward compatibility for whole number based opacity values. */
        if (opacity > 1 && opacity <= 100) {
            opacity = opacity / 100;
        }

        this.rgba = `rgba(${r},${g},${b},${opacity})`;
        return this.rgba;
    }

    changeOpacity(rgbaString, opacity) {
        const rgbaValues = rgbaString.substring(5, rgbaString.length - 1);
        const valuesArray = rgbaValues.split(',');
        const [r, g, b] = valuesArray.map(value => parseInt(value));
        const updatedRgbaString = `rgba(${r},${g},${b},${opacity})`;
        return updatedRgbaString;
    }

}