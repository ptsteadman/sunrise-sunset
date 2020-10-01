import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { Vector3, Matrix4 } from 'three';

import {
  sphericalCoordsToCartesian,
  latlngToSphericalCoords,
  calculateAngleForTime,
  isIntervalActive
} from "../../lib";
import { EightSeriesHeadlights } from "./Headlights/EightSeriesHeadlights";
import { ThreeSeriesHeadlights } from "./Headlights/ThreeSeriesHeadlights";
import { HeadlightBeams } from "./Headlights/HeadlightBeams";
// import { FillerLights } from "./Headlights/FillerLights";
import { RADIUS } from '../../constants';

const PRECISION = 1

export function LightGlobe ({ cities }) {
  const group = useRef();
  const [rotation, setRotation] = useState()

  useFrame(() => {
    const r = calculateAngleForTime()
    if (r === rotation) return
    setRotation(r)
    group.current.rotation.y = r
  });

  const dedupedLocations = useMemo(() =>
    cities.reduce((acc, cur) => {
      const nearbyIdx = acc.findIndex(c => cur.lat.toFixed(PRECISION) === c.lat.toFixed(PRECISION) || cur.lng.toFixed(PRECISION) === c.lng.toFixed(PRECISION))
      if (nearbyIdx > 0 && cur.population > acc[nearbyIdx].population) {
        acc[nearbyIdx] = cur
        return acc
      }
      acc.push(cur)
      return acc
    }, []),
    [cities]
  )

  const locations = dedupedLocations 
    .map(({ lat, lng, name, render }, i) => {
      const [inc, azm ] = latlngToSphericalCoords(lat, lng)
      const position = sphericalCoordsToCartesian(render ? RADIUS : RADIUS - 0.2, inc, azm);
      const pos = new Vector3(...position)
      const worldPos = pos.applyMatrix4(new Matrix4().makeRotationY(rotation))
      const onDarkSide = !!(worldPos.x > 0.1)
      const lightLow = isIntervalActive(120, 0, 40, i)
      const lightHigh = isIntervalActive(120, 40, 70, i)
      const lightLaser = isIntervalActive(120, 70, 120, i)
      const turnLightOn = isIntervalActive(60, 0, 20, i) && isIntervalActive(2, 0, 1, i)
      // TODO:
      // 1. turn signals blinks on and off for thirty seconds
      // 2. goes from hi-beam to low-beam on one minute interval
      // 3. angles down 20 degrees for fifteen seconds
      return {
        render,
        position,
        name,
        onDarkSide,
        turnLightOn,
        lightLow,
        lightHigh,
        lightLaser
      }
    })

  return (
    <group ref={group}>
      <EightSeriesHeadlights locations={locations.filter(({ render }) => render === 'EightSeries')} />
      <ThreeSeriesHeadlights locations={locations.filter(({ render }) => render === 'ThreeSeries')} />
      {/* <FillerLights locations={locations.filter(({ render }) => !render)} /> */}
      <HeadlightBeams locations={locations} />
    </group>
  );
};
