import React, { useCallback, useState } from 'react'
import { useFrame } from 'react-three-fiber'

export function withClickToZoom(WrappedComponent) {
  return function WithClickToZoomComponent(props) {
    const [zoomTarget, setZoomTarget] = useState(null)

    useFrame(({ camera, clock }) => {
      if (zoomTarget) {
        console.log('zoomTarget:', zoomTarget);
        camera.position.set(zoomTarget.x, zoomTarget.y, zoomTarget.z);
        camera.updateProjectionMatrix()
        setZoomTarget(null)
      }
    })

    const handleClick = useCallback((e) => {
      console.log('e:', e);
      e.stopPropagation();
      setZoomTarget(e.point)

    }, [])


    return (
      <WrappedComponent handleClick={handleClick} { ...props } />
    )
  }
}
