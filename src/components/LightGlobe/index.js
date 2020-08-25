import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";

import { Light } from "./Light/Light";
import { sphericalCoordsToCartesian, latlngToSphericalCoords } from "../../lib";
import cities from "../../lib/cities.json";

import { MyVolumetricSpotlight } from "./Light/VolumetricSpotlight";

export function LightGlobe () {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y += 0.005;
    // use redux here instead
  });

  const RADIUS = 2;
  const lights = cities.map(({ lat, lng, name }) => {
    const coords = latlngToSphericalCoords(lat, lng);
    const [inc, azm] = coords
    return (
      <Light
        key={`${inc}-${azm}`}
        position={sphericalCoordsToCartesian(RADIUS, inc, azm)}
        spotlightTargetPosition={sphericalCoordsToCartesian(RADIUS * 1.2, inc, azm)}
        name={name}
      />
    )

  })

  return (
    <group ref={group}>
      {lights}
    </group>
  )
  ;
};
