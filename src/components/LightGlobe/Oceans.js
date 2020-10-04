import React from "react"
import { useTextureLoader } from "drei"
import { Vector2, RepeatWrapping, DoubleSide } from "three"

const WIDTH_SEGMENTS = 20
const HEIGHT_SEGMENTS = 20

export function Oceans ({ radius }) {
  const topo = useTextureLoader(process.env.PUBLIC_URL + '/topo.png')
  topo.offset = new Vector2(0.5, 0)
  topo.wrapS = RepeatWrapping
  return (
    <mesh>
      <sphereBufferGeometry args={[radius - 0.1, WIDTH_SEGMENTS, HEIGHT_SEGMENTS]} />
      <meshPhongMaterial
        color={0xeeeeff}
        alphaMap={topo}
        transparent
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
