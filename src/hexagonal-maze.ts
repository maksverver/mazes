// Implements the hexagonal maze type.

import {type Edge, type MazeDescription, MazeDefinition} from './maze-defs';

const DIRS = [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0]];

// Generates the edges of the graph representing a hexagonal maze with given
// `radius`. Implemented with a breadth-first search starting from the center
// vertex at (0, 0).
//
// If `innerEdges` is provided, all internal edges (representing potential wall
// inside the maze) are added to this array, without duplicates.
//
// If `outerEdges` is provided, all outer edges (representing walls around the
// maze) are added to this list.
function generateEdgesImpl(radius: number, innerEdges?: Edge[], outerEdges?: Edge[]) {
  const seen = new Set<number>();
  let fringe: number[] = [];
  function addToFringe(v: number) {
    if (!seen.has(v)) {
      seen.add(v);
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
        if (!seen.has(w) && dist + 1 === radius) {
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

function generateEdges(desc: MazeDescription): Edge[] {
  const innerEdges = Array<Edge>();
  generateEdgesImpl(desc.radius, innerEdges, undefined);
  return innerEdges;
}

function generateBorders(desc: MazeDescription) {
  const outerEdges = Array<Edge>();
  generateEdgesImpl(desc.radius, undefined, outerEdges);
  return outerEdges;
}

function encodeVertex(radius: number, s: number, t: number) {
  return (radius + s)*(2 * radius + 1) + (radius + t);
}

function decodeVertex(radius: number, i: number) {
  const x = i % (2 * radius + 1);
  return [(i - x) / (2 * radius + 1) - radius, x - radius];
}

function getCenterX(s: number, t: number) {
  return 1.5*s;
}

function getCenterY(s: number, t: number) {
  return (0.5*s + t)*Math.sqrt(3);
}

function drawEdgeV(ctx: CanvasRenderingContext2D, radius: number, v: number, w: number) {
  const [s1, t1] = decodeVertex(radius, v);
  const [s2, t2] = decodeVertex(radius, w);
  drawEdgeST(ctx, s1, t1, s2, t2);
}

function drawEdgeST(ctx: CanvasRenderingContext2D, s1: number, t1: number, s2: number, t2: number) {
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

function drawMaze(
  canvas: HTMLCanvasElement,
  desc: MazeDescription,
  walls: Edge[],
  passages: Edge[],
): void {
  const {radius} = desc;
  const scale = 24;
  const thickness = 6;
  const padding = 10;
  canvas.width  = (3*radius - 1)*scale + 2*padding;
  canvas.height = (2*radius - 1)*scale*Math.sqrt(3) + 2*padding;
  const ctx = canvas.getContext('2d')!;
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

const mazeDefinition : MazeDefinition = {
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
};

export default mazeDefinition;
