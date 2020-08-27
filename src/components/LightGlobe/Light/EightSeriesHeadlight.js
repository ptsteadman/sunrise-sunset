import React, { useEffect, useRef, createRef } from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";


export function EightSeriesHeadlight ({ positions }) {
  const { scene } = useLoader(GLTFLoader, "headlight-simplest-deglitched.glb");
  const meshes = scene.children[0].children[0].children;
  const merged = BufferGeometryUtils.mergeBufferGeometries(meshes.map(m => m.geometry.center()));

  const refs = useRef(positions.map(() => createRef()))
  useEffect(() => {
    for (const r of refs.current) {
      r.current.lookAt(0,0,0)
      r.current.rotateX(Math.PI / 2)
      r.current.rotateY(Math.PI)
      r.current.rotateZ(Math.PI / 4)
    }
  }, [])
  const meshObjects = positions.map((p, i) => {
    return (
      <mesh position={p} ref={refs.current[i]} scale={[0.009, 0.009, 0.009 ]} key={p[0]} visible geometry={merged}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.2}
          metalness={0.6}
          opacity={0.7}
          transparent
        />
      </mesh>
    )})
  return (
    <group>
      {meshObjects}
    </group>
  )
}
