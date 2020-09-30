import React, { useEffect, useRef, createRef } from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco, Detailed } from "drei";
import { BackSide } from "three";
import { TURN_SIGNAL_COLOR, HEADLIGHT_BODY_COLOR, BODY_HIGHLIGHT_COLOR, BODY_DARK_COLOR } from "../../../constants"

function getBulbEmissive (onDarkSide, turnLightOn) {
  if (turnLightOn) return TURN_SIGNAL_COLOR
  if (onDarkSide) return 0xaaaaff
  return 0x000000
}

export function ThreeSeriesHeadlights ({ locations }) {
  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/series-3.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const { nodes: lowDetailNodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/series-3-low-lod.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const refs = useRef(locations.map(() => createRef()))

  useEffect(() => {
    for (const r of refs.current) {
      r.current.lookAt(0,0,0)
      // r.current.rotateX(Math.PI / 2)
      r.current.rotateY( 5.65 * Math.PI / 4)
      // r.current.rotateZ(Math.PI / 4)
    }
  }, [])

  const meshObjects = locations.map(({ position, name, onDarkSide, blinkingOff, turnLightOn }, i) => {
    return (
      <group scale={[0.018, 0.018, 0.018 ]} key={name} position={position} ref={refs.current[i]}>
        <mesh visible geometry={lowDetailNodes['visor'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xeeeeee}
            roughness={0.05}
            clearcoat={0.9}
            metalness={0.9}
            opacity={1}
            transmission={0.6}
            transparent
            depthWrite={false}
          />
        </mesh>
        <mesh visible geometry={nodes['bulbs_0'].geometry}>
          <meshStandardMaterial
            attach="material"
            roughness={0.1}
            metalness={0.8}
            color={0xaaaaff}
            transparent
            opacity={0.6}
            emissive={getBulbEmissive(onDarkSide, turnLightOn)}
          />
        </mesh>
        <mesh visible geometry={nodes['bulbs_1'].geometry}>
          <meshStandardMaterial
            attach="material"
            roughness={0.1}
            metalness={0.8}
            color={0xaaaaff}
            transparent
            opacity={0.6}
            emissive={onDarkSide ? 0xaaaaff : null}
          />
        </mesh>
        <mesh visible geometry={nodes['bulbs_2'].geometry}>
          <meshStandardMaterial
            attach="material"
            roughness={0.1}
            metalness={0.8}
            color={0xaaaaff}
            transparent
            opacity={0.6}
            emissive={getBulbEmissive(onDarkSide, turnLightOn)}
          />
        </mesh>
        <Detailed distances={[0, 5]}>
          <mesh visible geometry={nodes['headlight-simpler'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['headlight-simpler'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 3]}>
          <mesh>
            <mesh visible geometry={nodes['griddy-thing'].geometry}>
              <meshPhysicalMaterial
                attach="material"
                color={HEADLIGHT_BODY_COLOR}
                roughness={0.2}
                metalness={0.8}
                emissive={onDarkSide && !blinkingOff ? 0xaaaaff : 0x000000}
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
                emissive={onDarkSide && !blinkingOff ? 0xaaaaff : 0x000000}
                opacity={1}
                transparent
                transmission={0.4}
                depthWrite={false}
                side={BackSide}
              />
            </mesh>
          </mesh>
          <mesh visible geometry={lowDetailNodes['griddy-thing'].geometry}>
            <meshPhysicalMaterial
              attach="material"
              color={0xddeeff}
              roughness={0.2}
              metalness={0.8}
              emissive={onDarkSide && !blinkingOff ? 0xaaaaff : 0x000000}
              opacity={1}
              transparent
              transmission={0.4}
              depthWrite={false}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 3]}>
          <mesh visible geometry={nodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xeeffff}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xeeffff}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 6]}>
          <mesh visible geometry={nodes['top-light-2'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xddddff}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['top-light-2'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xddddff}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 6]}>
          <mesh visible geometry={nodes['outer-liner'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_DARK_COLOR}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['outer-liner'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_DARK_COLOR}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 6]}>
          <mesh visible geometry={nodes['hanger'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['hanger'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 6]}>
          <mesh visible geometry={nodes['griddy-thing-case'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.1}
              metalness={0.8}
              map={nodes['griddy-thing-case'].material.map}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['griddy-thing-case'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 6]}>
          <mesh visible geometry={nodes['inner-body'].geometry}>
            <meshStandardMaterial
              attach="material"
              roughness={0.1}
              metalness={0.8}
              color={BODY_HIGHLIGHT_COLOR}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['inner-body'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
      </group>
    )})
  return (
    <group>
      {meshObjects}
    </group>
  );
}
