import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.1} />
      <directionalLight
        intensity={0.5}
        position={[-1, 0, 0]}
      />
    </group>
  );
};
