
package main

import (
    "container/heap"
    "fmt"
    "math"
)

type Point struct {
    ID                int
    distanceFromStart int
    availableHops     int
}

type Edge struct {
    ID       int
    distance int
}

var INFINITY_POINT = math.MaxInt
var NO_PATH_FOUND = -1

var undirectedGraph [][]Edge
var numberOfNodes = 0

func shortestPathWithHops(totalNodes int, edges [][]int, start int, goal int, availableHops int) int {
    numberOfNodes = totalNodes
    undirectedGraph = createUndirectedGraph(edges)
    return findShortestPathWithHops(start, goal, availableHops)
}

func findShortestPathWithHops(start int, goal int, availableHops int) int {
    minHeap := PriorityQueue{}
    point := &Point{start, 0, availableHops}
    heap.Push(&minHeap, point)

    minDistance := createSliceMinDistance(availableHops)
    minDistance[start][availableHops] = 0

    for minHeap.Len() > 0 {
        current := heap.Pop(&minHeap).(*Point)
        if current.ID == goal {
            return current.distanceFromStart
        }

        for _, edge := range undirectedGraph[current.ID] {
            if minDistance[edge.ID][current.availableHops] > current.distanceFromStart+edge.distance {
                minDistance[edge.ID][current.availableHops] = current.distanceFromStart + edge.distance
                point := &Point{edge.ID, minDistance[edge.ID][current.availableHops], current.availableHops}
                heap.Push(&minHeap, point)
            }
            if current.availableHops > 0 && minDistance[edge.ID][current.availableHops-1] > current.distanceFromStart {
                minDistance[edge.ID][current.availableHops-1] = current.distanceFromStart
                point := &Point{edge.ID, minDistance[edge.ID][current.availableHops-1], current.availableHops - 1}
                heap.Push(&minHeap, point)
            }
        }
    }

    return NO_PATH_FOUND
}

func createUndirectedGraph(edges [][]int) [][]Edge {
    undirectedGraph = make([][]Edge, numberOfNodes)

    for nodeID := 0; nodeID < numberOfNodes; nodeID++ {
        undirectedGraph[nodeID] = []Edge{}
    }

    for _, edge := range edges {
        from := edge[0]
        to := edge[1]
        distance := edge[2]

        undirectedGraph[from] = append(undirectedGraph[from], Edge{to, distance})
        undirectedGraph[to] = append(undirectedGraph[to], Edge{from, distance})
    }

    return undirectedGraph
}

func createSliceMinDistance(availableHops int) [][]int {
    minDistance := make([][]int, numberOfNodes)
    for nodeID := 0; nodeID < numberOfNodes; nodeID++ {

        minDistance[nodeID] = make([]int, availableHops+1)
        for i := 0; i < availableHops+1; i++ {
            minDistance[nodeID][i] = INFINITY_POINT
        }
    }
    return minDistance
}

type PriorityQueue []*Point

func (pq PriorityQueue) Len() int {
    return len(pq)
}

func (pq PriorityQueue) Less(first int, second int) bool {
    return pq[first].distanceFromStart < pq[second].distanceFromStart
}

func (pq PriorityQueue) Swap(first int, second int) {
    pq[first], pq[second] = pq[second], pq[first]
}

func (pq *PriorityQueue) Push(object any) {
    point := object.(*Point)
    *pq = append(*pq, point)
}

func (pq *PriorityQueue) Pop() any {
    length := len(*pq)
    point := (*pq)[length-1]
    (*pq)[length-1] = nil
    *pq = (*pq)[0 : length-1]
    return point
}
