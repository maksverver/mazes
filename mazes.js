// Implements the UI (see index.html for the DOM structure)

'use strict';

(function(){

const parametersForm = document.getElementById('parameters-form');
const mazeCanvas = document.getElementById('maze-canvas');

function parseParameterValue(parameter, name, string) {
  const value = parseInt(string, 10);
  if (isNaN(value) || value < parameter.minValue || value > parameter.maxValue) {
    throw `Invalid ${name}: “${string}”.\n\nValue must be an integer between ${parameter.minValue} and ${parameter.maxValue}.`;
  }
  return value;
}

function parseDesc(parameters) {
  const desc = {};
  for (const [name, parameter] of Object.entries(parameters)) {
    const string = parametersForm.elements[name].value;
    desc[name] = parseParameterValue(parameter, name, string);
  }
  return desc;
}

function getSelectedType() {
  return MAZE_TYPES[parametersForm.elements['type'].value];
}

function onTypeChanged() {
  const parameters = getSelectedType().parameters;
  const typeSpecificParameters = document.getElementById('type-specific-parameters');
  typeSpecificParameters.replaceChildren();
  for (const [name, parameter] of Object.entries(parameters)) {
    const parameterDiv = document.createElement('div');
    parameterDiv.className = 'parameter';
    const label = document.createElement('label');
    parameterDiv.appendChild(label);
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.appendChild(document.createTextNode(parameter.label + ':'));
    label.appendChild(labelDiv);
    label.appendChild(document.createTextNode(' '));
    const input = document.createElement('input');
    input.name = name;
    input.type = 'number';
    input.value = parameter.defaultValue;
    input.min = parameter.minValue;
    input.max = parameter.maxValue;
    input.required = true;
    label.appendChild(input);
    typeSpecificParameters.appendChild(parameterDiv);
  }
  regenerateMaze();
}

function regenerateMaze() {
  const mazeType = getSelectedType();
  const mazeDesc = parseDesc(mazeType.parameters);
  const allEdges = mazeType.generateEdges(mazeDesc);
  const [walls, passages] = generateUniformSpanningTree(allEdges);
  mazeType.drawMaze(mazeCanvas, mazeDesc, walls, passages);
}

function initialize() {
  const typeSelect = parametersForm.elements['type'];
  for (const [name, type] of Object.entries(MAZE_TYPES)) {
    const option = document.createElement('option');
    option.value = name;
    option.appendChild(document.createTextNode(type.label));
    typeSelect.appendChild(option);
  }
  typeSelect.onchange = onTypeChanged;
  parametersForm.onsubmit = () => {
    try {
      regenerateMaze();
    } catch (e) {
      console.error(e);  // includes the stack trace
      alert(e);
    }
    return false;  // prevents form submission
  };
  onTypeChanged();
}

initialize();

}());
