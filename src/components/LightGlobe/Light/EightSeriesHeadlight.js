import React from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function EightSeriesHeadlight ({ position }) {
  const { scene } = useLoader(GLTFLoader, "eight-series-headlight.glb");
  const meshes = scene.children[0].children[0].children;
  const meshObjects = meshes.map(m => {
    m.geometry.center()
    return (
    <mesh position={position}  scale={[0.05, 0.05, 0.05 ]} key={m.uuid} visible geometry={m.geometry}>
      <meshStandardMaterial
        attach="material"
        color="white"
        roughness={0.3}
        metalness={0.3}
      />
    </mesh>
  )})
  return (
    <group>
      {meshObjects}
    </group>
  )
}
