import React, { useEffect, useRef, createRef } from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco } from "drei";
import { BackSide } from "three";
import { WebcamImageManager } from "../../WebcamImageManager";
import { citiesWhereHeadlightsOn } from "../../../lib";

const hkSrc = 'https://tdcctv.data.one.gov.hk/K107F.JPG?';
const nycSrc = 'http://207.251.86.238/cctv884.jpg?'

export function EightSeriesHeadlightManager ({ locations }) {
  const [nycCubeMap, setNycCubeMap] = React.useState(null)
  const [hkCubeMap, setHkCubeMap] = React.useState(null)

  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/headlight-simpler-origin.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const refs = useRef(locations.map(() => createRef()))
  useEffect(() => {


    for (const r of refs.current) {
      r.current.lookAt(0,0,0)
      // r.current.rotateX(Math.PI / 2)
      r.current.rotateY( 5 * Math.PI / 4)
      // r.current.rotateZ(Math.PI / 4)
    }
  }, [])

  const meshObjects = locations.map(({ position, name }, i) => {
    const envMap = {
      "New York City": nycCubeMap,
      'Mexico City': nycCubeMap,
      "Hong Kong": hkCubeMap,
      "Qingdao": hkCubeMap,
      "Seoul": hkCubeMap,
      "Dhaka": hkCubeMap,

    }
    return (
      <group scale={[0.02, 0.02, 0.02 ]} key={name} position={position} ref={refs.current[i]}>
        <mesh visible geometry={nodes['visor'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xeeeeee}
            roughness={0.05}
            envMap={envMap[name]}
            envMapIntensity={1.5}
            clearcoat={0.9}
            metalness={0.9}
            opacity={1}
            transmission={0.6}
            transparent
            depthWrite={false}
          />
        </mesh>
        <mesh visible geometry={nodes['headlight-simpler'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0x778899}
            roughness={0.3}
            metalness={0.7}
            clearcoat={0.7}
          />
        </mesh>
        <mesh visible geometry={nodes['griddy-thing'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xddeeff}
            roughness={0.2}
            metalness={0.8}
            emissive={citiesWhereHeadlightsOn.includes(name) ? 0xaaaaff : null}
            opacity={1}
            transparent
            transmission={0.94}
            depthWrite={false}
          />
        </mesh>
        <mesh visible geometry={nodes['griddy-thing'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xddeeff}
            roughness={0.2}
            metalness={0.8}
            emissive={citiesWhereHeadlightsOn.includes(name) ? 0xaaaaff : null}
            opacity={1}
            transparent
            transmission={0.4}
            depthWrite={false}
            side={BackSide}
          />
        </mesh>
        {citiesWhereHeadlightsOn.includes(name) && (
          <mesh position={[-5, 1, 1]}>
            {/* <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
            {/* <meshBasicMaterial attach="material" color="#FFFF99" fog={false} /> */}
            <pointLight
              args={[0x7777ff, 8, 0.07]}
            />
          </mesh>
        )
        }
        <mesh visible geometry={nodes['bulbs'].geometry}>
          <meshStandardMaterial
            attach="material"
            color={0xaaaaff}
            roughness={0.3}
            metalness={0.5}
            emissive={citiesWhereHeadlightsOn.includes(name) ? 0xaaaaff : null}
          />
        </mesh>
        <mesh visible geometry={nodes['top-light'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xddffff}
            roughness={0.1}
            metalness={0.8}
            emissive={citiesWhereHeadlightsOn.includes(name) ? 0xaaaaff : null}
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
      <WebcamImageManager src={nycSrc} handleUpdateCubeMap={setNycCubeMap} />
      <WebcamImageManager src={hkSrc} handleUpdateCubeMap={setHkCubeMap} />
      {meshObjects}
    </group>
  )
}
