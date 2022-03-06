// Implements maze generation using Wilson's algorithm.

'use strict';

// Selects a uniform random element from the given array.
function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generates adjacency lists from the given bidirectional edge list.
//
// The result is an object where each key is a vertex id, and each value is a
// list of adjacent vertex ids. For example:
//
//   calculateAdjacencyLists([[1, 2], [2, 3]]) == {1: [2], 2: [1, 3], 3: [2]}
//
function calculateAdjacencyLists(edges) {
  const adj = {};
  function addDirectedEdge(v, w) {
    if (!adj[v]) adj[v] = [];
    adj[v].push(w);
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
function generateUniformSpanningTree(allEdges) {
  const adj = calculateAdjacencyLists(allEdges);
  const next = {};
  const included = {};

  // Start with a random root vertex.
  const root = selectRandom(Object.keys(adj));
  included[root] = true;

  // Connect each vertex to the tree through a random path.
  for (var v of Object.keys(adj)) {
    // Random walk starting from `v` until we hit the spanning tree.
    for (var w = v; !included[w]; w = next[w]) next[w] = selectRandom(adj[w]);
    // Add cycle-erased path from v to the tree.
    for (var w = v; !included[w]; w = next[w]) included[w] = true;
  }

  // Partition edge list.
  const unusedEdges = [];
  const treeEdges = [];
  for (const edge of allEdges) {
    const [v, w] = edge;
    if (next[v] == w || next[w] == v) {
      treeEdges.push(edge);
    } else {
      unusedEdges.push(edge);
    }
  }
  return [unusedEdges, treeEdges];
}
