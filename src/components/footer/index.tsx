"use client"
import React, { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import { SocialIcon } from 'react-social-icons';
import { Grid, Typography, Container, Box, InputAdornment, TextField } from '@mui/material';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useGSAP } from "@gsap/react";
import { Decal, Float, OrbitControls, Preload, useTexture, Text, Billboard, Sphere, MeshDistortMaterial, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Center, Instance, Instances } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { CustomMaterial } from "./material";
import { Canvas } from '@react-three/fiber';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowRight, ChevronDown, ChevronUp } from 'react-feather'; 

const SocialLink = ({ href, network, bgColor }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className="inline-block w-12 h-12 rounded-full bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
      whileHover={{
        boxShadow: `0 0 20px ${bgColor}`,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-75"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ backgroundColor: bgColor }}
      />
      <SocialIcon
        target="_blank"          
        url={href}
        network={network}
        bgColor="transparent"
        fgColor="#ffffff"
        style={{ height: '100%', width: '100%' }}
      />
    </motion.div>
  </motion.div>
);

const SocialLinks = () => (
  <motion.div
    className="flex justify-center space-x-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, staggerChildren: 0.1 }}
  >
    <SocialLink href="https://www.linkedin.com/in/nguyen-dat-5b1812324/" network="linkedin" bgColor="#0077B5" />
    <SocialLink href="https://github.com/ceowapp" network="github" bgColor="#333" />
    <SocialLink href="https://www.facebook.com/people/WApp-Inc/61564944704482/" network="facebook" bgColor="#1877F2" />
    <SocialLink href="https://www.youtube.com/@wappadmin-k3q" network="youtube" bgColor="#FF0000" />
    <SocialLink href="https://x.com/ceowapp" network="twitter" bgColor="#1DA1F2" />
  </motion.div>
);

/*const AnimatedComponent = () => {
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
};*/

const AnimatedComponent = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const cone1Ref = useRef<THREE.Mesh>(null);
  const cone2Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (
      ring1Ref.current &&
      ring2Ref.current &&
      cone1Ref.current &&
      cone2Ref.current &&
      groupRef.current
    ) {
      gsap
        .timeline({
          repeat: -1,
        })
        .to(
          ring1Ref.current.rotation,
          {
            z: `+=${Math.PI * 2}`,
            x: `+=${Math.PI * 2}`,

            duration: 4,
            ease: "none",
          },
          0
        )
        .to(
          ring2Ref.current.rotation,
          {
            z: `-=${Math.PI * 2}`,
            x: `-=${Math.PI * 2}`,

            ease: "none",
            duration: 4,
          },
          0
        )
        .to(
          groupRef.current.rotation,
          {
            y: Math.PI * 2,
            duration: 4,
            ease: "none",
          },
          0
        );
    }
  }, []);
  return (
    <Center ref={groupRef} scale={9.6}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.1, 0.1]}></torusGeometry>
        <CustomMaterial></CustomMaterial>
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.1]}></torusGeometry>
        <CustomMaterial></CustomMaterial>
      </mesh>
      <group scale={0.8}>
        <mesh position={[0, 1, 0]} rotation={[0, 0, 0]} ref={cone1Ref}>
          <coneGeometry args={[1, 1.41, 4]}></coneGeometry>
          <CustomMaterial></CustomMaterial>
        </mesh>
        <mesh position={[0, -1, 0]} rotation={[-Math.PI, 0, 0]} ref={cone2Ref}>
          <coneGeometry args={[1, 1.41, 4]}></coneGeometry>
          <CustomMaterial></CustomMaterial>
        </mesh>
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

const ExpandableFooterLinks = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const services = [
    "WApp Document Editor",
    "WApp Code Editor",
    "WApp Image Editor",
    "WApp Video Editor",
    "WApp Audio Editor",
    "WApp Central Hub",
    "WApp Book",
    "WApp Music",
    "WApp AI Tranining",
    "WApp Marketing",
    "WApp Ecommerce",
  ];

  return (
    <motion.div layout>
      <ul className="text-left space-y-2">
        {services.slice(0, 6).map((service, index) => (
          <FooterLink key={index} href="/myspace/apps">
            {service}
          </FooterLink>
        ))}
      </ul>
      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            className="text-left space-y-2 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {services.slice(6).map((service, index) => (
              <FooterLink key={index + 6} href="/myspace/apps">
                {service}
              </FooterLink>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <motion.button
        className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors duration-300 flex items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="mr-2">{isExpanded ? 'Collapse' : 'Expand'}</span>
        <motion.div
          initial={false}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

const TelamonixLink = () => (
  <motion.li
    className="py-2 mt-6"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link target="_blank" href="https://telamonix.vercel.app/" passHref>
      <motion.div className="flex items-center justify-between bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300">
        <span className="mr-2">Telamonix Services</span>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowRight className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </Link>
  </motion.li>
);

const Footer = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
  };

  return (
    <Box component="footer" className="bg-gradient-to-b px-14 from-black/90 via-gray-900 to-gray-800/90 text-white py-12">
      <Container maxWidth="xl">
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
             <form onSubmit={handleSearchSubmit} className="flex text-gray-50 justify-center mt-16">
              <TextField
                variant="outlined"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                  className: "bg-gray-800 text-white rounded-full border-gray-600 hover:border-gray-400 transition-colors duration-300",
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
                className="w-full text-white max-w-md"
              />
            </form>
            <div className="footer-link footer-link-quickaccess">
              <a href="#" className="slant">Explore</a>
              <a href="#" className="liquid">Visit</a>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              PRODUCTS
            </Typography>
            <ul className="text-left space-y-2">
              <ExpandableFooterLinks />
              <TelamonixLink />
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
            <Box className="flex justify-start mt-8 overflow-x-auto py-8">
             <SocialLinks />
            </Box>
          </Grid>
        </Grid>
        <Box className="relative flex items-center justify-center mt-12 mobileL:absolute mobileL:bottom-96 mobileL:right-6 mobileXL:bottom-52 mobileXL:right-16">
          <Box style={{ width: '200px', height: '200px' }}>
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


