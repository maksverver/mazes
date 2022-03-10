// Implements the hexagonal maze type.

'use strict';

(function(){

const DIRS = [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0]];

// Generates the edges of the graph representing a hexagonal maze with given
// `radius`. Implemented with a breadth-first search starting from the center
// vertex at (0, 0).
//
// `innerEdges` must be null or an array. If not null, all internal edges
// (representing potential walls inside the maze) are added to this array,
// without duplicates.
//
// `outerEdges` must be null or an array. If not null, all outer edges
// (representing walls around the maze) are added to this list.
function generateEdgesImpl(radius, innerEdges, outerEdges) {
  const seen = {};
  let fringe = [];
  function addToFringe(v) {
    if (!seen[v]) {
      seen[v] = true;
      fringe.push(v);
    }
  }
  addToFringe(encodeVertex(radius, 0, 0));
  for (let dist = 0; dist < radius; ++dist) {
    const todo = fringe;
    fringe = [];
    for (const v of todo) {
      const [s, t] = decodeVertex(radius, v);
      for (const [ds, dt] of DIRS) {
        const w = encodeVertex(radius, s + ds, t + dt);
        if (!seen[w] && dist + 1 == radius) {
          // `w` lies outside the desired radius.
          if (outerEdges) {
            outerEdges.push([v, w]);
          }
        } else {
          // `w` lies inside the desired radius.
          // Only add if v < w to avoid duplicate edges.
          if (innerEdges && v < w) {
            innerEdges.push([v, w]);
          }
          addToFringe(w);
        }
      }
    }
  }
}

function generateEdges(desc) {
  const innerEdges = [];
  generateEdgesImpl(desc.radius, innerEdges, null);
  return innerEdges;
}

function generateBorders(desc) {
  const outerEdges = [];
  generateEdgesImpl(desc.radius, null, outerEdges);
  return outerEdges;
}

function encodeVertex(radius, s, t) {
  return (radius + s)*(2 * radius + 1) + (radius + t);
}

function decodeVertex(radius, i) {
  const x = i % (2 * radius + 1);
  return [(i - x) / (2 * radius + 1) - radius, x - radius];
}

function getCenterX(s, t) {
  return 1.5*s;
}

function getCenterY(s, t) {
  return (0.5*s + t)*Math.sqrt(3);
}

function drawEdgeV(ctx, radius, v, w) {
  const [s1, t1] = decodeVertex(radius, v);
  const [s2, t2] = decodeVertex(radius, w);
  drawEdgeST(ctx, s1, t1, s2, t2);
}

function drawEdgeST(ctx, s1, t1, s2, t2) {
  const x1 = getCenterX(s1, t1);
  const y1 = getCenterY(s1, t1);
  const x2 = getCenterX(s2, t2);
  const y2 = getCenterY(s2, t2);
  const mx = (x1 + x2)/2;
  const my = (y1 + y2)/2;
  const dlen = Math.hypot(x2 - x1, y2 - y1);
  const dx = (x2 - x1) / dlen * 0.5;
  const dy = (y2 - y1) / dlen * 0.5;
  ctx.beginPath();
  ctx.moveTo(mx - dy, my + dx);
  ctx.lineTo(mx + dy, my - dx);
  ctx.stroke();
}

function drawMaze(canvas, desc, walls, passages) {
  const {radius} = desc;
  const scale = 24;
  const thickness = 6;
  const padding = 10;
  canvas.width  = (3*radius - 1)*scale + 2*padding;
  canvas.height = (2*radius - 1)*scale*Math.sqrt(3) + 2*padding;
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = thickness / scale;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.translate(padding, padding);
  ctx.scale(scale, scale);
  ctx.translate((radius - 1)*1.5 + 1, (radius - 0.5)*Math.sqrt(3));
  for (const [v, w] of generateBorders(desc)) {
    drawEdgeV(ctx, radius, v, w);
  }
  for (const [v, w] of walls) {
    drawEdgeV(ctx, radius, v, w);
  }
}

registerMazeType('hexagonal', {
  label: 'Hexagonal',
  parameters: {
    radius: {
      label: 'Radius',
      minValue: 1,
      maxValue: 100,
      defaultValue: 8,
    },
  },
  generateEdges,
  drawMaze,
});

}());
