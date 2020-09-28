import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco } from "drei";
import { HEADLIGHT_BODY_COLOR } from "../../../constants"

function initInstancedMesh(instanced, locations) {
  const dummy = new THREE.Object3D();
  locations.forEach((location, i) => {
    const { position } = location
    dummy.position.set(...position)
    dummy.scale.set(0.02, 0.02, 0.02)
    dummy.lookAt(0, 0, 0)
    dummy.rotateY( 5.6 * Math.PI / 4)
    // dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
    dummy.updateMatrix()
    instanced.current.setMatrixAt(i, dummy.matrix)
  })
  instanced.current.instanceMatrix.needsUpdate = true
}

export function FillerLights ({ locations }) {
  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/laser.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  )

  const instancedMeshVisor = useRef()
  const instancedMeshLightGuide = useRef()
  const instancedMeshLens = useRef()


  useEffect(() => {
    initInstancedMesh(instancedMeshVisor, locations);
    initInstancedMesh(instancedMeshLightGuide, locations);
    initInstancedMesh(instancedMeshLens, locations);
  }, [locations])

  return (
    <group>
      <instancedMesh ref={instancedMeshVisor} geometry={nodes['visor'].geometry} args={[null, null, locations.length]} >
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
      <instancedMesh ref={instancedMeshLightGuide} geometry={nodes['light-guide'].geometry} args={[null, null, locations.length]} >
        <meshStandardMaterial
          attach="material"
          color={0xddeeff}
          roughness={0.2}
          metalness={0.8}
          emissive={0xaaaaff}
          opacity={0.4}
          transparent
          depthWrite={false}
        />
      </instancedMesh>
      <instancedMesh ref={instancedMeshLens} geometry={nodes['lens'].geometry} args={[null, null, locations.length]} >
        <meshStandardMaterial
          attach="material"
          roughness={0.3}
          metalness={0.5}
          color={0xaaaaff}
        />
      </instancedMesh>
    </group>
  )
}
