import React, { useRef, createRef, useMemo } from "react";

import { MyVolumetricSpotlight } from "./VolumetricSpotlight";
import { BEAM_COLOR_LASER, BEAM_COLOR_STANDARD } from "../../../constants";


export function HeadlightBeams ({ locations }) {
  const refs = useRef(locations.map(() => createRef()))

  const beams = useMemo(() => locations.map(({
    position,
    onDarkSide,
    blinkingOff,
    lightHigh,
    lightLow,
    lightLaser,
    render
  }, i ) => {
    if (!onDarkSide) return <group key={i} />
    const posScaleFactor = render ? 0.98 : 0.995
    let lightLength = 6
    if (lightLaser) lightLength = 12
    if (lightHigh) lightLength = 10
    return (
      <group key={i}>
        <mesh
          ref={refs.current[i]}
          position={[position[0] * 10, position[1] * 10, position[2] * 10]}
        >
        </mesh>
        <MyVolumetricSpotlight
          position={[position[0] * posScaleFactor, position[1] * posScaleFactor, position[2] * posScaleFactor]}
          color={lightLaser ? BEAM_COLOR_LASER : BEAM_COLOR_STANDARD}
          length={lightLength}
          target={refs.current[i]}
          angle={lightLaser ? 1.3 : 1.2}
          scaleX={lightLaser ? 1.5 : 3}
        />
      </group>
    )
  }), [locations])

  return (
    <>
      {beams}
    </>
  );
};
