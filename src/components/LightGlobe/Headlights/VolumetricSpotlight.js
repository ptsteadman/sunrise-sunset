import React, { useEffect, useState } from "react";

// from https://github.com/jeromeetienne/threex.volumetricspotlight
import { useThree, useFrame, extend } from "react-three-fiber";
import VolumetricSpotlight from "../../../lib/volumetric-spotlight";
import { BEAM_COLOR_LASER, BEAM_COLOR_STANDARD } from "../../../constants"
import * as THREE from "three";
import { getLightState } from "../../../lib"

extend({
  VolumetricSpotlight
});

export const MyVolumetricSpotlight = React.forwardRef(function MyVolumetricSpotlight(props, ref) {
  const vs = React.useRef();

  const { scene } = useThree();

  const {
    length,
    position,
    target,
    index,
    angle = 1.2,
    geometryLength = 8,
    openEnded,
    wide
  } = props;
  const { clock } = useThree()

  const [startTime] = useState(clock.elapsedTime)
  // INIT
  useEffect(() => {
    // scene.add(spotlight.current.target);

    const geometry = vs.current.geometry;

    geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0)
    );
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    // vs.current.material.uniforms.spotPosition.value = vs.current.position;

    // spotlight.current.position.copy(vs.current.position);
    // spotlight.current.position.copy(vs.current.position);
    // // @todo fix this
    // vs.current.material.uniforms.lightColor.value = spotlight.current.color;


    // if (target && target.current) {
    //   const targetPos = new THREE.Vector3();
    //   target.current.getWorldPosition(targetPos) ;
    //   vs.current.lookAt(targetPos);
    //   spotlight.current.target.position.copy(targetPos);
    // }
  }, [scene]);

  useFrame(({ clock }) => {
    // spotlight.current.position.copy(vs.current.position);
    // @todo fix this
    // vs.current.material.uniforms.lightColor.value = spotlight.current.color;


    if (target && target.current) {
      const targetPos = new THREE.Vector3()
      target.current.getWorldPosition(targetPos)
      vs.current.lookAt(targetPos)
      vs.current.rotateZ(Math.PI / 12)
      vs.current.rotateY(Math.PI / 12)
      const onDarkSide = !!(targetPos.x > 0.1)
      const { lightLaser, lightHigh } = getLightState(index)
      vs.current.visible = onDarkSide && clock.elapsedTime - startTime > 2
      if (!onDarkSide) return
      vs.current.material.uniforms.lightColor.value = lightLaser ? BEAM_COLOR_LASER : BEAM_COLOR_STANDARD
      if (wide) {
        vs.current.material.uniforms.anglePower.value = lightLaser ? 1.4 : 1.2
        vs.current.scale.set(lightLaser ? 2 : 3.5, 1, 1)
        vs.current.material.uniforms.attenuation.value = 3.9
      } else {
        let lightLength = 4
        if (lightLaser) lightLength = 6
        if (lightHigh) lightLength = 5
        vs.current.material.uniforms.attenuation.value = lightLength
        vs.current.material.uniforms.anglePower.value = lightLaser ? 1.3 : 1.2
        vs.current.scale.set(lightLaser ? 1.5 : 3, 1, 1)
      }
    }
  });

  const setRef = React.useCallback(function setRef(el) {
    vs.current = el;

    if (ref) {
      ref.current = el;
    }
  }, [ref]);

  // // maps spotlight angle to volueme cylinder every frame
  // // it would be better to do it on a need-to basis
  // // but it doesn't play nice with react-spring
  // useFrame(() => {
  //   // const angle = spotlight.current.angle;

  // });

  return (
    <>
      {/* <spotLight */}
      {/*   ref={spotlight} */}
      {/*   intensity={initialized ? intensity : 0} */}
      {/*   angle={angle} */}
      {/*   penumbra={penumbra} */}
      {/*   distance={distance} */}
      {/*   color={color} */}
      {/* /> */}
      <mesh visible={false} ref={setRef} position={position}>
        <cylinderGeometry args={[0.05, 0.25, geometryLength, 12, 1, openEnded]} attach="geometry" />
        <volumetricSpotlight
          attach="material"
          uniforms-attenuation-value={length} // as porportion to height of cylinder
          uniforms-anglePower-value={angle}
        />
      </mesh>
    </>
  );
});
