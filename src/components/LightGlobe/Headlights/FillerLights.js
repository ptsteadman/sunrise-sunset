import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco, Detailed } from "drei";

export function FillerLights ({ locations }) {
  const { nodes: lowDetailNodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/series-3-low-lod.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const instancedMesh = useRef()

  useEffect(() => {
    const dummy = new THREE.Object3D();
    locations.forEach((location, i) => {
      const { position } = location
      dummy.position.set(...position)
      dummy.scale.set(0.02, 0.02, 0.02)
      dummy.lookAt(0, 0, 0)
      dummy.rotateY( 5.6 * Math.PI / 4)
      // dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
      dummy.updateMatrix()
      instancedMesh.current.setMatrixAt(i, dummy.matrix)
    })
    instancedMesh.current.instanceMatrix.needsUpdate = true
  }, [locations])

  return (
    <instancedMesh ref={instancedMesh} geometry={lowDetailNodes['visor'].geometry} args={[null, null, locations.length]} >
      <meshPhysicalMaterial
        attach="material"
        color={0xccccff}
        roughness={0.05}
        clearcoat={0.9}
        metalness={0.9}
        opacity={1}
        transmission={0.6}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  )
}
