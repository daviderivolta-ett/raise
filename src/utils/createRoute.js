export const createRoute = async (position, allCheckboxLists, viewer) => {
    for (const checkboxList of allCheckboxLists) {
        checkboxList.addEventListener('navigationTriggered', async (event) => {

            const entities = viewer.viewer.entities;
            entities.values.forEach(async entity => {
                if (entity.polyline !== undefined) {
                    await entities.remove(entity);
                }
            });

            const navigationData = JSON.parse(event.detail.newValue);
            if (navigationData != null) {           
                viewer.createPolyline(position, navigationData);
            }         
        })
    }
}