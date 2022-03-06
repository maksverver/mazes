// Common variables and functions, used by multiple scripts.

'use strict';

const MAZE_TYPES = {};

// Registers a maze type with the given name.
//
// See e.g. rectangular.js for an example of a maze type definition.
function registerMazeType(name, definition) {
  MAZE_TYPES[name] = definition;
}
