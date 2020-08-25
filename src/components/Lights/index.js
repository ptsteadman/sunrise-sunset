import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight
        intensity={0.9}
        position={[-1, -1, 0]}
        castShadow
      />
    </group>
  );
};
