// Declares types used to describe various maze types.

// Each vertex is modeled as a nonnegative integer.
export type Vertex = number;

// An edge is an unordered pair of vertex indices. Edges are assumed to be
// bidirectional.
export type Edge = [Vertex, Vertex];

// MazeParameters describe the parameters that are used to configure the maze
// (e.g., "height" and "width" are two parameters for a rectangular maze), along
// with default values and constraints. Currently, only numeric parameters are
// supported.
export type MazeParameters = {
  [name: string]: {
    label: string,
    minValue: number,
    maxValue: number,
    defaultValue: number,
  }
}

// A MazeDescription is an object that assigns a value to each of the maze
// parameters, within the constraints provided by MazeParameters.
export type MazeDescription = {
  [name: string]: number,
}

// An EdgeGenerator is a function to generate a graph given a maze description.
// The graph is described as a list of bidirectional edges. The graph should be
// fully connected.
export type EdgeGenerator = (mazeDesc: MazeDescription) => Edge[];

// A MazeDrawer is a function that draws a generated maze on an HTML canvas.
export type MazeDrawer = (canvas: HTMLCanvasElement, mazeDesc: MazeDescription, walls: Edge[], passages: Edge[]) => void;

// Describes a maze type.
export type MazeDefinition = {
  label: string,
  parameters: MazeParameters,
  generateEdges: EdgeGenerator,
  drawMaze: MazeDrawer,
};
