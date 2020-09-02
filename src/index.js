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
      <Canvas colorManagement shadowMap style={{ background: '#101010' }}>
        <fog attach="fog" args={["#222831", -10, 15]} />
        <Lights />
        <LightGlobe />
        <OrbitControls enablePan={false} zoomSpeed={0.5} />
        <Stars factor={2} saturation={0.5} />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
