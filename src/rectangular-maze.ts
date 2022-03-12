// Implements the rectangular maze type.

import {type Edge, type MazeDescription, MazeDefinition} from './maze-defs';

function generateEdges(mazeDesc: MazeDescription): Edge[] {
  const {height, width} = mazeDesc;
  const walls: Edge[] = [];
  for (let r = 0; r < height; ++r) {
    for (let c = 0; c < width; ++c) {
    if (r + 1 < height) walls.push([r*width + c, (r + 1)*width + c]);
    if (c + 1 < width)  walls.push([r*width + c, r*width + (c + 1)]);
    }
  }
  return walls;
}

function drawMaze(
    canvas: HTMLCanvasElement,
    mazeDesc: MazeDescription,
    walls: Edge[],
    passages: Edge[],
): void {
  const {height, width} = mazeDesc;
  const scale = 16;
  const thickness = 4;
  const padding = 10;

  function decodeVertex(v: number) {
    const c = v % width;
    return [(v - c)/width, c];
  }

  canvas.width  = width*scale  + 2*padding;
  canvas.height = height*scale + 2*padding;
  const ctx = canvas.getContext('2d')!;

  ctx.lineWidth = thickness / scale;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.translate(padding, padding)
  ctx.scale(scale, scale);

  ctx.beginPath();
  for (const [v, w] of walls) {
    const [r1, c1] = decodeVertex(v);
    const [r2, c2] = decodeVertex(w);
    if (r1 === r2) {
      ctx.moveTo(c1 + 1, r1);
    } else {
      console.assert(c1 === c2);
      ctx.moveTo(c1, r1 + 1);
    }
    ctx.lineTo(c1 + 1, r1 + 1);
  }
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.stroke();
}

const mazeDefinition: MazeDefinition = {
  label: 'Rectangular',
  parameters: {
    width: {
      label: 'Width',
      minValue: 1,
      maxValue: 1000,
      defaultValue: 30,
    },
    height: {
      label: 'Height',
      minValue: 1,
      maxValue: 1000,
      defaultValue: 20,
    },
  },
  generateEdges,
  drawMaze,
};

export default mazeDefinition;
