import "./styles.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import { CineonToneMapping } from "three";
import Lights from "./components/Lights";
import { LightGlobe } from "./components/LightGlobe/LightGlobe";
import { OrbitControls, Stars, Stats } from "drei";
import { LoadingIndicator } from './components/LoadingIndicator';

function App() {
  return (
    <>
      <Credits/>
      <Canvas
        colorManagement
        concurrent
        onCreated={({ gl }) => gl.setClearColor('#020202')}
        gl={{ antialias: true, toneMapping: CineonToneMapping }}
      >
        <fogExp2 attach="fog" args={["#020202", 0.15]} />
        <Lights />
        <Suspense fallback={<LoadingIndicator />}>
          <LightGlobe />
        </Suspense>
        <OrbitControls enablePan={false} zoomSpeed={0.5} />
        <Stars factor={2} saturation={0.7} />
        <Stats />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
