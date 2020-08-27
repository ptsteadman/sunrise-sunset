import "./styles.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import Lights from "./components/Lights";
import { LightGlobe } from "./components/LightGlobe";
import { EightSeriesHeadlight } from "./components/LightGlobe/Light/EightSeriesHeadlight";

const DEBUG = true;

function App() {
  return (
    <>
      <Credits/>
      <Canvas style={{ background: '#171010' }}>
        {DEBUG && <axesHelper />}
        <fog attach="fog" args={["#222831", 0, 15]} />
        <Lights />
        <LightGlobe />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
