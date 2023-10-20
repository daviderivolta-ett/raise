export const createInfobox = (allElements, info, div) => {
    let elementsCounter = 0;
    let isElementPresent = false;

    allElements.forEach(element => {
        if (element.getAttribute('data') === JSON.stringify(info)) {
            isElementPresent = true;
        }
    });

    if (!isElementPresent && info) {
        const element = document.createElement('app-infobox');

        element.setAttribute('data', JSON.stringify(info));
        elementsCounter++;
        element.setAttribute('uuid', elementsCounter);
        div.append(element);
    }
}