export class PathDrawer extends HTMLElement {
    _features;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this._features = [];
    }

    get features() {
        return this._features;
    }

    set features(features) {
        this._features = features;
        this.render();
    }

    render() {
        this.div.innerHTML = '';

        if (this._features.length != 0) {
            this.startNavigationBtn.setAttribute('is-active', 'true');
            this.startNavigationBtn.setAttribute('is-navigation', 'false');
            this.generateInfobox(this.div, this.features);

            this.allInfoboxes = this.shadow.querySelectorAll('app-path-infobox');
            this.pathTools = this.shadow.querySelector('app-path-tools');
            this.allInfoboxes.forEach(infobox => {
                infobox.addEventListener('goto', (e) => {
                    this.dispatchEvent(new CustomEvent('goto', { detail: e.detail.coordinates }));
                });
            });

            this.allInfoboxes.forEach(infobox => {
                infobox.addEventListener('remove', (event) => {
                    let feature = event.detail.data;
                    this.features = this.checkFeature(feature);
                    this.startNavigationBtn.setAttribute('is-navigation', 'false');
                });
            });

            this.allInfoboxes.forEach(infobox => {
                infobox.addEventListener('selectedFeature', event => {
                    this.pathTools.setAttribute('is-open', 'false');
                    let feature = event.detail.data;
                    this.dispatchEvent(new CustomEvent('selectedFeature', { detail: { data: feature } }));
                });
            });

            this.drag();

        } else {
            this.startNavigationBtn.setAttribute('is-active', 'false');
            this.startNavigationBtn.setAttribute('is-navigation', 'false');
            this.emptyMsg = document.createElement('app-empty-msg')
            this.div.append(this.emptyMsg);

            this.emptyMsg.addEventListener('empty', () => {
                this.dispatchEvent(new CustomEvent('empty'));
                this.setAttribute('is-open', 'false');
            });
        }
    }

    connectedCallback() {
        // html
        this.shadow.innerHTML =
            `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="drawer">
                <div class="header">
                    <app-save-route-input></app-save-route-input>
                    <div class="header-tools">
                        <div class="path-tools-icon">
                            <span class="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>
                        <div class="close-icon">
                            <span class="material-symbols-outlined">close</span>
                        </div>
                    </div>
                </div>
                <app-path-tools></app-path-tools>
                <div class="info-container"><app-empty-msg></app-empty-msg></div>
                <app-navigation></app-navigation>
            </div>
            `
            ;

        this.pathToolsIcon = this.shadow.querySelector('.path-tools-icon');
        this.pathTools = this.shadow.querySelector('app-path-tools');
        this.closeIcon = this.shadow.querySelector('.close-icon');
        this.saveRouteInput = this.shadow.querySelector('app-save-route-input');
        this.div = this.shadow.querySelector('.info-container');
        this.emptyMsg = this.shadow.querySelector('app-empty-msg');
        this.startNavigationBtn = this.shadow.querySelector('app-navigation');

        if (!this.hasAttribute('route-name')) this.setAttribute('route-name', 'Nuovo percorso');
        if (!this.hasAttribute('is-navigation')) this.setAttribute('is-navigation', 'false');
        this.setAttribute('is-open', 'false');

        // js
        this.pathToolsIcon.addEventListener('click', () => {
            const isOpen = JSON.parse(this.pathTools.getAttribute('is-open'));
            this.pathTools.setAttribute('is-open', !isOpen + '');
        });

        this.pathTools.addEventListener('saveCustomRoute', () => {
            const name = this.saveRouteInput.getAttribute('value');
            let customRoute = {};
            customRoute.name = name;
            customRoute.features = this.features;
            this.dispatchEvent(new CustomEvent('saveCustomRoute', { detail: { customRoute } }));
        });

        this.pathTools.addEventListener('flush', () => {
            this.features = [];
        });

        this.pathTools.addEventListener('sort', (e) => {
            // const startingPosition = { name: 'StartingPoint', coordinates: { latitude: 45.4843, longitude: 9.2011 } }
            // console.log(this.features);
            // const optimalRoute = simulatedAnnealing(startingPosition, this.features, 1000, 0.001);
            // console.log(optimalRoute);
            // this.features = optimalRoute;


            const startingPosition = { longitude: 8.85504, latitude: 44.42243 };
            
            const populationSize = 100;
            const generations = 200;
            
            // Inserisci l'initialPosition come primo elemento nella popolazione iniziale
            const initialPopulation = createRandomPopulation(this.features, populationSize);
            initialPopulation.forEach(path => path.unshift({ coordinates: startingPosition }));
            
            const optimizedPath = evolvePopulation(initialPopulation, generations);
            
            console.log("Percorso ottimizzato:", optimizedPath.slice(1)); // Rimuovi l'initialPosition dal risultato finale
            console.log("Distanza totale:", calculateTotalDistance(optimizedPath));
            this.features = optimizedPath;
        });

        this.closeIcon.addEventListener('click', () => {
            this.setAttribute('is-open', 'false');
        });

        this.startNavigationBtn.addEventListener('activateNavigation', (e) => {
            const isNavigation = e.detail.isNavigation;
            this.setAttribute('is-navigation', isNavigation + '');
        });

        this.emptyMsg.addEventListener('empty', () => {
            this.dispatchEvent(new CustomEvent('empty'));
            this.setAttribute('is-open', 'false');
        });

        this.div.addEventListener('drop', e => {
            e.preventDefault();

            const draggingItemData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const draggingItemIndex = this._features.findIndex(item => {
                return item.coordinates.longitude == draggingItemData.coordinates.longitude;
            });

            const nearestInfobox = this.getNearestInfobox(e.clientY);
            const nearestInfoboxIndex = this._features.findIndex(item => {
                return item.coordinates.longitude == JSON.parse(nearestInfobox.getAttribute('data')).coordinates.longitude;
            });

            this._features.splice(draggingItemIndex, 1);
            nearestInfoboxIndex != -1 ? this._features.splice(nearestInfoboxIndex, 0, draggingItemData) : this._features.push(draggingItemData);

            this.features = this._features;
        });

        // css
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './css/path-drawer.css');
        this.shadow.append(style);
    }

    static observedAttributes = ['is-open', 'is-navigation', 'route-name'];
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue && oldValue != null) {

            if (name == 'is-open') {
                newValue == 'true' ? this.classList.add('visible') : this.classList.remove('visible');
                this.dispatchEvent(new CustomEvent('pathDrawerStatusChanged', { detail: { newValue } }));
            }

            if (name == 'is-navigation') {
                const isNavigation = newValue;
                this.dispatchEvent(new CustomEvent('activateNavigation', {
                    detail: { features: this.features, isNavigation }
                }));
                this.startNavigationBtn.setAttribute('is-navigation', isNavigation + '');
            }

            if (name == 'route-name') {
                this.saveRouteInput.setAttribute('value', newValue);
            }
        }
    }

    generateInfobox(div, features) {
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            const infobox = document.createElement('app-path-infobox');
            infobox.setAttribute('data', JSON.stringify(feature));
            if (i == features.length - 1) infobox.classList.add('last');
            div.append(infobox);
        }
    }


    checkFeature(feature) {
        const i = this._features.findIndex(obj => {
            return JSON.stringify(obj.properties) == JSON.stringify(feature.properties);
        });
        this._features.splice(i, 1);
        return this._features;
    }

    drag() {
        this.allInfoboxes.forEach(infobox => {
            infobox.draggable = true;

            infobox.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', infobox.getAttribute('data'));
                this.pathTools.setAttribute('is-open', 'false');
                infobox.classList.add('dragging');
            });

            this.div.addEventListener('dragover', e => {
                e.preventDefault();
            });

            infobox.addEventListener('dragend', () => {
                infobox.classList.remove('dragging');
            });
        });
    }

    getNearestInfobox(y) {
        let nearestInfobox = null;
        let minDistance = Infinity;

        this.allInfoboxes.forEach(infobox => {
            const rect = infobox.getBoundingClientRect();
            const distance = Math.abs(rect.top - y);

            if (distance < minDistance) {
                minDistance = distance;
                nearestInfobox = infobox;
            }
        });

        return nearestInfobox;
    }

}

customElements.define('app-path-drawer', PathDrawer);





















// function simulatedAnnealing(startingPoint, points, temperature, coolingRate) {
//     let currentSolution = [startingPoint, ...shuffle(points)]; // Inizializza la soluzione corrente (casuale)
//     // let currentSolution = shuffle(points); // Inizializza la soluzione corrente (casuale)
//     let bestSolution = currentSolution; // La migliore soluzione iniziale

//     while (temperature > 1) {
//         const newSolution = mutate(currentSolution); // Genera una nuova soluzione modificando quella corrente
//         const currentDistance = calculateTotalDistance(currentSolution);
//         const newDistance = calculateTotalDistance(newSolution);
//         const acceptanceProbability = Math.exp((currentDistance - newDistance) / temperature);

//         if (Math.random() < acceptanceProbability) {
//             currentSolution = newSolution;
//         }

//         if (newDistance < calculateTotalDistance(bestSolution)) {
//             bestSolution = newSolution;
//         }

//         temperature *= 1 - coolingRate; // Raffredda gradualmente il sistema
//     }

//     return bestSolution;
// }

// // Funzione per calcolare la distanza totale del percorso
// function calculateTotalDistance(path) {
//     // console.log('calculateTotalDistance');
//     let totalDistance = 0;
//     for (let i = 0; i < path.length - 1; i++) {
//         totalDistance += calculateDistance(path[i].coordinates, path[i + 1].coordinates);
//     }
//     return totalDistance;
// }

// // Funzione per calcolare la distanza tra due punti
// function calculateDistance(point1, point2) {
//     // console.log('calculateTwoPointsDistance');
//     const xDiff = point2.longitude - point1.longitude;
//     const yDiff = point2.latitude - point1.latitude;
//     return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
// }

// // Funzione per mescolare casualmente un array (utile per l'inizializzazione casuale)
// function shuffle(array) {
//     // console.log('shuffle');
//     const shuffled = array.slice();
//     for (let i = shuffled.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
// }

// // Funzione per mutare la soluzione corrente (scambia casualmente due punti)
// function mutate(solution) {
//     // console.log('mutate');
//     const mutated = solution.slice();
//     const index1 = Math.floor(Math.random() * solution.length);
//     let index2 = Math.floor(Math.random() * solution.length);
//     while (index1 === index2) {
//         index2 = Math.floor(Math.random() * solution.length);
//     }
//     [mutated[index1], mutated[index2]] = [mutated[index2], mutated[index1]];
//     return mutated;
// }
















































// Funzione per calcolare la distanza tra due punti
function calculateDistance(point1, point2) {
    const coordinates1 = point1.coordinates;
    const coordinates2 = point2.coordinates;
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
function createRandomPopulation(points, populationSize) {
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
function evolvePopulation(population, generations) {
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

// Esempio di utilizzo
// const startingPosition = { longitude: 0, latitude: 0 };
// const points = [
//   { name: "Point1", coordinates: { longitude: 1, latitude: 1 } },
//   { name: "Point2", coordinates: { longitude: 2, latitude: 2 } },
//   // Aggiungi gli altri punti
// ];

// const populationSize = 50;
// const generations = 100;

// // Inserisci l'initialPosition come primo elemento nella popolazione iniziale
// const initialPopulation = createRandomPopulation(points, populationSize);
// initialPopulation.forEach(path => path.unshift({ coordinates: startingPosition }));

// const optimizedPath = evolvePopulation(initialPopulation, generations);

// console.log("Percorso ottimizzato:", optimizedPath.slice(1)); // Rimuovi l'initialPosition dal risultato finale
// console.log("Distanza totale:", calculateTotalDistance(optimizedPath));