import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import Lights from "./components/Lights";
import { LightGlobe } from "./components/LightGlobe";

function App() {
  return (
    <>
      <Credits/>
      <Canvas style={{ background: '#171010' }}>
        <Lights />
        <LightGlobe />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
