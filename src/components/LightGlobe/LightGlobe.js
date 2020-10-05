import React, { useRef, useState, useMemo } from "react"
import { useFrame } from "react-three-fiber"
import { Vector3, Matrix4 } from "three"

import {
  sphericalCoordsToCartesian,
  latlngToSphericalCoords,
  calculateAngleForTime,
  isIntervalActive
} from "../../lib"
import { EightSeriesHeadlights } from "./Headlights/EightSeriesHeadlights"
import { ThreeSeriesHeadlights } from "./Headlights/ThreeSeriesHeadlights"
import { HeadlightBeams } from "./Headlights/HeadlightBeams"
import { FillerLights } from "./Headlights/FillerLights"
import { Oceans } from "./Oceans"
import { RADIUS } from "../../constants"

const PRECISION = 7

export function LightGlobe ({ cities }) {
  const group = useRef()
  const [rotation, setRotation] = useState()

  useFrame(() => {
    const r = calculateAngleForTime()
    if (r === rotation) return
    setRotation(r)
    group.current.rotation.y = r
  })

  const dedupedLocations = useMemo(() =>
    cities.reduce((acc, cur) => {
      const localMaxCity = acc.reduce((a, c) => (
        (Math.abs(a.lat - c.lat) < PRECISION && Math.abs(a.lng - c.lng) < PRECISION) && c.population > a.population
          ? c
          : a
      ), cur)
      if (localMaxCity && !acc.find(c => c === localMaxCity)) return acc.concat(localMaxCity)
      return acc
    }, []),
    [cities]
  )

  const locations = dedupedLocations
    .map(({ lat, lng, name, render }, i) => {
      const [inc, azm ] = latlngToSphericalCoords(lat, lng)
      const position = sphericalCoordsToCartesian(render ? RADIUS : RADIUS - 0.03, inc, azm);
      const pos = new Vector3(...position)
      const worldPos = pos.applyMatrix4(new Matrix4().makeRotationY(rotation))
      const onDarkSide = !!(worldPos.x > 0.1)
      const lightLow = isIntervalActive(120 * 1000, 0, 40 * 1000, i)
      const lightHigh = isIntervalActive(120 * 1000, 40 * 1000, 70 * 1000, i)
      const lightLaser = isIntervalActive(120 * 1000, 70 * 1000, 120 * 1000, i)
      const turnLightOn = isIntervalActive(60 * 1000, 0, 20 * 1000, i) && isIntervalActive(2 * 1000, 0, 1 * 1000, i)
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
      <FillerLights locations={locations.filter(({ render }) => !render)} />
      <HeadlightBeams locations={locations} />
      <Oceans radius={RADIUS} />
    </group>
  );
};
