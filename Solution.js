
/**
 * @param {number} numberOfNodes
 * @param {number[][]} edges
 * @param {number} start
 * @param {number} goal
 * @param {number} availableHops
 * @return {number}
 */
var shortestPathWithHops = function (numberOfNodes, edges, start, goal, availableHops) {
    this.INFINITY_POINT = Number.MAX_SAFE_INTEGER;
    this.NO_PATH_FOUND = -1;

    this.numberOfNodes = numberOfNodes;
    this.undirectedGraph = createUndirectedGraph(edges);

    return findShortestPathWithHops(start, goal, availableHops);
};

/**
 * @param {number} start
 * @param {number} goal
 * @param {number} availableHops
 * @return {number}
 */
function findShortestPathWithHops(start, goal, availableHops) {
    // const {MinPriorityQueue} = require('@datastructures-js/priority-queue');
    const minHeap = new MinPriorityQueue({compare: (x, y) => x.distanceFromStart - y.distanceFromStart});
    minHeap.enqueue(new Point(start, 0, availableHops));

    const minDistance = Array.from(new Array(this.numberOfNodes),
            () => new Array(availableHops + 1).fill(this.INFINITY_POINT));
    minDistance[start][availableHops] = 0;

    while (!minHeap.isEmpty()) {
        const current = minHeap.dequeue();
        if (current.ID === goal) {
            return current.distanceFromStart;
        }

        for (let edge of this.undirectedGraph[current.ID]) {
            if (minDistance[edge.ID][current.availableHops] > current.distanceFromStart + edge.distance) {
                minDistance[edge.ID][current.availableHops] = current.distanceFromStart + edge.distance;
                minHeap.enqueue(new Point(edge.ID, minDistance[edge.ID][current.availableHops], current.availableHops));
            }
            if (current.availableHops > 0 && minDistance[edge.ID][current.availableHops - 1] > current.distanceFromStart) {
                minDistance[edge.ID][current.availableHops - 1] = current.distanceFromStart;
                minHeap.enqueue(new Point(edge.ID, minDistance[edge.ID][current.availableHops - 1], current.availableHops - 1));
            }
        }
    }

    return this.NO_PATH_FOUND;
}

/**
 * @param {number} ID
 * @param {number} distanceFromStart
 * @param {number} availableHops
 */
function Point(ID, distanceFromStart, availableHops) {
    this.ID = ID;
    this.distanceFromStart = distanceFromStart;
    this.availableHops = availableHops;
}

/**
 * @param {number} ID
 * @param {number} distance
 */
function Edge(ID, distance) {
    this.ID = ID;
    this.distance = distance;
}

/**
 * @param {number[][]} edges
 * @return {number[][]}
 */
function createUndirectedGraph(edges) {
    const undirectedGraph = Array.from(new Array(this.numberOfNodes), () => new Array());
    for (let [to, from, distance] of edges) {
        undirectedGraph[from].push(new Edge(to, distance));
        undirectedGraph[to].push(new Edge(from, distance));
    }
    return undirectedGraph;
}
