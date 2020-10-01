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
import { RADIUS, BG_COLOR } from "./constants"
import { Effects } from "./components/Effects"
import { ControlsProvider, Controls } from 'react-three-gui'

function App() {
  return (
    <>
      <Credits/>
      <ControlsProvider>
        <Canvas
          colorManagement
          concurrent
          onCreated={({ gl }) => gl.setClearColor(BG_COLOR)}
          gl={{ antialias: true, toneMapping: CineonToneMapping }}
        >
          <fogExp2 attach="fog" args={["#020202", 0.15]} />
          <Lights />
          <Suspense fallback={<LoadingIndicator />}>
            <LightGlobe cities={cities} />
          </Suspense>
          <OrbitControls enableDamping minDistance={RADIUS + 0.27} maxDistance={20} enablePan={false} zoomSpeed={0.3} />
          <Stars factor={0.1} saturation={0.4} />
          <Stats />
          <Effects />
        </Canvas>
        <Controls />
      </ControlsProvider>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

