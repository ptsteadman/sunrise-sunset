import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <mesh position={[-200, -10, 0]} userData={{ bloom: true }}>
        <sphereBufferGeometry attach="geometry" args={[4, 32, 32]} />
        <meshBasicMaterial attach="material" color="#EEEE88" fog={false} />
      </mesh>
      <directionalLight
        intensity={0.8}
        position={[-1, 0, 0]}
        color={0xfffdf2}
      />
    </group>
  );
};
