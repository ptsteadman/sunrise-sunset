import React, { useRef, Suspense } from "react";
import { useFrame } from "react-three-fiber";

import { Light } from "./Light/Light";
import { sphericalCoordsToCartesian, latlngToSphericalCoords, calculateAngleForTime } from "../../lib";
import cities from "../../lib/cities.json";

import { EightSeriesHeadlightManager } from "./Light/EightSeriesHeadlightManager";

export function LightGlobe () {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y = calculateAngleForTime()
    // group.current.rotation.y += 0.0005;
    // use redux here instead
  });

  const RADIUS = 3;
  const positions = cities.map(({ lat, lng }) => {
    const [inc, azm ] = latlngToSphericalCoords(lat, lng)
    return sphericalCoordsToCartesian(RADIUS, inc, azm);
  })

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
      <Suspense fallback={null}>
        <EightSeriesHeadlightManager positions={positions} />
      </Suspense>
    </group>
  )
  ;
};
