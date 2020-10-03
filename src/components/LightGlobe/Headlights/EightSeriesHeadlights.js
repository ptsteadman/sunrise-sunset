import React, { useEffect, useRef, createRef } from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco, Detailed } from "drei";
import { BackSide } from "three";
import shallow from "zustand/shallow"
import { WebcamImageManager } from "../../WebcamImageManager";
import { PLASTIC_COLOR, HEADLIGHT_BODY_COLOR, BODY_HIGHLIGHT_COLOR, TURN_SIGNAL_COLOR } from "../../../constants"
import { useStore } from '../../../store'

const hkSrc = 'https://tdcctv.data.one.gov.hk/K107F.JPG?';
const nycSrc = 'http://207.251.86.238/cctv884.jpg?';

export function EightSeriesHeadlights ({ locations }) {
  const [nycCubeMap, setNycCubeMap] = React.useState(null)
  const [hkCubeMap, setHkCubeMap] = React.useState(null)
  const [zoomToMesh, handleHoverMesh, handleUnhoverMesh] = useStore(state => [
    state.zoomToMesh,
    state.handleHoverMesh,
    state.handleUnhoverMesh
  ], shallow)

  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/eight-series-headlight-simplified.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const { nodes: midDetailNodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/eight-series-headlight-mid-lod.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const { nodes: lowDetailNodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/eight-series-headlight-very-low-lod.glb",
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

  const meshObjects = locations.map(({ position, name, onDarkSide, blinkingOff, turnLightOn }, i) => {
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
        <mesh
          visible
          geometry={nodes['visor'].geometry}
          onClick={zoomToMesh}
          onPointerOver={handleHoverMesh}
          onPointerOut={handleUnhoverMesh}
        >
          <meshPhysicalMaterial
            attach="material"
            color={0xeeeeee}
            roughness={0.05}
            envMap={envMap[name] ? envMap[name] : nycCubeMap}
            envMapIntensity={1.3}
            clearcoat={0.9}
            metalness={0.9}
            opacity={1}
            transmission={0.6}
            transparent
            depthWrite={false}
          />
        </mesh>
        <Detailed distances={[0, 2.5, 5]}>
          <mesh visible geometry={nodes['headlight-simpler'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <mesh visible geometry={midDetailNodes['headlight-simpler'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['headlight-simpler'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 3]}>
          <mesh>
            <mesh visible userData={{ bloom: onDarkSide }} geometry={nodes['griddy-thing'].geometry}>
              <meshPhysicalMaterial
                attach="material"
                color={PLASTIC_COLOR}
                roughness={0.2}
                metalness={0.8}
                emissive={onDarkSide ? 0xaaaaff : 0x000000}
                opacity={1}
                transparent
                transmission={0.94}
                depthWrite={false}
              />
            </mesh>
            <mesh visible userData={{ bloom: onDarkSide }} geometry={nodes['griddy-thing'].geometry}>
              <meshPhysicalMaterial
                attach="material"
                color={PLASTIC_COLOR}
                roughness={0.2}
                metalness={0.8}
                emissive={onDarkSide ? 0xaaaaff : 0x000000}
                opacity={1}
                transparent
                transmission={0.4}
                depthWrite={false}
                side={BackSide}
              />
            </mesh>
          </mesh>
          <mesh visible userData={{ bloom: true }} geometry={lowDetailNodes['griddy-thing'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={PLASTIC_COLOR}
              roughness={0.2}
              metalness={0.8}
              emissive={onDarkSide && !blinkingOff ? 0xaaaaff : 0x000000}
              depthWrite={false}
            />
          </mesh>
        </Detailed>
        <mesh visible geometry={nodes['bulbs'].geometry}>
          <meshStandardMaterial
            attach="material"
            color={0xaaaaff}
            roughness={0.3}
            metalness={0.5}
            emissive={onDarkSide && !blinkingOff ? 0xaaaaff : 0x000000}
          />
        </mesh>
        <Detailed distances={[0, 6]}>
          <mesh visible userData={{ bloom: true }} geometry={nodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xddeeff}
              roughness={0.1}
              metalness={0.8}
              emissive={turnLightOn ? TURN_SIGNAL_COLOR : (onDarkSide && !blinkingOff ? 0xaaaaff : 0x000000)}
              opacity={0.7}
              depthWrite={false}
            />
          </mesh>
          <mesh visible userData={{ bloom: true }} geometry={lowDetailNodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xddeeff}
              roughness={0.1}
              metalness={0.8}
              emissive={turnLightOn ? TURN_SIGNAL_COLOR : (onDarkSide && !blinkingOff ? 0xaaaaff : 0x000000)}
              depthWrite={false}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 3]}>
          <mesh visible geometry={nodes['complex--inner-thing-1'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.6}
              metalness={0.5}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['complex--inner-thing-1'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.6}
              metalness={0.5}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 3]}>
          <mesh visible geometry={nodes['complex-inner-thing-2'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['complex-inner-thing-2'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
        </Detailed>
      </group>
    )})
  return (
    <group>
      <WebcamImageManager src={nycSrc} handleUpdateCubeMap={setNycCubeMap} />
      <WebcamImageManager src={hkSrc} handleUpdateCubeMap={setHkCubeMap} />
      {meshObjects}
    </group>
  );
}
