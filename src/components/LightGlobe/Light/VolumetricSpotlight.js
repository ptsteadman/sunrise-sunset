import React, { useEffect } from "react";
import { useThree, useFrame, extend } from "react-three-fiber";

import * as THREE from "three";

// from https://github.com/jeromeetienne/threex.volumetricspotlight
import VolumetricSpotlight from "../../../lib/volumetric-spotlight";

extend({
  VolumetricSpotlight
});

export const MyVolumetricSpotlight = React.forwardRef(function MyVolumetricSpotlight(props, ref) {
  const vs = React.useRef();
  const spotlight = React.useRef();

  const { scene } = useThree();

  const {
    angle = 0.15,
    penumbra = 0.6,
    distance = 1,
    color,
    intensity,
    position,
    target
  } = props;

  // INIT
  useEffect(() => {
    scene.add(spotlight.current.target);

    const geometry = vs.current.geometry;

    geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0)
    );
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    vs.current.material.uniforms.spotPosition.value = vs.current.position;

    spotlight.current.position.copy(vs.current.position);
  }, [scene, color, position]);

  useFrame(({ clock }) => {
    spotlight.current.position.copy(vs.current.position);
    // @todo fix this
    vs.current.material.uniforms.lightColor.value = spotlight.current.color;


    if (target && target.current) {
      const targetPos = new THREE.Vector3();
      target.current.getWorldPosition(targetPos) ;
      vs.current.lookAt(targetPos);
      if  (targetPos.x < 0) {
        // vs.current.material.uniforms.lightColor.value = new THREE.Color(0xffe7dd);
        // vs.current.material.uniforms.lightColor.value = new THREE.Color(0xffe7dd);
        vs.current.material.uniforms.attenuation.value = 4;

      }
      spotlight.current.target.position.copy(targetPos);
    }
  });

  const setRef = React.useCallback(function setRef(el) {
    vs.current = el;

    if (ref) {
      ref.current = el;
    }
  }, [ref]);

  // maps spotlight angle to volueme cylinder every frame
  // it would be better to do it on a need-to basis
  // but it doesn't play nice with react-spring
  useFrame(() => {
    const angle = spotlight.current.angle;

    vs.current.scale.set(1 * angle, 1 * angle, 1);
  });

  return (
    <>
      <spotLight
        ref={spotlight}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        color={color}
      />

      <mesh ref={setRef} position={position}>
        <cylinderGeometry args={[0.2, 15, 64, 30, 40, true]} attach="geometry" />

        <volumetricSpotlight
          attach="material"
          uniforms-lightColor-value={color}
          uniforms-attenuation-value={6}
          uniforms-anglePower-value={2}
        />
      </mesh>
    </>
  );
});
