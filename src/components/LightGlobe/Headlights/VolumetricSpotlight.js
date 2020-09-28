import React, { useEffect, useState } from "react";

// from https://github.com/jeromeetienne/threex.volumetricspotlight
import { useThree, useFrame, extend } from "react-three-fiber";
import VolumetricSpotlight from "../../../lib/volumetric-spotlight";
import * as THREE from "three";

extend({
  VolumetricSpotlight
});

export const MyVolumetricSpotlight = React.forwardRef(function MyVolumetricSpotlight(props, ref) {
  const [initialized, setInitialized] = useState(false);
  const vs = React.useRef();

  const { scene } = useThree();

  const {
    color,
    length = 100,
    position,
    target
  } = props;

  // INIT
  useEffect(() => {
    // scene.add(spotlight.current.target);

    const geometry = vs.current.geometry;

    geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0)
    );
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    vs.current.material.uniforms.spotPosition.value = vs.current.position;

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
    setInitialized(true);
  }, [scene]);

  useFrame(({ clock }) => {
    // spotlight.current.position.copy(vs.current.position);
    // @todo fix this
    // vs.current.material.uniforms.lightColor.value = spotlight.current.color;


    if (target && target.current) {
      const targetPos = new THREE.Vector3();
      target.current.getWorldPosition(targetPos) ;
      vs.current.lookAt(targetPos);
      // spotlight.current.target.position.copy(targetPos);
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
  //   const angle = spotlight.current.angle;

  //   // vs.current.scale.set(1.25 * angle, 1 * angle, 1);
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

      <mesh ref={setRef} position={position}>
        <cylinderGeometry args={[0.05, 0.5, length, 10, 4, true]} attach="geometry" />

        <volumetricSpotlight
          attach="material"
          uniforms-lightColor-value={color}
          uniforms-attenuation-value={initialized ? 6 : 1} // as porportion to height of cylinder
          uniforms-anglePower-value={1.2}
        />
      </mesh>
    </>
  );
});
