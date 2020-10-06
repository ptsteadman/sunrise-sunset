import React, { useRef, useMemo } from "react"
import { useFrame } from "react-three-fiber"

import {
  sphericalCoordsToCartesian,
  latlngToSphericalCoords,
  calculateAngleForTime,
} from "../../lib"
import { EightSeriesHeadlights } from "./Headlights/EightSeriesHeadlights"
import { ThreeSeriesHeadlights } from "./Headlights/ThreeSeriesHeadlights"
import { HeadlightBeams } from "./Headlights/HeadlightBeams"
import { FillerLights } from "./Headlights/FillerLights"
import { WebcamImageManager } from "../WebcamImageManager"
import { Oceans } from "./Oceans"
import { RADIUS } from "../../constants"

const PRECISION = 7.5

export function LightGlobe ({ cities }) {
  const group = useRef()

  useFrame(() => {
    const r = calculateAngleForTime()
    group.current.rotation.y = r
  })

  const locations = useMemo(() =>
    cities
      .reduce((acc, cur) => {
          const localMaxCity = acc.reduce((a, c) => (
            (Math.abs(a.lat - c.lat) < PRECISION && Math.abs(a.lng - c.lng) < PRECISION) && c.population > a.population
            ? c
            : a
          ), cur)
          if (localMaxCity && !acc.find(c => c === localMaxCity)) return acc.concat(localMaxCity)
          return acc
        }, [])
      .map(({ lat, lng, name, render }, i) => {
        const [inc, azm ] = latlngToSphericalCoords(lat, lng)
        const position = sphericalCoordsToCartesian(render ? RADIUS : RADIUS - 0.03, inc, azm);
        return {
          render,
          position,
          name,
        }
      }),
    [cities]
  )

  return (
    <group ref={group}>
      <EightSeriesHeadlights locations={locations.filter(({ render }) => render === 'EightSeries')} />
      <ThreeSeriesHeadlights locations={locations.filter(({ render }) => render === 'ThreeSeries')} />
      <FillerLights locations={locations.filter(({ render }) => !render)} />
      <HeadlightBeams locations={locations} />
      <WebcamImageManager locations={locations} />
      <Oceans radius={RADIUS} />
    </group>
  );
};
