import React from "react"
import { useFrame } from "react-three-fiber"
import { Vector3 } from "three"
import shallow from "zustand/shallow"
import { OrbitControls } from "drei"

import { useStore } from "../store"
import { RADIUS, ZOOM_DURATION } from "../constants"

export function CameraRig () {
  const [zoomTarget, zoomStartTime, zoomStartPosition] = useStore(state =>
    [state.zoomTarget, state.zoomStartTime, state.zoomStartPosition], shallow)
  const setZoomStartTime = useStore(state => state.setZoomStartTime)
  const setZoomStartPosition = useStore(state => state.setZoomStartPosition)
  const setZoomTarget = useStore(state => state.setZoomTarget)

  useFrame(({ camera, clock }) => {
    if (zoomTarget) {
      if (!zoomStartTime) {
        setZoomStartTime(clock.elapsedTime)
        setZoomStartPosition(new Vector3().copy(camera.position)) // copy, otherwise reference is stored!
        return
      }
      let zoomDurationScaledByDistance = ZOOM_DURATION
      const distanceToZoom = zoomStartPosition.distanceTo(zoomTarget)
      if (distanceToZoom < 0.5) zoomDurationScaledByDistance = ZOOM_DURATION / 6
      if (distanceToZoom < 1) zoomDurationScaledByDistance = ZOOM_DURATION / 2
      if (distanceToZoom > 3) zoomDurationScaledByDistance = ZOOM_DURATION * 1.5
      if (!zoomDurationScaledByDistance || clock.elapsedTime > zoomStartTime + zoomDurationScaledByDistance) {
        setZoomTarget(null)
        setZoomStartTime(null)
        setZoomStartPosition(null)
        return
      }
      const a = (clock.elapsedTime - zoomStartTime) / zoomDurationScaledByDistance
      const newCamPos = new Vector3().lerpVectors(zoomStartPosition, zoomTarget, a)
      camera.position.copy(newCamPos)
      camera.updateProjectionMatrix()
    }
  })


  return (
    <OrbitControls enableDamping minDistance={RADIUS} maxDistance={20} enablePan={false} zoomSpeed={0.2} />
  )
}
