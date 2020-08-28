import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.2} />
      <directionalLight
        intensity={1.5}
        position={[-1, 0, 0]}
      />
    </group>
  );
};
