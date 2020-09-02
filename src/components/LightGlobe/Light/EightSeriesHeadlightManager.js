import React, { useEffect, useRef, createRef } from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco } from "drei";
import { CubeTextureLoader } from "three";


export function EightSeriesHeadlightManager ({ positions }) {
  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/headlight-simpler-origin.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const files = ['371.jpeg', '371.jpeg', '371.jpeg', '371.jpeg', '371.jpeg', '371.jpeg'];
  const path = process.env.PUBLIC_URL + '/';
  const [cubeTexture] = useLoader(
    CubeTextureLoader,
    [files],
    loader => {
      loader.setPath(path);
      loader.setCrossOrigin('');
      return loader;
    }
  )
  // const envMap = useCubeTextureLoader(
  //   ['cctv371.jpg', 'cctv371.jpg', 'cctv371.jpg', 'cctv371.jpg', 'cctv371.jpg', 'cctv371.jpg'],
  //   { path: 'http://207.251.86.238/' }
  // )

  const refs = useRef(positions.map(() => createRef()))
  useEffect(() => {
    for (const r of refs.current) {
      r.current.lookAt(0,0,0)
      // r.current.rotateX(Math.PI / 2)
      r.current.rotateY( 5 * Math.PI / 4)
      // r.current.rotateZ(Math.PI / 4)
    }
  }, [])
  const meshObjects = positions.map((p, i) => {
    return (
      <group scale={[0.012, 0.012, 0.012 ]} key={p[0]} position={p} ref={refs.current[i]}>
        <mesh visible geometry={nodes['visor'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xeeeeee}
            roughness={0.05}
            metalness={0.9}
            opacity={1}
            envMap={cubeTexture}
            transmission={0.6}
            transparent
            depthWrite={false}
          />
        </mesh>
        <mesh visible geometry={nodes['headlight-simpler'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0x8899aa}
            roughness={0.2}
            metalness={0.8}
            clearcoat={0.7}
          />
        </mesh>
        <mesh visible geometry={nodes['griddy-thing'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xddeeff}
            roughness={0.1}
            metalness={0.8}
            emissive={0xffffff}
            opacity={1}
            transparent
            transmission={0.4}
            depthWrite={false}
          />
        </mesh>
        <mesh visible geometry={nodes['bulbs'].geometry}>
          <meshStandardMaterial
            attach="material"
            color={0xeeeeff}
            roughness={0.3}
            metalness={0.5}
            emissive={0xffffff}
          />
        </mesh>
        <mesh visible geometry={nodes['top-light'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xddffff}
            roughness={0.1}
            metalness={0.8}
            emissive={0xffffff}
            opacity={1}
            transparent
            transmission={0.5}
            depthWrite={false}
          />
        </mesh>
        <mesh visible geometry={nodes['complex--inner-thing-1'].geometry}>
          <meshStandardMaterial
            attach="material"
            color={0x3333ff}
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
        <mesh visible geometry={nodes['complex-inner-thing-2'].geometry}>
          <meshStandardMaterial
            attach="material"
            color={0x3333ff}
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
