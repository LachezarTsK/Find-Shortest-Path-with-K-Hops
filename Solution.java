
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

public class Solution {

    private record Point(int ID, int distanceFromStart, int availableHops) {}
    private record Edge(int ID, int distance) {}
    
    private static final int INFINITY_POINT = Integer.MAX_VALUE;
    private static final int NO_PATH_FOUND = -1;

    private List<Edge>[] undirectedGraph;
    private int numberOfNodes;

    public int shortestPathWithHops(int numberOfNodes, int[][] edges, int start, int goal, int availableHops) {
        this.numberOfNodes = numberOfNodes;
        undirectedGraph = createUndirectedGraph(edges);
        return findShortestPathWithHops(start, goal, availableHops);
    }

    private int findShortestPathWithHops(int start, int goal, int availableHops) {
        PriorityQueue<Point> minHeap = new PriorityQueue<>((x, y) -> x.distanceFromStart - y.distanceFromStart);
        minHeap.add(new Point(start, 0, availableHops));

        int[][] minDistance = new int[numberOfNodes][availableHops + 1];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            Arrays.fill(minDistance[nodeID], INFINITY_POINT);
        }
        minDistance[start][availableHops] = 0;

        while (!minHeap.isEmpty()) {
            Point current = minHeap.poll();
            if (current.ID == goal) {
                return current.distanceFromStart;
            }

            for (Edge edge : undirectedGraph[current.ID]) {
                if (minDistance[edge.ID][current.availableHops] > current.distanceFromStart + edge.distance) {
                    minDistance[edge.ID][current.availableHops] = current.distanceFromStart + edge.distance;
                    minHeap.add(new Point(edge.ID, minDistance[edge.ID][current.availableHops], current.availableHops));
                }
                if (current.availableHops > 0 && minDistance[edge.ID][current.availableHops - 1] > current.distanceFromStart) {
                    minDistance[edge.ID][current.availableHops - 1] = current.distanceFromStart;
                    minHeap.add(new Point(edge.ID, minDistance[edge.ID][current.availableHops - 1], current.availableHops - 1));
                }
            }
        }

        return NO_PATH_FOUND;
    }

    private List<Edge>[] createUndirectedGraph(int[][] edges) {
        undirectedGraph = new List[numberOfNodes];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            undirectedGraph[nodeID] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int from = edge[0];
            int to = edge[1];
            int distance = edge[2];

            undirectedGraph[from].add(new Edge(to, distance));
            undirectedGraph[to].add(new Edge(from, distance));
        }

        return undirectedGraph;
    }
}
