import React, { useEffect, useRef, useState, createRef } from "react";
import { useFrame } from "react-three-fiber";
import { Html, useTextureLoader } from "drei";
import { WebGLCubeRenderTarget, Texture } from "three";
import {
  calculateAngleForTime,
} from "../lib"
import { useStore } from "../store"

const corsProxy = 'https://cors-anywhere.services.computerlab.io';

export function WebcamImageManager ({ locations }) {
  const edgeBlur = useTextureLoader(process.env.PUBLIC_URL + '/edge-blur.png')
  const [renderTarget] = useState(new WebGLCubeRenderTarget(1024, { generateMipmaps: true }))
  const cubeCamera = useRef()
  const setEnvMap = useStore(state => state.setEnvMap)

  const webcams = [
    {
      src: 'http://207.251.86.238/cctv884.jpg?',
      location: locations.find(l => l.name === 'New York City'),
      interval: 1.5,
      aspect: 1.46,
      size: 6
    },
    {
      src: 'https://tdcctv.data.one.gov.hk/K121F.JPG?',
      location: locations.find(l => l.name === 'Shenzhen'),
      interval: 30,
      aspect: 1.22,
      size: 6
    },
    {
      src: 'https://s3-eu-west-1.amazonaws.com/jamcams.tfl.gov.uk/00001.01445.jpg?',
      location: locations.find(l => l.name === 'Moscow'),
      interval: 30,
      aspect: 1.22,
      size: 3.5
    },
  ]
  const imgRefs = useRef(webcams.map(() => createRef()))
  const billboardRefs = useRef(webcams.map(() => createRef()))

  useFrame(({ gl, scene, camera }) => {
    let shouldUpdate = false
    for (let i = 0; i < webcams.length; i++) {
      const { src, interval } = webcams[i]
      webcams[i].newSrc = `${corsProxy}/${src}&rand=${Math.floor(new Date().getTime() / (interval * 1000))}`
      if (webcams[i].newSrc !== imgRefs.current[i].current.src) {
        shouldUpdate = true
        cubeCamera.current.update(gl, scene)
        imgRefs.current[i].current.src = webcams[i].newSrc
      }
    }
    if (shouldUpdate) {
      cubeCamera.current.rotation.y = - calculateAngleForTime()
      cubeCamera.current.update(gl, scene)
      setEnvMap(renderTarget.texture)
      for (let i = 0; i < webcams.length; i++) {
        if (webcams[i].newSrc !== imgRefs.current[i].current.src) {
          imgRefs.current[i].current.src = webcams[i].newSrc
        }
      }
    }
  })

  useEffect(() => {
    for (let i = 0; i < webcams.length; i++) {
      billboardRefs.current[i].current.lookAt(0, 0, 0)
      imgRefs.current[i].current.onload = () => {
        const tex = new Texture(imgRefs.current[i].current)
        tex.needsUpdate = true
        billboardRefs.current[i].current.material.map = tex
        // billboardRefs.current[i].current.needsUpdate = true
      }
    }

  }, [webcams.length])

  const billboards = webcams.map(({ location, size, aspect }, i) => (
      <mesh
        key={i}
        layers={[11]}
        ref={billboardRefs.current[i]}
        position={[location.position[0] * 1.1, location.position[1] * 1.1, location.position[2] * 1.1]}
      >
         <planeGeometry args={[size * aspect, size]} />
         <meshBasicMaterial alphaMap={edgeBlur} depthWrite={false} transparent color={0xbbbbbb} />
      </mesh>
  ))

  const images = webcams.map(({ location, src }, i) => (
    <img
      key={i}
      alt='traffic cam'
      style={{ display: 'none' }}
      crossOrigin="anonymous"
      ref={imgRefs.current[i]}
      src={`${corsProxy}/${src}`}
    />
  ))

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
      {billboards}
      <Html>
        {images}
      </Html>
    </>
  )
}
