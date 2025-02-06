import { useCallback, useEffect, useMemo, useRef } from 'react';

import vertexShader from '../assets/vertexShader.glsl';
import fragmentShader from '../assets/fragmentShader.glsl';
import { Canvas, useFrame } from '@react-three/fiber';

import { MathUtils, Mesh, ShaderMaterial, Vector2, Vector3 } from 'three';

const Blob = ({ sentiment, isLoading = false }: { sentiment?: string, isLoading?: boolean; }) => {
  const mesh = useRef<Mesh>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Store the target color for smooth transition
  const targetColor = useRef(new Vector3(1.0, 1.0, 1.0)); // Initial white

  const updateMousePosition = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event;
    mousePosition.current.x = (clientX / window.innerWidth) * 2 - 1;
    mousePosition.current.y = -(clientY / window.innerHeight) * 2 + 1;
  }, []);

  const uniforms = useMemo(
    () => ({
      u_intensity: { value: 0.3 },
      u_time: { value: 0.0 },
      u_mouse: { value: new Vector2(0, 0) },
      u_color: { value: new Vector3(1.0, 1.0, 1.0) }
    }),
    []
  );

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition, false);
    return () => window.removeEventListener('mousemove', updateMousePosition, false);
  }, [updateMousePosition]);

  useEffect(() => {
    if (sentiment === "Negative") {
      targetColor.current.set(1.0, 0.3, 0.4);
    } else if (sentiment === "Positive") {
      targetColor.current.set(0.6, 1.0, 0.0);
    } else if (sentiment === "Neutral") {
      targetColor.current.set(1.0, 1.0, 1.0);
    }
  }, [sentiment]);

  useFrame((state) => {
    const { clock } = state;
    if (!mesh.current) return;

    const shaderMaterial = mesh.current.material as ShaderMaterial;

    shaderMaterial.uniforms.u_time.value = 0.4 * clock.getElapsedTime();

    shaderMaterial.uniforms.u_intensity.value = MathUtils.lerp(
      shaderMaterial.uniforms.u_intensity.value,
      !isLoading ? 0.20 : 0.01,
      0.02
    );

    shaderMaterial.uniforms.u_mouse.value.set(mousePosition.current.x, mousePosition.current.y);

    shaderMaterial.uniforms.u_color.value.lerp(targetColor.current, 0.05);

    mesh.current.rotation.y = -0.5 * (1 + Math.sin(clock.getElapsedTime()) * 0.1);
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={2}>
      <icosahedronGeometry args={[2, 100]} />
      <shaderMaterial fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} wireframe={false} />
    </mesh>
  );
};

const BlobScene = ({ sentiment, isLoading }: { sentiment?: string; isLoading?: boolean; }) => (
  <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
    <pointLight position={[10, 10, 10]} />
    <Blob sentiment={sentiment} isLoading={isLoading} />
  </Canvas>
);

export default BlobScene;
