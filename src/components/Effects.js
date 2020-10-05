import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

extend({ EffectComposer, RenderPass, UnrealBloomPass })

const materials = {}
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
const transparentDarkMaterial = new THREE.MeshBasicMaterial({ color: 'black', depthWrite: false })
const darkenNonBloomed = obj => {
  if (obj.isMesh && !obj.userData.bloom) {
    materials[obj.uuid] = obj.material
    obj.material = obj.material.depthWrite ? darkMaterial : transparentDarkMaterial
  }
}
const restoreMaterial = obj => materials[obj.uuid] && ((obj.material = materials[obj.uuid]), delete materials[obj.uuid])

export function Effects() {
  const { gl, scene, camera, size } = useThree()
  // const bloomStrength = useControl('Bloom Strength', { type: 'number', value: 2.3 })
  // const bloomThreshold = useControl('Bloom Threshold', { type: 'number', value: 0.2 })
  const bloomStrength = 2
  const bloomThreshold = 0.23

  const [bloom, final] = useMemo(() => {
    const renderScene = new RenderPass(scene, camera)
    const comp = new EffectComposer(gl)
    comp.renderToScreen = false
    comp.addPass(renderScene)
    comp.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), bloomStrength, 0, bloomThreshold))

    const finalComposer = new EffectComposer(gl)
    finalComposer.addPass(renderScene)
    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: { baseTexture: { value: null }, bloomTexture: { value: comp.renderTarget2.texture } },
        vertexShader:
          'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
        fragmentShader:
          'uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main() { gl_FragColor = ( texture2D(baseTexture, vUv) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) ); }'
      }),
      'baseTexture'
    )
    finalPass.needsSwap = true
    finalComposer.addPass(finalPass)
    return [comp, finalComposer]
  }, [camera, gl, scene, size.height, size.width, bloomStrength, bloomThreshold])

  useEffect(() => {
    bloom.setSize(size.width, size.height)
    final.setSize(size.width, size.height)
  }, [bloom, final, size])

  useFrame(({ scene, camera }) => {
    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
    // this seems kinda dirty, it mutates the scene and overwrites materials
    scene.traverse(darkenNonBloomed)
    bloom.render()
    scene.traverse(restoreMaterial)
    // then writes the normal scene on top
    final.render()
  }, 1)

  return null
}

