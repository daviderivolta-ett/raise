// Import configs
import { fetchJsonData } from '../settings.js';
const jsonData = await fetchJsonData();

// Generate drawer
export const populateDrawer = () => {
    jsonData.categories.forEach(item => {
        const categoryAccordion = document.createElement('app-accordion');
        drawer.append(categoryAccordion);

        categoryAccordion.setAttribute('title', item.name);
        categoryAccordion.classList.add('category-accordion');

        item.groups.forEach((item, index, array) => {
            const layerAccordion = document.createElement('app-accordion');
            categoryAccordion.append(layerAccordion);

            layerAccordion.setAttribute('title', item.name);
            layerAccordion.classList.add('layer-accordion');

            if (index === array.length - 1) {
                layerAccordion.classList.add('last-accordion');
            }

            const checkboxList = document.createElement('app-checkbox-list');
            checkboxList.setAttribute('input', JSON.stringify(item.layers));
            layerAccordion.append(checkboxList);
        });
    });
}