import React, { Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimatedItem } from './animated-item';
import * as THREE from 'three';
import { Text, Billboard, OrbitControls, Stars, AdaptiveDpr } from '@react-three/drei';

const aiTechnologies = [
  "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision",
  "Robotics", "Quantum AI", "Edge AI", "Explainable AI", "Generative AI", "Reinforcement Learning",
  "Neural Networks", "Federated Learning", "AutoML", "Transfer Learning", "AI Ethics",
  "Conversational AI", "Cognitive Computing", "Autonomous Systems", "AI Chips", "AI-Powered Analytics"
];

const Word = ({ children, ...props }) => {
  const color = useMemo(() => new THREE.Color(Math.random(), Math.random(), Math.random()), []);
  const fontProps = { 
    font: '/fonts/Inter-Bold.woff', 
    fontSize: 1.5, 
    letterSpacing: -0.05, 
    lineHeight: 1, 
    'material-toneMapped': false 
  };

  const [hovered, setHovered] = React.useState(false);
  const over = (e) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);

  useFrame(({ camera }) => {
    if (hovered) {
      camera.position.lerp(new THREE.Vector3(props.position.x, props.position.y, props.position.z + 5), 0.05);
    }
  });

  return (
    <Billboard {...props}>
      <Text 
        {...fontProps} 
        color={color} 
        onClick={over} 
        onPointerMissed={out}
        scale={hovered ? 1.2 : 1}
        transition={{ duration: 0.2 }}
      >
        {children}
      </Text>
    </Billboard>
  );
};

const Cloud = ({ count = 4, radius = 20 }) => {
  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++) 
        temp.push([
          new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), 
          aiTechnologies[Math.floor(Math.random() * aiTechnologies.length)]
        ]);
    return temp;
  }, [count, radius]);

  return words.map(([pos, word], index) => <Word key={index} position={pos}>{word}</Word>);
};

const Hero3DAnimation = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas 
        camera={{ position: [0, 0, 35], fov: 90 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <group rotation={[0, 0, Math.PI / 4]}>
            <Cloud count={8} radius={20} />
          </group>
          <AnimatedItem />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default Hero3DAnimation;