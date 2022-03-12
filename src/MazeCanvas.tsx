import React from "react";
import { Edge, MazeDescription, MazeDrawer } from "./maze-defs";

type MazeCanvasProps = {
  draw: MazeDrawer,
  desc: MazeDescription,
  walls: Edge[],
  passages: Edge[],
};

function MazeCanvas({draw, desc, walls, passages}: MazeCanvasProps) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => draw(canvasRef.current!, desc, walls, passages));
  return <canvas ref={canvasRef}/>;
}

export default MazeCanvas;
