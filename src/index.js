import "./styles.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Credits from "./components/Credits";
import { Canvas } from "react-three-fiber";
import Lights from "./components/Lights";
import { LightGlobe } from "./components/LightGlobe/LightGlobe";
import { OrbitControls, Stars, Html, Stats } from "drei";

const loader = (
  <Html center>
    <div className='loading'>
      <h1 style={{color: 'white'}}>TODAY IS NOTHING LIKE TOMORROW IS NOTHING LIKE TODAY</h1>
      <h3 style={{color: 'white'}}>LOADING...</h3>
    </div>
  </Html>
)

function App() {
  return (
    <>
      <Credits/>
      <Canvas colorManagement shadowMap style={{ background: '#020204' }}>
        <fog attach="fog" args={["#020204", 1, 15]} />
        <Lights />
        <Suspense fallback={loader}>
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
