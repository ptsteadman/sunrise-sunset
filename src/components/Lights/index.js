import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight
        intensity={1.4}
        position={[-1, -1, 0]}
      />
    </group>
  );
};
