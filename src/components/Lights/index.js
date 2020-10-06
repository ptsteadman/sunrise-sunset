import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.4} />
      <mesh position={[-200, -10, 0]} layers={[0, 11]} userData={{ bloom: true }}>
        <sphereBufferGeometry attach="geometry" args={[4, 32, 32]} />
        <meshBasicMaterial attach="material" color="#EEEE88" fog={false} />
      </mesh>
      <directionalLight
        intensity={1.5}
        position={[-1, 0, 0]}
        color={0xffffe4}
      />
    </group>
  );
};
