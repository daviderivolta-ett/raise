export const handleFeatures = (features, infoBox) => {

    if (features != null) {
        infoBox.setAttribute('data', JSON.stringify(features.properties));
        infoBox.classList.add('visible');
    } else {
        infoBox.classList.remove('visible');
    }
}