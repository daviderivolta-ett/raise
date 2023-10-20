export const handleInfoBox = (infoBoxes, infoBoxesPosition) => {

    infoBoxes.forEach(infoBox => {
        infoBox.addEventListener('positionChanged', (event) => {
            registerPosition(infoBox, infoBoxesPosition, event);
        });
    });
}

function isPresent() {

}

function registerPosition(infoBox, infoBoxesPosition, event) {
    const infoBoxPosition = {
        uuid: infoBox.getAttribute('uuid'),
        position: JSON.parse(event.detail.newValue)
    }

    const existingIndex = infoBoxesPosition.findIndex(item => item.uuid === infoBoxPosition.uuid);
    if (existingIndex === -1) {
        infoBoxesPosition.push(infoBoxPosition);
    } else {
        infoBoxesPosition[existingIndex].position = infoBoxPosition.position;
    }

    console.log(infoBoxesPosition);
}