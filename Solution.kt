
import java.util.PriorityQueue

class Solution {

    private data class Point(val ID: Int, val distanceFromStart: Int, val availableHops: Int) {}
    private data class Edge(val ID: Int, val distance: Int) {}

    private companion object {
        const val INFINITY_POINT = Int.MAX_VALUE
        const val NO_PATH_FOUND = -1
    }

    private lateinit var undirectedGraph: Array<ArrayList<Edge>>
    private var numberOfNodes = 0


    fun shortestPathWithHops(numberOfNodes: Int, edges: Array<IntArray>, start: Int, goal: Int, availableHops: Int): Int {
        this.numberOfNodes = numberOfNodes
        undirectedGraph = createUndirectedGraph(edges)
        return findShortestPath(start, goal, availableHops)
    }

    private fun findShortestPath(start: Int, goal: Int, availableHops: Int): Int {
        val minHeap = PriorityQueue<Point>() { x, y -> x.distanceFromStart - y.distanceFromStart }
        minHeap.add(Point(start, 0, availableHops))

        val minDistance = Array<IntArray>(numberOfNodes) { IntArray(availableHops + 1) { INFINITY_POINT } }
        minDistance[start][availableHops] = 0

        while (!minHeap.isEmpty()) {
            val current = minHeap.poll()
            if (current.ID == goal) {
                return current.distanceFromStart
            }

            for (edge in undirectedGraph[current.ID]) {
                if (minDistance[edge.ID][current.availableHops] > current.distanceFromStart + edge.distance) {
                    minDistance[edge.ID][current.availableHops] = current.distanceFromStart + edge.distance
                    minHeap.add(Point(edge.ID, minDistance[edge.ID][current.availableHops], current.availableHops))
                }
                if (current.availableHops > 0 && minDistance[edge.ID][current.availableHops - 1] > current.distanceFromStart) {
                    minDistance[edge.ID][current.availableHops - 1] = current.distanceFromStart
                    minHeap.add(Point(edge.ID, minDistance[edge.ID][current.availableHops - 1], current.availableHops - 1))
                }
            }
        }

        return NO_PATH_FOUND
    }

    private fun createUndirectedGraph(edges: Array<IntArray>): Array<ArrayList<Edge>> {
        undirectedGraph = Array<ArrayList<Edge>>(numberOfNodes) { ArrayList<Edge>() }

        for (nodeID in 0..<numberOfNodes) {
            undirectedGraph[nodeID] = ArrayList<Edge>()
        }

        for ((from, to, distance) in edges) {
            undirectedGraph[from].add(Edge(to, distance))
            undirectedGraph[to].add(Edge(from, distance))
        }

        return undirectedGraph
    }
}
