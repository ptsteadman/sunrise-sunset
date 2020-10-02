import React, { useCallback, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { Vector3 } from 'three'

const ZOOM_DURATION = 2

export function withClickToZoom(WrappedComponent) {
  return function WithClickToZoomComponent(props) {
    const [zoomTarget, setZoomTarget] = useState(null)
    const [zoomStartTime, setZoomStartTime] = useState(null)
    const [zoomStartPosition, setZoomStartPosition] = useState(null)

    useFrame(({ camera, clock }) => {
      if (zoomTarget) {
        if (!zoomStartTime) {
          setZoomStartTime(clock.elapsedTime)
          setZoomStartPosition(new Vector3().copy(camera.position)) // copy, otherwise reference is stored!
          return
        }
        if (clock.elapsedTime > zoomStartTime + ZOOM_DURATION) {
          setZoomTarget(null)
          setZoomStartTime(null)
          setZoomStartPosition(null)
          return
        }
        const a = (clock.elapsedTime - zoomStartTime) / ZOOM_DURATION
        const newCamPos = new Vector3().lerpVectors(zoomStartPosition, zoomTarget, a)
        camera.position.copy(newCamPos)
        camera.updateProjectionMatrix()
      }
    })

    const handleClick = useCallback((e) => {
      e.stopPropagation();
      setZoomTarget(e.point.multiplyScalar(1.1))

    }, [])


    return (
      <WrappedComponent handleClick={handleClick} { ...props } />
    )
  }
}
