import React from 'react';
import { Edge, MazeDescription } from './maze-defs';
import { generateUniformSpanningTree } from './wilson';
import ParametersForm from './ParametersForm';
import MazeCanvas from './MazeCanvas';
import { defaultType, defaultParameterValues, mazeTypes } from './maze-types';

type AppProps = {};

type AppState = {
  mazeType: string,
  parameterValues: {[name: string]: number},
  walls: Edge[],
  passages: Edge[],
};

class App extends React.Component<AppProps, AppState> {
  static createRandomState(mazeType: string, mazeDesc: MazeDescription): AppState {
    const mazeDef = mazeTypes[mazeType];
    const allEdges = mazeDef.generateEdges(mazeDesc);
    const [walls, passages] = generateUniformSpanningTree(allEdges);
    return {
      mazeType: mazeType,
      parameterValues: mazeDesc,
      walls: walls,
      passages: passages,
    };
  }

  constructor(props: AppProps) {
    super(props);
    this.state = App.createRandomState(defaultType, defaultParameterValues[defaultType]);
    this.handleParametersChange = this.handleParametersChange.bind(this);
  }

  handleParametersChange(mazeType: string, mazeDesc: MazeDescription) {
    this.setState(App.createRandomState(mazeType, mazeDesc));
  }

  render() {
    const mazeDef = mazeTypes[this.state.mazeType];
    return (
      <div className="App">
        <h2>Parameters</h2>
        <ParametersForm onChange={this.handleParametersChange}/>

        <h2>Maze</h2>
        <MazeCanvas draw={mazeDef.drawMaze} desc={this.state.parameterValues} walls={this.state.walls} passages={this.state.passages} />
      </div>
    );
  }
}

export default App;
