import "./styles.css"

import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import Credits from "./components/Credits"
import { Canvas } from "react-three-fiber"
import cities from "./lib/cities.json"
import Lights from "./components/Lights"
import { LightGlobe } from "./components/LightGlobe/LightGlobe"
import { Stats } from "drei"
import { LoadingIndicator } from "./components/LoadingIndicator"
import { BG_COLOR, IS_LIVE } from "./constants"
import { Effects } from "./components/Effects"
import { CameraRig } from "./components/CameraRig"
import { Stars } from "./components/Stars"

function App() {
  return (
    <>
      <Credits/>
      <Canvas
        colorManagement
        concurrent
        onCreated={({ gl }) => gl.setClearColor(BG_COLOR)}
        gl={{ antialias: true }}
      >
        <fogExp2 attach="fog" args={["#020202", 0.1]} />
        <Lights />
        {
          IS_LIVE
            ? (
              <Suspense fallback={<LoadingIndicator />}>
                <LightGlobe cities={cities} />
              </Suspense>
            )
            : <LoadingIndicator />
        }
        <CameraRig />
        <Stars factor={2.2} saturation={0.3} fade />
        <Stats />
        <Effects />
      </Canvas>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

