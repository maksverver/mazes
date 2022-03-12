import { MazeDefinition, MazeDescription } from './maze-defs';

// Import maze types. Order matters because these register themselves globally.
import './rectangular-maze';
import './hexagonal-maze';
import rectangularMaze from './rectangular-maze';
import hexagonalMaze from './hexagonal-maze';

export type MazeTypeMap = {readonly [name: string]: Readonly<MazeDefinition>};

export const mazeTypes: MazeTypeMap = {
  rectangular: rectangularMaze,
  hexagonal: hexagonalMaze,
};

// Use first type by default.
export const defaultType: string = Object.keys(mazeTypes)[0];

// Precalculate default parameter values.
export const defaultParameterValues = calculateDefaultParameterValues();

function calculateDefaultParameterValues(): Readonly<{[name: string]: Readonly<MazeDescription>}> {
  const defaultParameterValues: {[name: string]: MazeDescription} = {};
  for (const [typeName, mazeDef] of Object.entries(mazeTypes)) {
    const values: MazeDescription = {};
    for (const [paramName, paramValue] of Object.entries(mazeDef.parameters)) {
      values[paramName] = paramValue.defaultValue;
    }
    defaultParameterValues[typeName] = Object.freeze(values);
  }
  return Object.freeze(defaultParameterValues);
}
