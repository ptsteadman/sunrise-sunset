import React, { useEffect, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Html } from "drei";
import { CubeTexture } from "three";

const corsProxy = 'http://cors-anywhere.services.computerlab.io:8080';

export function WebcamImageManager ({ src, handleUpdateCubeMap }) {
  const imgRef = useRef();

  useFrame(() => {
    const newSrc = `${corsProxy}/${src}&rand=${Math.floor(new Date().getTime() / 1000)}`
    if (newSrc !== imgRef.current.src) imgRef.current.src = newSrc
  })

  useEffect(() => {
    imgRef.current.onload = () => {
      const inputWidth = imgRef.current.naturalWidth;
      const inputHeight = imgRef.current.naturalHeight;

      // const dy = inputHeight / 3;
      // const dx = Math.floor(inputWidth / 3);

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

      const outputImage = document.createElement('canvas');

      // let ctx
      // const emptySmallImage = document.createElement('canvas');
      // emptySmallImage.width = dx;
      // emptySmallImage.height = dx;
      // // create a canvas that will present the output image
      // const px = document.createElement('canvas');
      // px.width = dx;
      // px.height = dx;
      // ctx = px.getContext('2d')
      // ctx.drawImage(imgRef.current, 2 * dx, 0, dx, dx, 0, 0, dx, dx);
      // const nx = document.createElement('canvas');
      // nx.width = dx;
      // nx.height = dx;
      // ctx = nx.getContext('2d')
      // ctx.drawImage(imgRef.current, 0, 0, dx, dx, 0, 0, dx, dx);
      // const pz = document.createElement('canvas');
      // pz.width = dx;
      // pz.height = dx;
      // ctx = pz.getContext('2d')
      // ctx.drawImage(imgRef.current, dx, 0, dx, dx, 0, 0, dx, dx);
      // const py = document.createElement('canvas');
      // py.width = dx;
      // py.height = dx;
      // ctx = py.getContext('2d')
      // ctx.drawImage(imgRef.current, dx, 0, dx, dx, 0, 0, dx, dx);
      // const ny = document.createElement('canvas');
      // ny.width = dx;
      // ny.height = dx;
      // ctx = ny.getContext('2d')
      // ctx.drawImage(imgRef.current, dx, 2 * dx, dx, dx, 0, 0, dx, dx);


      // const emptyImage = document.createElement('canvas');

      // set it to the same size as the image
      outputImage.width = outputWidth;
      outputImage.height = outputHeight;
      // emptyImage.width = outputWidth;
      // emptyImage.height = outputHeight;

      // draw our image at position 0, 0 on the canvas
      let ctx = outputImage.getContext('2d');
      ctx.drawImage(imgRef.current, 0, 0);

      // show both the image and the canvas

      // const map = new CubeTexture(
      //   [px, nx, emptySmallImage, emptySmallImage, pz, pz ]
      // )

      const map = new CubeTexture(
        [outputImage, outputImage, outputImage, outputImage, outputImage, outputImage ]
      )
      map.needsUpdate = true;
      handleUpdateCubeMap(map)
    }
  }, [handleUpdateCubeMap])


  return (
    <Html>
      <img alt='nyc traffic cam' style={{ display: 'none' }} crossOrigin="anonymous" ref={imgRef} src={`${corsProxy}/${src}`} />
    </Html>
  )
}
