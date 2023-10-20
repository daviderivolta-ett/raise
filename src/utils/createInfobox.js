let elementsCounter = 0;

export function createInfobox(allElements, info, div) {
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