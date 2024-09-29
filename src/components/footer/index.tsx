import React, { useMemo, useRef, Suspense } from 'react';
import { SocialIcon } from 'react-social-icons';
import { Grid, Typography, Container, Box } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGSAP } from "@gsap/react";
import { Decal, Float, OrbitControls, Preload, useTexture, Text, Billboard, Sphere, MeshDistortMaterial, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Center, Instance, Instances } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { CustomMaterial } from "./material";
import { Canvas } from '@react-three/fiber';

const AnimatedComponent = () => {
  const groupRef = useRef<THREE.Group>(null);
  const firstLayerRef = useRef<THREE.Group>(null);
  const secondLayerRef = useRef<THREE.Group>(null);
  const thirdLayerRef = useRef<THREE.Group>(null);

  const blockSize = 1;
  const gap = 0.1;
  const distance = blockSize + gap;

  const layers = useMemo(() => {
    const layer1 = [];
    const layer2 = [];
    const layer3 = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (z === -1) {
            layer1.push(
              new THREE.Vector3(x * distance, y * distance, z * distance)
            );
          } else if (z === 0) {
            layer2.push(
              new THREE.Vector3(x * distance, y * distance, z * distance)
            );
          } else {
            layer3.push(
              new THREE.Vector3(x * distance, y * distance, z * distance)
            );
          }
        }
      }
    }

    return [layer1, layer2, layer3];
  }, [distance]);

  useGSAP(() => {
    if (
      firstLayerRef.current &&
      secondLayerRef.current &&
      thirdLayerRef.current &&
      groupRef.current
    ) {
      gsap
        .timeline({
          repeat: -1,
        })
        .to(firstLayerRef.current.rotation, {
          z: Math.PI,
          duration: 1.5,
        })
        .to(
          secondLayerRef.current.rotation,
          {
            z: Math.PI,
            duration: 1.5,
            delay: 0.15,
          },
          "<"
        )
        .to(
          thirdLayerRef.current.rotation,
          {
            z: Math.PI,
            duration: 1.5,
            delay: 0.25,
          },
          "<"
        )
        .to(
          groupRef.current.rotation,
          {
            y: Math.PI * 2,
            duration: 1.75,
          },
          0
        );
    }
  }, []);

  return (
    <Center scale={10.4}> 
      <group rotation={[0, 0, Math.PI / 8]} scale={1.2}>
        <group rotation={[0, Math.PI / 2, 0]} scale={0.6} ref={groupRef}>
          <Instances>
            <boxGeometry args={[1, 1, 1]}></boxGeometry>
            <CustomMaterial></CustomMaterial>

            <group ref={firstLayerRef}>
              {layers[0].map((item, index) => {
                return <Instance key={index} position={item} />;
              })}
            </group>
            <group ref={secondLayerRef}>
              {layers[1].map((item, index) => {
                return <Instance key={index} position={item} />;
              })}
            </group>
            <group ref={thirdLayerRef}>
              {layers[2].map((item, index) => {
                return <Instance key={index} position={item} />;
              })}
            </group>
          </Instances>
        </group>
      </group>
    </Center>
  );
};

const FooterLink = ({ href, children }) => (
  <motion.li 
    whileHover={{ x: 5 }}
    className="py-2"
  >
    <Link className="text-gray-400 hover:text-white no-underline transition-colors duration-300" href={href}>
      {children}
    </Link>
  </motion.li>
);

const Footer = () => {
  return (
    <Box component="footer" className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <Container maxWidth="lg">
        <Grid container spacing={8} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              COMPANY
            </Typography>
            <ul className="text-left space-y-2">
              <FooterLink href="/support">Contact Us</FooterLink>
              <FooterLink href="/additionals">Contribute</FooterLink>
              <FooterLink href="/additionals">Careers</FooterLink>
              <FooterLink href="/tos">Terms</FooterLink>
              <FooterLink href="/tos">Privacy</FooterLink>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              GUIDES
            </Typography>
            <ul className="text-left space-y-2">
              <FooterLink href="/myspace/apps">WApp-Doc</FooterLink>
              <FooterLink href="/myspace/apps">WApp-Book</FooterLink>
              <FooterLink href="/myspace/apps">WApp-Music</FooterLink>
              <FooterLink href="/myspace/apps">WApp-Portal</FooterLink>
              <FooterLink href="/myspace/apps">WApp-Marketing</FooterLink>
              <FooterLink href="/myspace/apps">WApp-Ecommerce</FooterLink>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              RESOURCES
            </Typography>
            <ul className="text-left space-y-2">
              <FooterLink href="/blogs">Blog</FooterLink>
              <FooterLink href="/support">Customers</FooterLink>
              <FooterLink href="/support">Events</FooterLink>
              <FooterLink href="/support">Documentation</FooterLink>
              <FooterLink href="/support">Community</FooterLink>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              CONTACT
            </Typography>
            <Link className="text-gray-400 hover:text-white transition-colors duration-300" href="mailto:ceowapp@gmail.com">
              ceowapp@gmail.com
            </Link>
            <Box className="flex justify-start space-x-4 mt-6">
              <motion.div whileHover={{ y: -5 }}>
                <SocialIcon url="https://linkedin.com/in/couetilc" className="w-[40px] h-[40px]" />
              </motion.div>
              <motion.div whileHover={{ y: -5 }}>
                <SocialIcon url="https://github.com" className="w-[40px] h-[40px]" bgColor="#ff5a01" />
              </motion.div>
              <motion.div whileHover={{ y: -5 }}>
                <SocialIcon url="https://www.facebook.com/" className="w-[40px] h-[40px]" />
              </motion.div>
            </Box>
          </Grid>
        </Grid>
        <Box className="relative mt-12">
          <Box className="absolute bottom-0 right-0" style={{ width: '150px', height: '150px' }}>
            <Canvas camera={{ position: [0, 0, 30], fov: 90 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <group rotation={[0, 0, 0]}>
                  <AnimatedComponent />
                </group>
              </Suspense>
            </Canvas>
          </Box>
        </Box>
        <Box className="border-t border-gray-700 mt-12 pt-8 text-center">
          <Typography variant="body2" className="text-gray-400">
            &copy; {new Date().getFullYear()} WApp. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;


