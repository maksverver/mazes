// Implements maze generation using Wilson's algorithm.

import {type Edge, type Vertex} from './maze-defs';

// Selects a uniform random element from the given array.
function selectRandom<T>(a: ArrayLike<T>): T {
  return a[Math.floor(Math.random() * a.length)];
}

// Generates adjacency lists from the given bidirectional edge list.
//
// The result is a map from source vertex to adjacent vertex ids.
// For example:
//
//   calculateAdjacencyLists([[1, 2], [2, 3]]) == {1: [2], 2: [1, 3], 3: [2]}
//
function calculateAdjacencyLists(edges: Edge[]): Map<Vertex, readonly Vertex[]> {
  const adj = new Map<Vertex, Vertex[]>();
  function addDirectedEdge(v: Vertex, w: Vertex) {
    var ws = adj.get(v);
    if (ws === undefined) {
      ws = [];
      adj.set(v, ws);
    }
    ws.push(w);
  }
  for (const [v, w] of edges) {
    addDirectedEdge(v, w);
    addDirectedEdge(w, v);
  }
  return adj;
}

// Generates a uniform random spanning tree from the given bidirectional edge
// list, using Wilson's algorithm.
//
// Returns a list with two elements:
//
//   1. A list of edges that are not included in the spanning tree (i.e., the
//      walls of the maze).
//   2. A list of edges that are included in the spanning tree (i.e., the
//      passages in the maze).
//
export function generateUniformSpanningTree(allEdges: Edge[]) {
  const adj = calculateAdjacencyLists(allEdges);
  const next = new Map<Vertex, Vertex>();
  const included = new Set<Vertex>();

  // Start with a random root vertex.
  const root = selectRandom(Array.from(adj.keys()));
  included.add(root);

  // Connect each vertex to the tree through a random path.
  for (const v of adj.keys()) {
    // Random walk starting from `v` until we hit the spanning tree.
    for (let w = v; !included.has(w); w = next.get(w)!) next.set(w, selectRandom(adj.get(w)!));
    // Add cycle-erased path from v to the tree.
    for (let w = v; !included.has(w); w = next.get(w)!) included.add(w);
  }

  // Partition edge list.
  const unusedEdges = [];
  const treeEdges = [];
  for (const edge of allEdges) {
    const [v, w] = edge;
    if (next.get(v) === w || next.get(w) === v) {
      treeEdges.push(edge);
    } else {
      unusedEdges.push(edge);
    }
  }
  return [unusedEdges, treeEdges];
}
