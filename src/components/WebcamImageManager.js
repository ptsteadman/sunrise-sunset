import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import { Html, useTextureLoader } from "drei";
import { WebGLCubeRenderTarget, Texture } from "three";
import {
  calculateAngleForTime,
} from "../lib"
import { useStore } from "../store"

const hkSrc = 'https://tdcctv.data.one.gov.hk/K121F.JPG?';
const nycSrc = 'http://207.251.86.238/cctv884.jpg?';
const corsProxy = 'https://cors-anywhere.services.computerlab.io';

export function WebcamImageManager ({ locations }) {
  const edgeBlur = useTextureLoader(process.env.PUBLIC_URL + '/edge-blur.png')
  const nycImgRef = useRef()
  const hkImgRef = useRef()
  const [renderTarget] = useState(new WebGLCubeRenderTarget(1024, { generateMipmaps: true }))
  const cubeCamera = useRef()
  const nycWebcamRef = useRef()
  const hkWebcamRef = useRef()
  const nycLocation = locations.find(l => l.name === 'New York City')
  const hkLocation = locations.find(l => l.name === 'Shenzhen')
  const setEnvMap = useStore(state => state.setEnvMap)

  useFrame(({ gl, scene, camera }) => {
    const newNycSrc = `${corsProxy}/${nycSrc}&rand=${Math.floor(new Date().getTime() / 1000)}`
    const newHkSrc = `${corsProxy}/${hkSrc}&rand=${Math.floor(new Date().getTime() / 10000)}`
    cubeCamera.current.update(gl, scene)
    if (newHkSrc !== hkImgRef.current.src) {
      hkImgRef.current.src = newHkSrc
    }
    if (newNycSrc !== nycImgRef.current.src) {
      nycImgRef.current.src = newNycSrc
      cubeCamera.current.rotation.y = - calculateAngleForTime()
      setEnvMap(renderTarget.texture)
    }
  })

  useEffect(() => {
    nycWebcamRef.current.lookAt(0, 0, 0)
    hkWebcamRef.current.lookAt(0, 0, 0)
    nycImgRef.current.onload = () => {
      const tex = new Texture(nycImgRef.current)
      tex.needsUpdate = true
      nycWebcamRef.current.material.map = tex
      nycWebcamRef.current.material.needsUpdate = true
    }
    hkImgRef.current.onload = () => {
      const tex = new Texture(hkImgRef.current)
      tex.needsUpdate = true
      hkWebcamRef.current.material.map = tex
      hkWebcamRef.current.material.needsUpdate = true
    }
  }, [])


  return (
    <>
      <cubeCamera
        layers={[11]}
        name="cubeCamera"
        ref={cubeCamera}
        position={[0, 0, 0]}
        // i. notice how the renderTarget is passed as a constructor argument of the cubeCamera object
        args={[0.1, 25, renderTarget]}
      />
      <mesh
        layers={[11]}
        ref={nycWebcamRef}
        position={[nycLocation.position[0] * 1.1, nycLocation.position[1] * 1.1, nycLocation.position[2] * 1.1]}
      >
         <planeGeometry args={[13, 8]} />
         <meshBasicMaterial alphaMap={edgeBlur} transparent color={0xbbbbbb} />
      </mesh>
      <mesh
        layers={[11]}
        ref={hkWebcamRef}
        userData={{ hidden: true }}
        position={[hkLocation.position[0] * 1.1, hkLocation.position[1] * 1.1, hkLocation.position[2] * 1.1]}
      >
         <planeGeometry args={[10, 8]} />
         <meshBasicMaterial alphaMap={edgeBlur} transparent color={0xbbbbbb} />
      </mesh>
      <Html>
        <img alt='nyc traffic cam' style={{ display: 'none' }} crossOrigin="anonymous" ref={nycImgRef} src={`${corsProxy}/${nycSrc}`} />
        <img alt='nyc traffic cam' style={{ display: 'none' }} crossOrigin="anonymous" ref={hkImgRef} src={`${corsProxy}/${hkSrc}`} />
      </Html>
    </>
  )
}
