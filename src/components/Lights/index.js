import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <directionalLight
        intensity={2}
        position={[-1, 0, 0]}
      />
    </group>
  );
};
