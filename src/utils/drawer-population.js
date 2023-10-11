// Import configs
import { fetchJsonData } from '../settings.js';
const jsonData = await fetchJsonData();

// Generate drawer
export const populateDrawer = () => {
    jsonData.categories.forEach(item => {
        const categoryAcordion = document.createElement('app-accordion');
        drawer.append(categoryAcordion);

        categoryAcordion.setAttribute('title', item.name);

        item.groups.forEach(item => {
            const layerAccordion = document.createElement('app-accordion');
            categoryAcordion.append(layerAccordion);
            layerAccordion.setAttribute('title', item.name);

            const checkboxList = document.createElement('app-checkbox-list');
            checkboxList.setAttribute('input', JSON.stringify(item.layers));
            layerAccordion.append(checkboxList);
        });
    });
}