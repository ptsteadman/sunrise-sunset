import "./styles.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import { CineonToneMapping } from "three";
import cities from "./lib/cities.json";
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
          <LightGlobe cities={cities} />
        </Suspense>
        <OrbitControls enablePan={false} zoomSpeed={0.5} />
        <Stars factor={1.3} saturation={0.6} />
        <Stats />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

