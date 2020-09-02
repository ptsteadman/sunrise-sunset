import React, { useEffect, useRef, createRef } from 'react'
import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { draco, Html } from "drei";
import { RepeatWrapping, CubeTexture } from "three";


export function EightSeriesHeadlightManager ({ positions }) {
  const imgRef = useRef()
  const [cubeMap, setCubeMap] = React.useState(null)
  const { nodes } = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/headlight-simpler-origin.glb",
    draco(process.env.PUBLIC_URL + "/draco-gltf/")
  );

  const refs = useRef(positions.map(() => createRef()))
  useEffect(() => {
    imgRef.current.onload = () => {
      const inputWidth = imgRef.current.naturalWidth;
      const inputHeight = imgRef.current.naturalHeight;

      // get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight;
      const outputImageAspectRatio = 1;

      // if it's bigger than our target aspect ratio
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (inputImageAspectRatio > outputImageAspectRatio) {
        outputWidth = inputHeight * outputImageAspectRatio;
      } else if (inputImageAspectRatio < outputImageAspectRatio) {
        outputHeight = inputWidth / outputImageAspectRatio;
      }

      // create a canvas that will present the output image
      const outputImage = document.createElement('canvas');

      // set it to the same size as the image
      outputImage.width = outputWidth;
      outputImage.height = outputHeight;

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext('2d');
      ctx.drawImage(imgRef.current, 0, 0);

      // show both the image and the canvas

      const map = new CubeTexture(
        [outputImage, outputImage, outputImage, outputImage, outputImage, outputImage ]
      )
      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.needsUpdate = true;
       setCubeMap(map)
      setTimeout(() => {
        imgRef.current.src = 'http://cors-anywhere.services.computerlab.io:8080/http://207.251.86.238/cctv884.jpg?rand=' + Math.random()
      }, 900)
    }

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
        {cubeMap &&
        <mesh visible geometry={nodes['visor'].geometry}>
          <meshPhysicalMaterial
            attach="material"
            color={0xeeeeee}
            roughness={0.05}
            envMap={cubeMap}
            envMapIntensity={2}
            metalness={0.9}
            opacity={1}
            transmission={0.5}
            transparent
            depthWrite={false}
          />
        </mesh>
        }
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
      <Html>
        <img alt='nyc traffic cam' style={{ display: 'none' }} crossOrigin="anonymous" ref={imgRef} src="http://cors-anywhere.services.computerlab.io:8080/http://207.251.86.238/cctv884.jpg" width="200" height="200" />
    </Html>
      {meshObjects}
    </group>
  )
}
