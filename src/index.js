import "./styles.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
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
        gl={{ antialias: true }}
        style={{ background: '#020204' }}
      >
        <fogExp2 attach="fog" args={["#020204", 0.15]} />
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
