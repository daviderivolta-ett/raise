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