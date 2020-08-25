import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { random } from "lodash";
import { useFrame } from "react-three-fiber";

export function Light ({ position, name }) {
  const mesh = useRef();
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
  );
};
