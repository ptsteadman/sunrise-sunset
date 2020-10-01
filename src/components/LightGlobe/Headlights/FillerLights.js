import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco } from "drei";

const dummy = new THREE.Object3D();

function initInstancedMesh(instanced, locations, lightGuide) {
  locations.forEach((location, i) => {
    const { position } = location
    dummy.position.set(...position)
    let scale = [0.015, 0.015, 0.015]
    if (lightGuide === 'on' && !location.onDarkSide) {
      scale = [0, 0, 0]
    }
    if (lightGuide === 'off' && location.onDarkSide) {
      scale = [0, 0, 0]
    }
    dummy.scale.set(...scale)
    dummy.lookAt(0, 0, 0)
    dummy.rotateY( 5.6 * Math.PI / 4)
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
  const instancedMeshLightGuideOn = useRef()
  const instancedMeshLightGuideOff = useRef()
  const instancedMeshLens = useRef()


  useEffect(() => {
    initInstancedMesh(instancedMeshVisor, locations);
    initInstancedMesh(instancedMeshLightGuideOn, locations, 'on');
    initInstancedMesh(instancedMeshLightGuideOff, locations, 'off');
    initInstancedMesh(instancedMeshLens, locations);
  }, [locations])

  return (
    <group>
      <instancedMesh ref={instancedMeshVisor} geometry={nodes['visor'].geometry} userData={{ bloom: true }} args={[null, null, locations.length]} >
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
      <instancedMesh ref={instancedMeshLightGuideOff} userData={{ bloom: true }} geometry={nodes['light-guide'].geometry} args={[null, null, locations.length]} >
        <meshStandardMaterial
          attach="material"
          color={0xddeeff}
          roughness={0.2}
          metalness={0.8}
          opacity={0.4}
          transparent
          depthWrite={false}
        />
      </instancedMesh>
      <instancedMesh ref={instancedMeshLightGuideOn} userData={{ bloom: true }} geometry={nodes['light-guide'].geometry} args={[null, null, locations.length]} >
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
      <instancedMesh ref={instancedMeshLens} userData={{ bloom: true }} geometry={nodes['lens'].geometry} args={[null, null, locations.length]} >
        <meshStandardMaterial
          attach="material"
          roughness={0.3}
          metalness={0.5}
          color={0xaaaaff}
          opacity={0.4}
          transparent
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  )
}
