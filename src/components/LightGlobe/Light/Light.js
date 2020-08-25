import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { random } from "lodash";
import { useFrame } from "react-three-fiber";

import { MyVolumetricSpotlight } from "./VolumetricSpotlight"


export function Light ({ position, name, spotlightTargetPosition }) {
  const mesh = useRef();
  const spotlightTarget = useRef();
  const time = useRef(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const isActiveRef = useRef(isActive);


  // random time mod factor
  const timeMod = useMemo(() => random(0.1, 4, true), []);

  // color
  const color = isHovered ? 0xefefef : (isActive ? 0xffffff : 0xeeeeee);

  //useEffect of the activeState
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // raf loop
  useFrame(() => {
    mesh.current.lookAt(0, 0, 0)
    mesh.current.rotation.y += 0 * timeMod;
    if (isActiveRef.current) {
      time.current += 0.03;
      mesh.current.position.y = position[1] + Math.sin(time.current) * 0.05;
    }
  });

  // Events
  const onHover = useCallback(
    (e, value) => {
      e.stopPropagation();
      setIsHovered(value);
    },
    [setIsHovered]
  );

  const onClick = useCallback(
    e => {
      e.stopPropagation();
      setIsActive(v => !v);
    },
    [setIsActive]
  );

  return (
    <group>
      {
        name == 'Shanghai' && position[0] > 0 && (
          <>
            <mesh
              ref={spotlightTarget}
              position={[position[0] * 10, position[1] * 10, position[2] * 10]}
            >
            </mesh>
            <MyVolumetricSpotlight
              position={[position[0] * 0.98, position[1] * 0.98, position[2] * 0.98]}
              color={0xffffff}
              target={spotlightTarget}
              intensity={3}
            />
          </>
        )
      }
      <mesh
        ref={mesh}
        position={position}
        onClick={e => onClick(e)}
        onPointerOver={e => onHover(e, true)}
        onPointerOut={e => onHover(e, false)}
      >
        <boxBufferGeometry attach="geometry" args={[0.12, 0.07, 0.05]} />
        <meshStandardMaterial
          attach="material"
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};
