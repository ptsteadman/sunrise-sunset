import React, { useRef, createRef } from "react";

import { MyVolumetricSpotlight } from "./VolumetricSpotlight";


export function HeadlightBeams ({ locations, rotation }) {
  const refs = useRef(locations.map(() => createRef()))

  const beams = locations.map(({ position, lightOn }, i ) => {
    if (!lightOn) return <group key={i} />
    return (
      <group key={i}>
        <mesh
          ref={refs.current[i]}
          position={[position[0] * 10, position[1] * 10, position[2] * 10]}
        >
        </mesh>
        <MyVolumetricSpotlight
          position={[position[0] * 0.98, position[1] * 0.98, position[2] * 0.98]}
          color={0xccccff}
          target={refs.current[i]}
          intensity={0.1}
        />
      </group>
    )
  })

  return (
    <>
      {beams}
    </>
  );
};
