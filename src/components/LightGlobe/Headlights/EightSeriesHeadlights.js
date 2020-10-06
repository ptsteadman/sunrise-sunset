import React, { useEffect, useRef, createRef } from 'react'
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Detailed } from "drei";
import { BackSide, Vector3 } from "three";
import shallow from "zustand/shallow"
import {
  PLASTIC_COLOR,
  HEADLIGHT_BODY_COLOR,
  BODY_HIGHLIGHT_COLOR,
  TURN_SIGNAL_COLOR,
  EMISSIVE_COLOR_LASER,
  EMISSIVE_COLOR_STANDARD,
  EMISSIVE_COLOR_OFF,
  EMISSIVE_COLOR_LOW
} from "../../../constants"
import { useStore } from '../../../store'
import { getLightState } from "../../../lib"


export function EightSeriesHeadlights ({ locations }) {
  const [zoomToMesh, handleHoverMesh, handleUnhoverMesh] = useStore(state => [
    state.zoomToMesh,
    state.handleHoverMesh,
    state.handleUnhoverMesh,
  ], shallow)
  const envMap = useStore(state => state.envMap)

  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/eight-series-high-lod.glb",
  );

  const { nodes: lowDetailNodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/eight-series-low-lod.glb",
  );

  const refs = useRef(locations.map(() => createRef()))
  const griddyThingRefs = useRef(locations.map(() => createRef()))
  const griddyThingInsideRefs = useRef(locations.map(() => createRef()))
  const griddyThingLowDetailRefs = useRef(locations.map(() => createRef()))
  const topLightRefs = useRef(locations.map(() => createRef()))

  useEffect(() => {
    for (const r of refs.current) {
      r.current.lookAt(0,0,0)
      // r.current.rotateX(Math.PI / 2)
      r.current.rotateY( 5 * Math.PI / 4)
      // r.current.rotateZ(Math.PI / 4)
    }
  }, [])

  useFrame(() => {
    let worldPos = new Vector3()
    for (let i = 0; i < locations.length; i++) {
      const headlight = refs.current[i].current;
      headlight.getWorldPosition(worldPos)
      const onDarkSide = !!(worldPos.x > 0.1)
      const { lightLaser, turnLightOn, lightLow } = getLightState(i)
      const emissiveColor = lightLaser ? EMISSIVE_COLOR_LASER : lightLow ? EMISSIVE_COLOR_LOW : EMISSIVE_COLOR_STANDARD
      const griddyThing = griddyThingRefs.current[i].current
      griddyThing.material.emissive = onDarkSide ? emissiveColor : false
      griddyThing.userData = { bloom: onDarkSide }
      const griddyThingInside = griddyThingInsideRefs.current[i].current
      griddyThingInside.material.emissive = onDarkSide ? emissiveColor : false
      griddyThingInside.userData = { bloom: onDarkSide }
      const griddyThingLowDetail = griddyThingLowDetailRefs.current[i].current
      griddyThingLowDetail.material.emissive = onDarkSide ? emissiveColor : false
      griddyThingLowDetail.userData = { bloom: onDarkSide }
      const topLightLOD = topLightRefs.current[i].current
      topLightLOD.children[0].material.emissive = turnLightOn ? TURN_SIGNAL_COLOR : onDarkSide ? emissiveColor : EMISSIVE_COLOR_OFF
      topLightLOD.children[1].material.emissive = turnLightOn ? TURN_SIGNAL_COLOR : onDarkSide ? emissiveColor : EMISSIVE_COLOR_OFF
      topLightLOD.children[0].userData = { bloom: turnLightOn ? true : onDarkSide }
      topLightLOD.children[1].userData = { bloom: turnLightOn ? true : onDarkSide }
    }
  })

  const meshObjects = locations.map(({ position, name }, i) => {
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
            roughness={0.1}
            envMap={envMap}
            envMapIntensity={1.5}
            clearcoat={0.7}
            metalness={0.9}
            opacity={1}
            transmission={0.6}
            transparent
            depthWrite={false}
          />
        </mesh>
        <Detailed distances={[0, 3.8]}>
          <mesh visible geometry={nodes['headlight-simpler'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={HEADLIGHT_BODY_COLOR}
              roughness={0.4}
              metalness={0.9}
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
        <Detailed distances={[0, 2]}>
          <mesh>
            <mesh ref={griddyThingRefs.current[i]} visible geometry={nodes['griddy-thing'].geometry}>
              <meshPhysicalMaterial
                attach="material"
                color={PLASTIC_COLOR}
                roughness={0.2}
                metalness={0.8}
                opacity={1}
                transparent
                transmission={0.94}
                depthWrite={false}
              />
            </mesh>
            <mesh ref={griddyThingInsideRefs.current[i]} visible geometry={nodes['griddy-thing'].geometry}>
              <meshPhysicalMaterial
                attach="material"
                color={PLASTIC_COLOR}
                roughness={0.2}
                metalness={0.8}
                opacity={1}
                transparent
                transmission={0.4}
                depthWrite={false}
                side={BackSide}
              />
            </mesh>
          </mesh>
          <mesh visible ref={griddyThingLowDetailRefs.current[i]} geometry={lowDetailNodes['griddy-thing'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={PLASTIC_COLOR}
              roughness={0.2}
              metalness={0.8}
              depthWrite={false}
            />
          </mesh>
        </Detailed>
        <mesh visible geometry={lowDetailNodes['bulbs'].geometry}>
          <meshStandardMaterial
            attach="material"
            color={0xaaaaff}
            roughness={0.3}
            metalness={0.5}
            emissive={0xffffff}
          />
        </mesh>
        <Detailed ref={topLightRefs.current[i]} distances={[0, 2.5]}>
          <mesh visible geometry={nodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xddeeff}
              roughness={0.1}
              metalness={0.8}
              opacity={0.7}
              depthWrite={false}
            />
          </mesh>
          <mesh visible geometry={lowDetailNodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xddeeff}
              roughness={0.1}
              metalness={0.8}
              depthWrite={false}
            />
          </mesh>
        </Detailed>
          <mesh visible geometry={nodes['inner-thing'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={BODY_HIGHLIGHT_COLOR}
              roughness={0.6}
              metalness={0.5}
            />
          </mesh>
      </group>
    )})
  return (
    <group>
      {meshObjects}
    </group>
  );
}
