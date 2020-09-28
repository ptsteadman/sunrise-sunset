import React, { useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import { Vector3, Matrix4 } from 'three';

import {
  sphericalCoordsToCartesian,
  latlngToSphericalCoords,
  calculateAngleForTime,
  isIntervalActive
} from "../../lib";
import cities from "../../lib/cities.json";
import { EightSeriesHeadlights } from "./Headlights/EightSeriesHeadlights";
import { ThreeSeriesHeadlights } from "./Headlights/ThreeSeriesHeadlights";
import { HeadlightBeams } from "./Headlights/HeadlightBeams";
import { FillerLights } from "./Headlights/FillerLights";

export function LightGlobe () {
  const group = useRef();
  const [rotation, setRotation] = useState()

  useFrame(() => {
    const r = calculateAngleForTime()
    if (r === rotation) return
    setRotation(r)
    group.current.rotation.y = r
  });

  const RADIUS = 3;
  const locations = cities
    .map(({ lat, lng, name, render }, i) => {
      const [inc, azm ] = latlngToSphericalCoords(lat, lng)
      const position = sphericalCoordsToCartesian(RADIUS, inc, azm);
      const pos = new Vector3(...position)
      const worldPos = pos.applyMatrix4(new Matrix4().makeRotationY(rotation))
      const onDarkSide = !!(worldPos.x > 0.1)
      const blinkingOff = false
      const turnLightOn = isIntervalActive(60, 20, i) && isIntervalActive(2, 1, i)
      // TODO:
      // 1. turn signals blinks on and off for thirty seconds
      // 2. goes from hi-beam to low-beam on one minute interval
      // 3. angles down 20 degrees for fifteen seconds
      return {
        render,
        position,
        name,
        onDarkSide,
        blinkingOff,
        turnLightOn
      }
    })

  return (
    <group ref={group}>
      <EightSeriesHeadlights locations={locations.filter(({ render }) => render === 'EightSeries')} />
      <ThreeSeriesHeadlights locations={locations.filter(({ render }) => render === 'ThreeSeries')} />
      <FillerLights locations={locations.filter(({ render }) => !render)} />
      <HeadlightBeams locations={locations} />
    </group>
  );
};
