import React, { useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import { Vector3, Matrix4 } from 'three';

import { sphericalCoordsToCartesian, latlngToSphericalCoords, calculateAngleForTime } from "../../lib";
import cities from "../../lib/cities.json";
import { EightSeriesHeadlights } from "./Headlights/EightSeriesHeadlights";
import { ThreeSeriesHeadlights } from "./Headlights/ThreeSeriesHeadlights";
import { HeadlightBeams } from "./Headlights/HeadlightBeams";

export function LightGlobe () {
  const group = useRef();
  const [rotation, setRotation] = useState()

  useFrame(() => {
    const r = calculateAngleForTime()
    setRotation(r)
    group.current.rotation.y = r
  });


  const RADIUS = 3;
  const locations = cities
    .filter(c => c.render)
    .map(({ lat, lng, name, render }, i) => {
      const [inc, azm ] = latlngToSphericalCoords(lat, lng)
      const position = sphericalCoordsToCartesian(RADIUS, inc, azm);
      const pos = new Vector3(...position)
      const worldPos = pos.applyMatrix4(new Matrix4().makeRotationY(rotation))
      const onDarkSide = !!(worldPos.x > 0.1)
      const blinker = i % 3 === 0
      // const blinkingOn = new Date().getSeconds() % 10 > 5
      const blinkingOn = true
      let lightOn = false
      if (onDarkSide) {
        lightOn = blinker ? blinkingOn : true
      }
      return {
        render,
        position,
        name,
        lightOn
      }
    })

  return (
    <group ref={group}>
      <EightSeriesHeadlights locations={locations.filter(({ render }) => render === 'EightSeries')} />
      <ThreeSeriesHeadlights locations={locations.filter(({ render }) => render === 'ThreeSeries')} />
      <HeadlightBeams locations={locations} />
    </group>
  );
};
