import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import Lights from "./components/Lights";
import { LightGlobe } from "./components/LightGlobe/LightGlobe";
import { OrbitControls } from "drei";

function App() {
  return (
    <>
      <Credits/>
      <Canvas shadowMap style={{ background: '#171010' }}>
        <fog attach="fog" args={["#222831", -10, 15]} />
        <Lights />
        <LightGlobe />
        <OrbitControls enablePan={false} zoomSpeed={0.1} />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
