import React, { useEffect, useRef, createRef } from 'react'
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Vector3 } from "three"
import { Detailed, draco } from "drei"
import shallow from "zustand/shallow"
import {
  PLASTIC_COLOR,
  TURN_SIGNAL_COLOR,
  HEADLIGHT_BODY_COLOR,
  BODY_HIGHLIGHT_COLOR,
  BODY_DARK_COLOR,
  EMISSIVE_COLOR_LASER,
  EMISSIVE_COLOR_STANDARD,
  EMISSIVE_COLOR_LOW,
  EMISSIVE_COLOR_OFF
} from "../../../constants"
import { useStore } from "../../../store"
import { getLightState } from "../../../lib/index"

export function ThreeSeriesHeadlights ({ locations }) {
  const [zoomToMesh, handleHoverMesh, handleUnhoverMesh] = useStore(state => [
    state.zoomToMesh,
    state.handleHoverMesh,
    state.handleUnhoverMesh
  ], shallow)

  // const { nodes } = useGLTF(process.env.PUBLIC_URL + "/three-series-high-lod.glb")
  // const { nodes: lowDetailNodes } = useGLTF(process.env.PUBLIC_URL + "/three-series-low-lod.glb")
  const [highLod, lowLod] = useLoader(
    GLTFLoader,
    [process.env.PUBLIC_URL + "/three-series-high-lod.glb", process.env.PUBLIC_URL + "/three-series-low-lod.glb"],
    draco("https://www.gstatic.com/draco/v1/decoders/")
  );
  const { nodes } = highLod
  const { nodes: lowDetailNodes } = lowLod
  // console.log('nodes:', nodes);

  // const { nodes: lowDetailNodes } = useLoader(
  //   GLTFLoader,
  //   process.env.PUBLIC_URL + "/three-series-low-lod.glb",
  // );

  const refs = useRef(locations.map(() => createRef()))
  const griddyThingRefs = useRef(locations.map(() => createRef()))
  const topLightRefs = useRef(locations.map(() => createRef()))
  const bulbRefs = useRef(locations.map(() => createRef()))
  const envMap = useStore(state => state.envMap)

  useEffect(() => {
    for (const r of refs.current) {
      r.current.lookAt(0,0,0)
      // r.current.rotateX(Math.PI / 2)
      r.current.rotateY( 5.65 * Math.PI / 4)
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
      const topLightLOD = topLightRefs.current[i].current
      topLightLOD.children[0].material.emissive =  onDarkSide ? emissiveColor : EMISSIVE_COLOR_OFF
      topLightLOD.children[1].material.emissive =  onDarkSide ? emissiveColor : EMISSIVE_COLOR_OFF
      topLightLOD.children[0].userData = { bloom: onDarkSide }
      topLightLOD.children[1].userData = { bloom: onDarkSide }
      const bulbs = bulbRefs.current[i].current
      bulbs.material.emissive = turnLightOn ? TURN_SIGNAL_COLOR : onDarkSide ? emissiveColor : EMISSIVE_COLOR_OFF
      bulbs.userData = { bloom: turnLightOn ? true : onDarkSide }
    }
  })


  const meshObjects = locations.map(({ position, name, onDarkSide, blinkingOff, turnLightOn }, i) => {
    return (
      <mesh scale={[0.018, 0.018, 0.018 ]} key={name} position={position} ref={refs.current[i]}>
        <mesh
          visible
          geometry={lowDetailNodes['visor'].geometry}
          onClick={zoomToMesh}
          onPointerOver={handleHoverMesh}
          onPointerOut={handleUnhoverMesh}
        >
          <meshStandardMaterial
            attach="material"
            color={0xeeeeee}
            roughness={0.1}
            metalness={0.95}
            opacity={0.7}
            transparent
            depthWrite={false}
            envMap={envMap}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh visible ref={bulbRefs.current[i]} geometry={nodes['bulbs'].geometry}>
          <meshStandardMaterial
            attach="material"
            roughness={0.1}
            metalness={0.8}
            color={0xaaaaff}
            transparent
            opacity={0.6}
          />
        </mesh>
        <Detailed distances={[0, 3.5]}>
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
        <mesh ref={griddyThingRefs.current[i]} visible geometry={nodes['griddy-thing'].geometry}>
          <meshStandardMaterial
            attach="material"
            color={PLASTIC_COLOR}
            roughness={0.2}
            metalness={0.8}
            opacity={0.6}
            transparent
            depthWrite={false}
          />
        </mesh>
        <Detailed ref={topLightRefs.current[i]} distances={[0, 2]}>
          <mesh visible userData={{ bloom: true }} geometry={nodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xeeffff}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh visible userData={{ bloom: true }} geometry={lowDetailNodes['top-light'].geometry}>
            <meshStandardMaterial
              attach="material"
              color={0xeeffff}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Detailed>
        <Detailed distances={[0, 2]}>
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
        <Detailed distances={[0, 3.2]}>
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
        <Detailed distances={[0, 3.5]}>
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
        <Detailed distances={[0, 1]}>
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
      </mesh>
    )})
  return (
    <group>
      {meshObjects}
    </group>
  );
}
