import * as Cesium from 'cesium';
import cesiumCss from 'cesium/Build/Cesium/Widgets/widgets.css?raw';

export default class CesiumViewer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }

    connectedCallback() {
        // html
        this.viewer = new Cesium.Viewer(this.shadow, {
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
        });

        // css
        const style = document.createElement('style');
        style.innerHTML = cesiumCss;
        this.shadow.append(style);
    }
}

customElements.define('app-cesium', CesiumViewer);