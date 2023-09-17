import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import { Color } from "three";
import { OrbitControls } from "@react-three/drei";
const Scene = () => {
  const fragmentShader = `
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  varying float vZ;
  
  
  void main() {
    vec3 color = mix(u_colorA, u_colorB, vZ * 2.0 + 0.5); 
    gl_FragColor = vec4(color, 1.0);
  }
  
`;
  const vertexShader = `
  uniform float u_time;
 
varying float vZ;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  modelPosition.y += sin(modelPosition.x * 5.0 + u_time * 3.0) * 0.1;
  modelPosition.y += sin(modelPosition.z * 6.0 + u_time * 2.0) * 0.1;
  
  vZ = modelPosition.y;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
  `;
  const MovingPlane = () => {
    const mesh = useRef();
    const uniforms = useMemo(
      () => ({
        u_time: {
          value: 0.0,
        },
        u_colorA: { value: new Color("#FFFFFF") },
        u_colorB: { value: new Color("#FEB3D9") },
      }),
      []
    );

    useFrame((state) => {
      const { clock } = state;
      mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    });

    return (
      <mesh
        ref={mesh}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={1.5}
      >
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
            wireframe
        />
      </mesh>
    );
  };
  return (
    <Canvas camera={{ position: [1.0, 1.5, 1.0] }}>
      <MovingPlane />
      <axesHelper />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
