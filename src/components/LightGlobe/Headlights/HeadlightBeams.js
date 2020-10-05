import React, { useRef, createRef } from "react";

import { MyVolumetricSpotlight } from "./VolumetricSpotlight";


export function HeadlightBeams ({ locations }) {
  const targetRefs = useRef(locations.map(() => createRef()))
  const bloomRefs = useRef(locations.map(() => createRef()))

  const beams = locations.map(({
    position,
    render
  }, i ) => {
    const posScaleFactor = render ? 0.98 : 0.995
    return (
      <group key={i}>
        <mesh
          ref={targetRefs.current[i]}
          position={[position[0] * 10, position[1] * 10, position[2] * 10]}
        />
        <mesh
          ref={bloomRefs.current[i]}
          position={[position[0] * 2, position[1] * 2, position[2] * 2]}
        />
        <MyVolumetricSpotlight
          position={[position[0] * posScaleFactor, position[1] * posScaleFactor, position[2] * posScaleFactor]}
          index={i}
          target={targetRefs.current[i]}
          openEnded
        />
        {render && (
          <MyVolumetricSpotlight
            position={[position[0] * 1.02, position[1] * 1.02, position[2] * 1.02]}
            length={3.9}
            wide
            index={i}
            geometryLength={1}
            target={bloomRefs.current[i]}
            openEnded
          />
        )}
      </group>
    )
  })

  return (
    <>
      {beams}
    </>
  );
};
