import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import Lights from "./components/Lights";
import { LightGlobe } from "./components/LightGlobe/LightGlobe";
import { OrbitControls, Stars } from "drei";

function App() {
  return (
    <>
      <Credits/>
      <Canvas colorManagement shadowMap style={{ background: '#020204' }}>
        <fog attach="fog" args={["#020204", 1, 15]} />
        <axesHelper />
        <Lights />
        <LightGlobe />
        <OrbitControls enablePan={false} zoomSpeed={0.5} />
        <Stars factor={2} saturation={0.7} />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
