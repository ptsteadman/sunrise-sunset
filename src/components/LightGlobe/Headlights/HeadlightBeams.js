import React, { useRef, createRef, useMemo } from "react";

import { MyVolumetricSpotlight } from "./VolumetricSpotlight";



export function HeadlightBeams ({ locations }) {
  const refs = useRef(locations.map(() => createRef()))

  const beams = useMemo(() => locations.map(({ position, onDarkSide, blinkingOff }, i ) => {
    if (!onDarkSide) return <group key={i} />
    return (
      <group key={i}>
        <mesh
          ref={refs.current[i]}
          position={[position[0] * 10, position[1] * 10, position[2] * 10]}
        >
        </mesh>
        <MyVolumetricSpotlight
          position={[position[0] * 0.97, position[1] * 0.97, position[2] * 0.97]}
          color={blinkingOff ? 0x000000 : 0xccccef}
          length={20}
          target={refs.current[i]}
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
