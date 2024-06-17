
#include <span>
#include <queue>
#include <limits>
#include <vector>
using namespace std;

class Solution {

    struct Point {
        int ID{};
        int distanceFromStart{};
        int availableHops{};

        Point() = default;
        Point(int ID, int distanceFromStart, int availableHops) :
              ID{ ID }, distanceFromStart{ distanceFromStart }, availableHops{ availableHops } {}
    };

    struct Edge {
        int ID{};
        int distance{};

        Edge() = default;
        Edge(int ID, int distance) : ID{ ID }, distance{ distance } {}
    };

    struct ComparatorPoint {
        auto operator()(const Point& x, const Point& y) const {
            return x.distanceFromStart > y.distanceFromStart;
        }
    };

    inline static const int INFINITY_POINT = numeric_limits<int>::max();
    inline static const int NO_PATH_FOUND = -1;

    vector <vector<Edge>> undirectedGraph;
    int numberOfNodes;

public:
    int shortestPathWithHops
    (int numberOfNodes, vector<vector<int>>& edges, int start, int goal, int availableHops) {
        this->numberOfNodes = numberOfNodes;
        undirectedGraph = createUndirectedGraph(edges);
        return findShortestPathWithHops(start, goal, availableHops);
    }

private:
    int findShortestPathWithHops(int start, int goal, int availableHops) const {
        priority_queue<Point, vector<Point>, ComparatorPoint> minHeap;
        minHeap.emplace(start, 0, availableHops);

        vector<vector<int>> minDistance(numberOfNodes, vector<int>(availableHops + 1, INFINITY_POINT));
        minDistance[start][availableHops] = 0;

        while (!minHeap.empty()) {
            Point current = minHeap.top();
            minHeap.pop();
            if (current.ID == goal) {
                return current.distanceFromStart;
            }

            for (const auto& edge : undirectedGraph[current.ID]) {
                if (minDistance[edge.ID][current.availableHops] > current.distanceFromStart + edge.distance) {
                    minDistance[edge.ID][current.availableHops] = current.distanceFromStart + edge.distance;
                    minHeap.emplace(edge.ID, minDistance[edge.ID][current.availableHops], current.availableHops);
                }
                if (current.availableHops > 0 && minDistance[edge.ID][current.availableHops - 1] > current.distanceFromStart) {
                    minDistance[edge.ID][current.availableHops - 1] = current.distanceFromStart;
                    minHeap.emplace(edge.ID, minDistance[edge.ID][current.availableHops - 1], current.availableHops - 1);
                }
            }
        }

        return NO_PATH_FOUND;
    }

    vector < vector<Edge>> createUndirectedGraph(span<const vector<int>> edges) {
        undirectedGraph.resize(numberOfNodes);

        for (const auto& edge : edges) {
            int from = edge[0];
            int to = edge[1];
            int distance = edge[2];

            undirectedGraph[from].emplace_back(to, distance);
            undirectedGraph[to].emplace_back(from, distance);
        }

        return undirectedGraph;
    }
};
