
function shortestPathWithHops(numberOfNodes: number, edges: number[][], start: number, goal: number, availableHops: number): number {
    this.INFINITY_POINT = Number.MAX_SAFE_INTEGER;
    this.NO_PATH_FOUND = -1;

    this.numberOfNodes = numberOfNodes;
    this.undirectedGraph = createUndirectedGraph(edges);

    return findShortestPathWithHops(start, goal, availableHops);
};

function findShortestPathWithHops(start: number, goal: number, availableHops: number): number {
    const { MinPriorityQueue } = require('@datastructures-js/priority-queue');
    const minHeap = new MinPriorityQueue({ compare: (x, y) => x.distanceFromStart - y.distanceFromStart });
    minHeap.enqueue(new Point(start, 0, availableHops));

    const minDistance: number[][] = Array.from(new Array(this.numberOfNodes),
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

function Point(ID: number, distanceFromStart: number, availableHops: number) {
    this.ID = ID;
    this.distanceFromStart = distanceFromStart;
    this.availableHops = availableHops;
}

function Edge(ID: number, distance: number) {
    this.ID = ID;
    this.distance = distance;
}

function createUndirectedGraph(edges: number[][]): number[][] {
    const undirectedGraph: number[][] = Array.from(new Array(this.numberOfNodes), () => new Array());
    for (let [to, from, distance] of edges) {
        undirectedGraph[from].push(new Edge(to, distance));
        undirectedGraph[to].push(new Edge(from, distance));
    }
    return undirectedGraph;
}
