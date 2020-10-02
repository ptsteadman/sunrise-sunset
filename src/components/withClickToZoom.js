import React, { useCallback, useState } from 'react'
import { useFrame } from 'react-three-fiber'

const ZOOM_DURATION = 10

export function withClickToZoom(WrappedComponent) {
  return function WithClickToZoomComponent(props) {
    const [zoomTarget, setZoomTarget] = useState(null)
    const [zoomStartTime, setZoomStartTime] = useState(null)
    const [zoomStartPosition, setZoomStartPosition] = useState(null)

    useFrame(({ camera, clock }) => {
      if (zoomTarget) {
          console.log('zoomStartTime + ZOOM_DURATION:', zoomStartTime + ZOOM_DURATION);
          console.log('clock.elapsedTime:', clock.elapsedTime);
        if (!zoomStartTime) {
          setZoomStartTime(clock.elapsedTime)
          setZoomStartPosition(camera.position)
          return
        }
        if (clock.elapsedTime > zoomStartTime + ZOOM_DURATION) {
          setZoomTarget(null)
          setZoomStartTime(null)
          setZoomStartPosition(null)
          return
        }
        console.log('zoomTarget:', zoomTarget);
        const a = (clock.elapsedTime - zoomStartTime) / ZOOM_DURATION
        console.log('a:', a);
        camera.position.copy(zoomTarget.lerp(zoomStartPosition, a))
        camera.updateProjectionMatrix()
        setZoomTarget(null)
      }
    })

    const handleClick = useCallback((e) => {
      e.stopPropagation();
      setZoomTarget(e.point)

    }, [])


    return (
      <WrappedComponent handleClick={handleClick} { ...props } />
    )
  }
}
