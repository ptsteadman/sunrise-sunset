import React, { useEffect, useRef, createRef } from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco } from "drei";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";


export function EightSeriesHeadlightManager ({ positions }) {
  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/headlight-simpler-origin.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );
  console.log('nodes:', nodes);
  const headlightBodyMeshes = nodes['headlight-simpler'].children.filter(c => c.name.startsWith("headlight-simpler"));
  const headlightBodyMerged = BufferGeometryUtils.mergeBufferGeometries(headlightBodyMeshes.map(m => m.geometry));
  const griddyThingMerged = BufferGeometryUtils.mergeBufferGeometries(nodes['griddy-thing'].children.map(m => m.geometry));
  const complexInnerThingOneMerged = BufferGeometryUtils.mergeBufferGeometries(nodes['complex--inner-thing-1'].children.map(m => m.geometry));
  const complexInnerThingTwoMerged = BufferGeometryUtils.mergeBufferGeometries(nodes['complex-inner-thing-2'].children.map(m => m.geometry));

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
      <group scale={[0.009, 0.009, 0.009 ]} key={p[0]} position={p} ref={refs.current[i]}>
        <mesh visible geometry={nodes['visor'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xffffff}
            roughness={0.3}
            metalness={0.6}
            opacity={1}
            transmission={0.6}
            transparent
          />
        </mesh>
        <mesh visible geometry={headlightBodyMerged}>
          <meshPhysicalMaterial
            attach="material"
            color={0xddddff}
            roughness={0.2}
            metalness={0.8}
            clearcoat={0.65}
          />
        </mesh>
        <mesh visible geometry={griddyThingMerged}>
          <meshStandardMaterial
            attach="material"
            color={0xddffdd}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        <mesh visible geometry={complexInnerThingOneMerged}>
          <meshStandardMaterial
            attach="material"
            color={0x9400d3}
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
        <mesh visible geometry={complexInnerThingTwoMerged}>
          <meshStandardMaterial
            attach="material"
            color={0x9400d3}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </group>
    )})
  return (
    <group>
      {meshObjects}
    </group>
  )
}
