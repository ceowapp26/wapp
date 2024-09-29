import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatedItem } from './animated-item';
import * as THREE from 'three';
import { generate } from 'random-words';
import { Decal, Float, OrbitControls, Preload, useTexture, Text, Billboard, Sphere, MeshDistortMaterial, useGLTF, Environment, ContactShadows } from '@react-three/drei';

const Word = ({ children, ...props }) => {
  const color = new THREE.Color();
  const fontProps = { 
    font: './fonts/Inter-Bold.woff', 
    fontSize: 1.5, 
    letterSpacing: -0.05, 
    lineHeight: 1, 
    'material-toneMapped': false 
  };

  return (
    <Billboard {...props}>
      <Text {...fontProps}>{children}</Text>
    </Billboard>
  );
};

const Cloud = ({ count = 4, radius = 20 }) => {
  const words = React.useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++) 
        temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), generate()]);
    return temp;
  }, [count, radius]);

  return words.map(([pos, word], index) => <Word key={index} position={pos}>{word}</Word>);
};

const Hero3DAnimation = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 90 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <group rotation={[0, 0, 0]}>
            <group rotation={[10, 10.5, 10]}>
              <Cloud count={8} radius={20} />
            </group>
            <AnimatedItem />
          </group>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Hero3DAnimation;