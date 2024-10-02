"use client"
import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, ContactShadows, useGLTF, useCursor, Text, Html, useHelper } from '@react-three/drei';
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from 'next-themes';
import { FaCode, FaChartLine, FaFlask, FaRobot, FaLayerGroup, FaUserTie, FaUsers } from 'react-icons/fa';
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { Leva, useControls } from "leva";
import { debounce } from "lodash";
import { PointLightHelper } from "three";
import html2canvas from "html2canvas";
import { CustomMaterial } from "./_components/material";

gsap.registerPlugin(ScrollTrigger);

// Shaders
const vertexShader = `
  uniform float time;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float circle(vec2 uv, vec2 circlePosition, float radius) {
    float dist = distance(circlePosition, uv);
    return 1. - smoothstep(0.0, radius, dist);
  }

  float elevation(float radius, float intensity) {
    float circleShape = circle(uv, (uMouse * 0.5) + 0.5, radius);
    return circleShape * intensity;
  }

  void main() {
    vec3 newPosition = position;
    newPosition.z += elevation(0.2, .7);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float circle(vec2 uv, vec2 circlePosition, float radius) {
    float dist = distance(circlePosition, uv);
    return 1. - smoothstep(0.0, radius, dist);
  }

  void main() {
    vec4 finalTexture = texture2D(uTexture, vUv);
    gl_FragColor = finalTexture;
  }
`;

function Model({ name, ...props }) {
  const [hovered, setHovered] = useState(false);
  const { nodes } = useGLTF('/global/draco/compressed.glb');
  useCursor(hovered);

  return (
    <mesh
      onClick={(e) => (e.stopPropagation(), console.log(`Clicked ${name}`))}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      geometry={nodes[name].geometry}
      material={nodes[name].material}
      material-color={hovered ? '#ff6080' : 'white'}
      {...props}
      dispose={null}
    />
  );
}

const useDomToCanvas = (domEl) => {
  const [texture, setTexture] = useState();
  useEffect(() => {
    if (!domEl) return;
    const convertDomToCanvas = async () => {
      const canvas = await html2canvas(domEl, { backgroundColor: null });
      setTexture(new THREE.CanvasTexture(canvas));
    };

    convertDomToCanvas();

    const debouncedResize = debounce(() => {
      convertDomToCanvas();
    }, 100);

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [domEl]);

  return texture;
};

function Lights() {
  const pointLightRef = useRef();

  useHelper(pointLightRef, PointLightHelper, 0.7, "cyan");

  const config = useControls("Lights", {
    color: "#ffffff",
    intensity: { value: 30, min: 0, max: 5000, step: 0.01 },
    distance: { value: 12, min: 0, max: 100, step: 0.1 },
    decay: { value: 1, min: 0, max: 5, step: 0.1 },
    position: { value: [2, 4, 6] },
  });
  return <pointLight ref={pointLightRef} {...config} />;
}

function AnimatedText() {
  const state = useThree();
  const { width, height } = state.viewport;
  const [domEl, setDomEl] = useState(null);

  const materialRef = useRef();
  const textureDOM = useDomToCanvas(domEl);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: textureDOM },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [textureDOM]
  );

  const mouseLerped = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const mouse = state.mouse;
    mouseLerped.current.x = THREE.MathUtils.lerp(mouseLerped.current.x, mouse.x, 0.1);
    mouseLerped.current.y = THREE.MathUtils.lerp(mouseLerped.current.y, mouse.y, 0.1);
    materialRef.current.uniforms.uMouse.value.x = mouseLerped.current.x;
    materialRef.current.uniforms.uMouse.value.y = mouseLerped.current.y;
  });
  
  return (
    <>
      <Html zIndexRange={[1, 10]} prepend fullscreen>
        <div ref={(el) => setDomEl(el)} className="h-full w-full flex items-center justify-center">
          <p className="text-6xl font-bold text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            EXPLORING <br />
            THE FUTURE <br />
            OF AI
          </p>
        </div>
      </Html>
      <mesh>
        <planeGeometry args={[width, height, 254, 254]} />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          flatShading
          silent
        />
      </mesh>
    </>
  );
}

function TextScene() {
  return (
    <>
      <Leva collapsed={false} flat={true} hidden />
      <div className="absolute top-0 left-0 h-screen w-screen">
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
          }}
          camera={{
            fov: 55,
            near: 0.1,
            far: 200,
            position: [0, 0, 5],
          }}
        >
          <color attach="background" args={['#111']} />
          <AnimatedText />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </>
  );
}

function ResourceModel() {
  return (
    <Canvas 
      camera={{ position: [0, 0, -100], fov: 50 }}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <group position={[0, 0, -5]}>
          <Model name="Curly" position={[1, -11, -20]} rotation={[2, 0, -0]} />
          <Model name="DNA" position={[20, 0, -17]} rotation={[1, 1, -2]} />
          <Model name="Headphones" position={[20, 2, 4]} rotation={[1, 0, -1]} />
          <Model name="Notebook" position={[-21, -15, -13]} rotation={[2, 0, 1]} />
          <Model name="Rocket003" position={[18, 15, -25]} rotation={[1, 1, 0]} />
          <Model name="Roundcube001" position={[-25, -4, 5]} rotation={[1, 0, 0]} scale={0.5} />
          <Model name="Table" position={[1, -4, -28]} rotation={[1, 0, -1]} scale={0.5} />
          <Model name="VR_Headset" position={[7, -15, 28]} rotation={[1, 0, -1]} scale={5} />
          <Model name="Zeppelin" position={[-20, 10, 10]} rotation={[3, -1, 3]} scale={0.005} />
          <ContactShadows rotation-x={Math.PI / 2} position={[0, -4, 0]} opacity={0.4} width={20} height={20} blur={2} far={4} />
        </group>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

const SideBar = ({ activeSection, isVisible, scrollTo }) => {
  const sections = ['Technologies', 'Investment', 'Research', 'AI Models', 'Platforms', 'Founders', 'Team'];
  
  return (
    <motion.div 
      className={`fixed right-0 top-1/2 transform -translate-y-1/2 bg-opacity-90 bg-gray-200 dark:bg-gray-800 p-6 rounded-l-2xl shadow-lg ${isVisible ? 'block' : 'hidden'}`}
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {sections.map((section, index) => (
        <motion.div 
          key={index} 
          className={`my-3 cursor-pointer flex items-center ${activeSection === section ? 'text-blue-600 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollTo(section)}
        >
          {getIcon(section)}
          <span className="ml-2">{section}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

function getIcon(section) {
  switch (section) {
    case 'Technologies': return <FaCode />;
    case 'Investment': return <FaChartLine />;
    case 'Research': return <FaFlask />;
    case 'AI Models': return <FaRobot />;
    case 'Platforms': return <FaLayerGroup />;
    case 'Founders': return <FaUserTie />;
    case 'Team': return <FaUsers />;
    default: return null;
  }
}

export default function ResourcePage() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const sectionRefs = {
    Technologies: useRef(null),
    Investment: useRef(null),
    Research: useRef(null),
    'AI Models': useRef(null),
    Platforms: useRef(null),
    Founders: useRef(null),
    Team: useRef(null),
  };

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        sectionObserver.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          sectionObserver.unobserve(ref.current);
        }
      });
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarVisible(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".resource-item",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, scrollTrigger: {
        trigger: ".resource-item",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }}
    );
  }, []);

  const scrollTo = (section) => {
    sectionRefs[section].current.scrollIntoView({ behavior: 'smooth' });
  };

  const resourceSections = [
    { 
      id: 'Technologies', 
      icon: <FaCode />, 
      items: ['Machine Learning', 'Natural Language Processing', 'Computer Vision'],
      style: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
    },
    { 
      id: 'Investment', 
      icon: <FaChartLine />, 
      items: ['Venture Capital', 'Angel Investing', 'Crowdfunding'],
      style: 'bg-gradient-to-br from-green-400 to-green-600 text-white'
    },
    { 
      id: 'Research', 
      icon: <FaFlask />, 
      items: ['AI Ethics', 'Reinforcement Learning', 'Generative Models'],
      style: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white'
    },
    { 
      id: 'AI Models', 
      icon: <FaRobot />, 
      items: ['GPT-3', 'DALL-E', 'AlphaFold'],
      style: 'bg-gradient-to-br from-red-400 to-red-600 text-white'
    },
    { 
      id: 'Platforms', 
      icon: <FaLayerGroup />, 
      items: ['TensorFlow', 'PyTorch', 'Hugging Face'],
      style: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
    },
    { 
      id: 'Founders', 
      icon: <FaUserTie />, 
      items: ['Demis Hassabis', 'Sam Altman', 'Fei-Fei Li'],
      style: 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white'
    },
    { 
      id: 'Team', 
      icon: <FaUsers />, 
      items: ['Data Scientists', 'ML Engineers', 'Research Scientists'],
      style: 'bg-gradient-to-br from-pink-400 to-pink-600 text-white'
    },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-blue-600 z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="h-screen relative mb-16">
          <TextScene />
          <ResourceModel />
        </div>
        {resourceSections.map((section) => (
          <motion.section
            key={section.id}
            id={section.id}
            ref={sectionRefs[section.id]}
            className={`mb-12 p-8 rounded-xl shadow-lg ${section.style}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-6 flex items-center">
              {section.icon}
              <span className="ml-3">{section.id}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, index) => (
                <motion.div
                  key={index}
                  className="resource-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">{item}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {getDescription(section.id, item)}
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium transition-colors duration-300">
                    Learn more →
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </main>

      <SideBar activeSection={activeSection} isVisible={sidebarVisible} scrollTo={scrollTo} />
    </div>
  );
}

function getDescription(sectionId, item) {
  const descriptions = {
    Technologies: {
      'Machine Learning': 'Algorithms that improve through experience and data',
      'Natural Language Processing': 'AI for understanding and generating human language',
      'Computer Vision': 'AI systems for interpreting and analyzing visual information'
    },
    Investment: {
      'Venture Capital': 'Funding for high-potential AI startups',
      'Angel Investing': 'Early-stage investments in AI companies',
      'Crowdfunding': 'Collective funding for AI projects and startups'
    },
    Research: {
      'AI Ethics': 'Studying the moral implications of AI development',
      'Reinforcement Learning': 'AI that learns through interaction with its environment',
      'Generative Models': 'AI systems that can create new, original content'
    },
    'AI Models': {
      'GPT-3': 'Advanced language model for natural text generation',
      'DALL-E': 'AI model that creates images from text descriptions',
      'AlphaFold': 'AI system for predicting protein structures'
    },
    Platforms: {
      'TensorFlow': 'Open-source platform for machine learning',
      'PyTorch': 'Deep learning framework for fast, flexible experimentation',
      'Hugging Face': 'Platform for sharing and collaborating on AI models'
    },
    Founders: {
      'Demis Hassabis': 'Co-founder and CEO of DeepMind',
      'Sam Altman': 'CEO of OpenAI',
      'Fei-Fei Li': 'Co-director of Stanford Human-Centered AI Institute'
    },
    Team: {
      'Data Scientists': 'Experts in extracting insights from complex datasets',
      'ML Engineers': 'Specialists in implementing and deploying ML models',
      'Research Scientists': 'Innovators pushing the boundaries of AI capabilities'
    }
  };

  return descriptions[sectionId][item] || 'Description not available';
}

