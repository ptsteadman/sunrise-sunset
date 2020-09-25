import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function FillerLights ({ locations }) {
  const instancedMesh = useRef()

  useEffect(() => {
    const dummy = new THREE.Object3D();
    locations.forEach((location, i) => {
      const { position } = location
      dummy.position.set(...position)
      dummy.scale.set(1, 1, 1)
      dummy.lookAt(0, 0, 0)
      // dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
      dummy.updateMatrix()
      instancedMesh.current.setMatrixAt(i, dummy.matrix)
    })
    instancedMesh.current.instanceMatrix.needsUpdate = true
  }, [locations])

  return (
    <instancedMesh ref={instancedMesh} args={[null, null, locations.length]} >
      <boxBufferGeometry attach="geometry" args={[0.2, 0.02, 0.1]} />
      <meshStandardMaterial attach="material" color="#666666" transparent opacity={0.6} />
    </instancedMesh>
  )
}
