import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import Lights from "./components/Lights";
import Environment from "./components/Environment";
import { LightGlobe } from "./components/LightGlobe";

function App() {
  return (
    <>
      <Credits/>
      <Canvas>
        <Lights />
        <Environment />
        <LightGlobe />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
