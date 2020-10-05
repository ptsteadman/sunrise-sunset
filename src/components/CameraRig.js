import React, { useRef } from "react"
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
  const orbitControlsRef = useRef()

  useFrame(({ camera, clock }) => {
    const cameraDistance = camera.position.length()
    if (cameraDistance < 3.5) {
      orbitControlsRef.current.zoomSpeed = 0.025
      orbitControlsRef.current.rotateSpeed = 0.3
    } else if (cameraDistance < 5.5) {
      orbitControlsRef.current.zoomSpeed = 0.1
      orbitControlsRef.current.rotateSpeed = 0.8
    } else {
      orbitControlsRef.current.zoomSpeed = 0.2
      orbitControlsRef.current.rotateSpeed = 1
    }
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
    <OrbitControls ref={orbitControlsRef} enableDamping minDistance={RADIUS} maxDistance={20} enablePan={false} zoomSpeed={0.2} />
  )
}
