import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.1} />
      <mesh position={[-200, -10, 0]}>
        <sphereBufferGeometry attach="geometry" args={[4, 32, 32]} />
        <meshBasicMaterial attach="material" color="#FFFF99" fog={false} />
        <pointLight distance={6100} intensity={0.3} color={0xffffcc} />
      </mesh>
      <directionalLight
        intensity={0.5}
        position={[-1, 0, 0]}
        color='white'
      />
    </group>
  );
};
