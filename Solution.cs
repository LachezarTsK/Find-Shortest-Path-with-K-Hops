
using System;
using System.Collections.Generic;

public class Solution
{
    private sealed record Point(int ID, int distanceFromStart, int availableHops) { }
    private sealed record Edge(int ID, int distance) { }

    private static readonly int INFINITY_POINT = int.MaxValue;
    private static readonly int NO_PATH_FOUND = -1;

    private IList<Edge>[]? undirectedGraph;
    private int numberOfNodes;

    public int ShortestPathWithHops(int numberOfNodes, int[][] edges, int start, int goal, int availableHops)
    {
        this.numberOfNodes = numberOfNodes;
        undirectedGraph = CreateUndirectedGraph(edges);
        return FindShortestPathWithHops(start, goal, availableHops);
    }
    private int FindShortestPathWithHops(int start, int goal, int availableHops)
    {
        var minHeap = new PriorityQueue<Point, int>(Comparer<int>.Create((x, y) => x.CompareTo(y)));
        minHeap.Enqueue(new Point(start, 0, availableHops), 0);

        int[][] minDistance = new int[numberOfNodes][];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID)
        {
            minDistance[nodeID] = new int[availableHops + 1];
            Array.Fill(minDistance[nodeID], INFINITY_POINT);
        }
        minDistance[start][availableHops] = 0;

        while (minHeap.Count > 0)
        {
            Point current = minHeap.Dequeue();
            if (current.ID == goal)
            {
                return current.distanceFromStart;
            }

            foreach (Edge edge in undirectedGraph[current.ID])
            {
                if (minDistance[edge.ID][current.availableHops] > current.distanceFromStart + edge.distance)
                {
                    minDistance[edge.ID][current.availableHops] = current.distanceFromStart + edge.distance;
                    minHeap.Enqueue(new Point(edge.ID, minDistance[edge.ID][current.availableHops], current.availableHops),
                                    minDistance[edge.ID][current.availableHops]);
                }
                if (current.availableHops > 0 && minDistance[edge.ID][current.availableHops - 1] > current.distanceFromStart)
                {
                    minDistance[edge.ID][current.availableHops - 1] = current.distanceFromStart;
                    minHeap.Enqueue(new Point(edge.ID, minDistance[edge.ID][current.availableHops - 1], current.availableHops - 1),
                                    minDistance[edge.ID][current.availableHops - 1]);
                }
            }
        }

        return NO_PATH_FOUND;
    }

    private IList<Edge>[] CreateUndirectedGraph(int[][] edges)
    {
        undirectedGraph = new List<Edge>[numberOfNodes];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID)
        {
            undirectedGraph[nodeID] = new List<Edge>();
        }

        foreach (int[] edge in edges)
        {
            int from = edge[0];
            int to = edge[1];
            int distance = edge[2];

            undirectedGraph[from].Add(new Edge(to, distance));
            undirectedGraph[to].Add(new Edge(from, distance));
        }

        return undirectedGraph;
    }
}
