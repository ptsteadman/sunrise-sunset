import React, {
  useRef,
  useState,
  useEffect,
} from "react";
import { useFrame } from "react-three-fiber";

import { MyVolumetricSpotlight } from "./VolumetricSpotlight";


export function Light ({ position, name }) {
  const mesh = useRef();
  const spotlightTarget = useRef();
  const time = useRef(0);


  // const [isHovered, setIsHovered] = useState(false);
  const [isActive] = useState(false);

  const isActiveRef = useRef(isActive);


  // random time mod factor
  // const timeMod = useMemo(() => random(0.1, 4, true), []);

  // color
  // const color = isHovered ? 0xefefef : (isActive ? 0xffffff : 0xeeeeee);

  //useEffect of the activeState
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // raf loop
  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.lookAt(0, 0, 0)
    if (isActiveRef.current) {
      time.current += 0.03;
      mesh.current.position.y = position[1] + Math.sin(time.current) * 0.05;
    }
  });

  // Events
  // const onHover = useCallback(
  //   (e, value) => {
  //     e.stopPropagation();
  //     setIsHovered(value);
  //   },
  //   [setIsHovered]
  // );

  // const onClick = useCallback(
  //   e => {
  //     e.stopPropagation();
  //     setIsActive(v => !v);
  //   },
  //   [setIsActive]
  // );

  // function LightPlaceholder () {
  //   return (
  //     <mesh
  //       ref={mesh}
  //       position={position}
  //       onClick={e => onClick(e)}
  //       onPointerOver={e => onHover(e, true)}
  //       onPointerOut={e => onHover(e, false)}
  //     >
  //       <boxBufferGeometry attach="geometry" args={[0.12, 0.07, 0.05]} />
  //       <meshStandardMaterial
  //         attach="material"
  //         color={color}
  //         transparent
  //         opacity={0.8}
  //       />
  //     </mesh>
  //   )
  // }


  return (
    <group>
      {
        ['Shanghai', 'Berlin', 'New York City', 'London', 'Los Angeles', 'Mumbai', 'Sydney'].includes(name)  && (
          <>
            <mesh
              ref={spotlightTarget}
              position={[position[0] * 10, position[1] * 10, position[2] * 10]}
            >
            </mesh>
            <pointLight
              args={[0xffffff, 10, 0.15]}
              position={[position[0] * 1.03, position[1] * 1.03, position[2] * 1.03]}
            />
            <MyVolumetricSpotlight
              position={[position[0] * 0.98, position[1] * 0.98, position[2] * 0.98]}
              color={0xccccff}
              target={spotlightTarget}
              intensity={0.1}
            />
          </>
        )
      }
      {/* <LightPlaceholder /> */}
    </group>
  );
};