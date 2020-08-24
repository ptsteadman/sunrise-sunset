import React, { useRef } from "react";
import { map } from "lodash";
import { useFrame } from "react-three-fiber";

import { Light } from "./Light";
import { sphericalCoordinatesToCartesian } from "../../lib";

export function LightGlobe () {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y += 0.0005;
    // use redux here instead
  });

  const radius = 2;

  return (
    <group ref={group}>
      <Light position={sphericalCoordinatesToCartesian(radius, 0.1, 0)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 3, 0)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 1.5, 5)} />
      <Light position={sphericalCoordinatesToCartesian(radius, Math.PI / 2, 0)} />
      <Light position={sphericalCoordinatesToCartesian(radius, Math.PI / 2, Math.PI)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 2, 5)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 1, 2)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 0.5, 1)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 2.5, 6)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 0.75, 3)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 2.4, 4)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 2, 2.5)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 0.6, 0.7)} />
      <Light position={sphericalCoordinatesToCartesian(radius, 1.6, Math.PI /2)} />
    </group>
  )
  ;
};
