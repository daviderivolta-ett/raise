export class TspService {
    _instance;

    constructor() {
        if (TspService._instance) return TspService._instance;
        TspService._instance = this;
    }

    static get instance() {
        if (!TspService._instance) {
            TspService._instance = new TspService();
        }
        return TspService._instance;
    }

    calculateDistance(coord1, coord2) {
        const dx = coord1.longitude - coord2.longitude;
        const dy = coord1.latitude - coord2.latitude;
        return Math.sqrt(dx * dx + dy * dy);
    }

    nearestInsertion(features, initialCoordinates) {
        const remainingFeatures = [...features];

        // Trova l'indice della feature più vicina rispetto alle coordinate iniziali
        let currentIndex = 0;
        let minDistance = this.calculateDistance(initialCoordinates, remainingFeatures[0].startingcoordinates);

        for (let i = 1; i < remainingFeatures.length; i++) {
            const distance = this.calculateDistance(initialCoordinates, remainingFeatures[i].startingcoordinates);
            if (distance < minDistance) {
                minDistance = distance;
                currentIndex = i;
            }
        }

        // Creare il percorso iniziale con la feature più vicina
        const path = [remainingFeatures.splice(currentIndex, 1)[0]];

        while (remainingFeatures.length > 0) {
            minDistance = Number.MAX_VALUE;
            let nextIndex;

            // Trova la feature più vicina rispetto al percorso corrente
            for (let i = 0; i < remainingFeatures.length; i++) {
                const distance = this.calculateDistance(path[path.length - 1].startingcoordinates, remainingFeatures[i].startingcoordinates);
                if (distance < minDistance) {
                    minDistance = distance;
                    nextIndex = i;
                }
            }

            // Inserisci la feature più vicina nel percorso
            path.push(remainingFeatures.splice(nextIndex, 1)[0]);
        }

        return path;
    }
}