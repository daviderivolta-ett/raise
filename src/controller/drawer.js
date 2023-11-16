export function populateDrawer(jsonData, div) {
    jsonData.categories.forEach(item => {
        const categoryAccordion = document.createElement('app-accordion');

        categoryAccordion.setAttribute('title', item.name);
        categoryAccordion.classList.add('category-accordion');

        item.groups.forEach((item, index, array) => {
            const layerAccordion = document.createElement('app-accordion');
            if (index === array.length - 1) {
                layerAccordion.classList.add('last-accordion');
            }

            layerAccordion.setAttribute('title', item.name);
            layerAccordion.classList.add('layer-accordion');

            const checkboxList = document.createElement('app-checkbox-list');
            checkboxList.setAttribute('input', JSON.stringify(item.layers));
            layerAccordion.append(checkboxList);

            categoryAccordion.append(layerAccordion);
            div.append(categoryAccordion);
        });
    });
}

export const accordionBehaviour = (allCategoryAccordions, allLayerAccordions) => {
    allCategoryAccordions.forEach(item => {
        item.addEventListener('accordionChanged', (event) => {

            allCategoryAccordions.forEach(item => {
                if (item != event.target) {
                    item.setAttribute('is-active', 'false');
                }
            });

            allLayerAccordions.forEach(item => {
                item.setAttribute('is-active', 'false');
            });
        });
    });

    allLayerAccordions.forEach(item => {
        item.addEventListener('accordionChanged', (event) => {

            allLayerAccordions.forEach(item => {
                if (item != event.target) {
                    item.setAttribute('is-active', 'false');
                }
            });

        });
    });
}

export function autocloseDrawer(drawer, toggle) {
    let timer;
    drawer.addEventListener('click', () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            toggle.setAttribute('is-open', 'false');
        }, 10000);
    });
}