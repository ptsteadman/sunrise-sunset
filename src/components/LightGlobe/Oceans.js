import React from "react"
import { useTextureLoader } from "drei"
import { Vector2, RepeatWrapping } from "three"

const WIDTH_SEGMENTS = 23
const HEIGHT_SEGMENTS = 23

export function Oceans ({ radius }) {
  const topo = useTextureLoader(process.env.PUBLIC_URL + '/topo-black-level.png')
  const ocean = useTextureLoader(process.env.PUBLIC_URL + '/ocean-texture.png')
  topo.offset = new Vector2(0.5, 0)
  topo.wrapS = RepeatWrapping
  ocean.offset = new Vector2(0.5, 0)
  ocean.wrapS = RepeatWrapping
  return (
    <mesh>
      <sphereBufferGeometry args={[radius - 0.1, WIDTH_SEGMENTS, HEIGHT_SEGMENTS]} />
      <meshPhongMaterial
        color={0xeeeeff}
        alphaMap={topo}
        map={ocean}
        shininess={30}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
