import "./styles.css"

import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { ControlsProvider } from 'react-three-gui'
import Credits from "./components/Credits"
import { Canvas } from "react-three-fiber"
import { CineonToneMapping } from "three"
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
      <ControlsProvider>
        <Canvas
          colorManagement
          concurrent
          onCreated={({ gl }) => gl.setClearColor(BG_COLOR)}
          gl={{ antialias: true, toneMapping: CineonToneMapping }}
        >
          <fogExp2 attach="fog" args={["#020202", 0.15]} />
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
          <Stars factor={2.5} saturation={0.3} fade />
          <Effects />
        </Canvas>
      </ControlsProvider>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

