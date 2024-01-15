// Funzione per calcolare la distanza tra due punti
function calculateDistance(point1, point2) {
    const coordinates1 = point1;
    const coordinates2 = point2;
    const dx = coordinates1.longitude - coordinates2.longitude;
    const dy = coordinates1.latitude - coordinates2.latitude;
    return Math.sqrt(dx * dx + dy * dy);
}

// Funzione per calcolare la distanza totale di un percorso
function calculateTotalDistance(path) {
    let totalDistance = 0;
    for (let i = 1; i < path.length; i++) {
        totalDistance += calculateDistance(path[i - 1], path[i]);
    }
    return totalDistance;
}

// Funzione per creare una popolazione iniziale di percorsi casuali
export function createRandomPopulation(points, populationSize) {

    const population = [];
    for (let i = 0; i < populationSize; i++) {
        const shuffledPoints = [...points];
        // Mischia i punti in modo casuale
        for (let j = shuffledPoints.length - 1; j > 0; j--) {
            const randomIndex = Math.floor(Math.random() * (j + 1));
            [shuffledPoints[j], shuffledPoints[randomIndex]] = [shuffledPoints[randomIndex], shuffledPoints[j]];
        }
        population.push(shuffledPoints);
    }
    return population;
}

// Funzione per eseguire l'evoluzione della popolazione
export function evolvePopulation(population, generations) {
    for (let generation = 0; generation < generations; generation++) {
        population.sort((a, b) => calculateTotalDistance(a) - calculateTotalDistance(b));

        const elite = population.slice(0, 1);
        const newPopulation = [elite[0]];

        while (newPopulation.length < population.length) {
            const parent1 = selectParent(population);
            const parent2 = selectParent(population);

            const child = crossover(parent1, parent2);
            mutate(child);

            newPopulation.push(child);
        }

        population = newPopulation;
    }

    return population[0];
}

// Funzione per selezionare un genitore dalla popolazione (roulette wheel selection)
function selectParent(population) {
    const totalFitness = population.reduce((sum, path) => sum + 1 / calculateTotalDistance(path), 0);
    let randomValue = Math.random() * totalFitness;
    let cumulativeFitness = 0;

    for (let i = 0; i < population.length; i++) {
        cumulativeFitness += 1 / calculateTotalDistance(population[i]);
        if (cumulativeFitness > randomValue) {
            return population[i];
        }
    }
}

// Funzione per eseguire il crossover tra due genitori
function crossover(parent1, parent2) {
    if (!parent1 || !parent2 || parent1.length === 0 || parent2.length === 0) {
        // Gestione degli edge case, ad esempio se un percorso è vuoto
        return [];
    }

    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const child = [];

    for (let i = 0; i < crossoverPoint; i++) {
        child.push(parent1[i]);
    }

    for (let i = 0; i < parent2.length; i++) {
        const point2Coordinates = parent2[i].coordinates;
        if (!child.find(point => point.coordinates.longitude === point2Coordinates.longitude && point.coordinates.latitude === point2Coordinates.latitude)) {
            child.push(parent2[i]);
        }
    }

    return child;
}

// Funzione per eseguire la mutazione di un percorso
function mutate(path) {
    const mutationRate = 0.01;
    for (let i = 0; i < path.length; i++) {
        if (Math.random() < mutationRate) {
            const j = Math.floor(Math.random() * path.length);
            [path[i], path[j]] = [path[j], path[i]];
        }
    }
}