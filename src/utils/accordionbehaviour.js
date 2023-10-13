export const accordionBehaviour = (categoryAccordion, layerAccordion) => {
    categoryAccordion.forEach(item => {
        item.addEventListener('accordionChanged', (event) => {

            categoryAccordion.forEach(item => {
                if (item != event.target) {
                    item.setAttribute('is-active', 'false');
                }
            });

            layerAccordion.forEach(item => {
                item.setAttribute('is-active', 'false');
            });
        });
    });

    layerAccordion.forEach(item => {
        item.addEventListener('accordionChanged', (event) => {

            layerAccordion.forEach(item => {
                if (item != event.target) {
                    item.setAttribute('is-active', 'false');
                }
            });

        });
    });
}