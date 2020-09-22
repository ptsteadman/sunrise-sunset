import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <mesh position={[-200, -10, 0]}>
        <sphereBufferGeometry attach="geometry" args={[4, 32, 32]} />
        <meshBasicMaterial attach="material" color="#FFFF99" fog={false} />
      </mesh>
      <directionalLight
        intensity={0.6}
        position={[-1, 0, 0]}
        color={0xfffdf2}
      />
    </group>
  );
};
