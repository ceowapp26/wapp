import React, { useState, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Code, FileText, Image, Music, Video, BookOpen, ShoppingCart, TrendingUp, Cpu, Database, Wifi, Palette } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tabs, Tab, Input, Textarea, Select, SelectItem } from "@nextui-org/react";

const products = [
  { id: "code", title: 'Code Editor', description: 'Powerful web-based IDE with advanced features', icon: Code, videoId: 'dQw4w9WgXcQ' },
  { id: "document", title: 'Document Editor', description: 'Collaborate and create stunning documents', icon: FileText, videoId: 'dQw4w9WgXcQ' },
  { id: "image", title: 'Image Editor', description: 'Professional-grade photo editing tools', icon: Image, videoId: 'dQw4w9WgXcQ' },
  { id: "audio", title: 'Audio Editor', description: 'Mix, master, and produce high-quality audio', icon: Music, videoId: 'dQw4w9WgXcQ' },
  { id: "video", title: 'Video Editor', description: 'Create cinematic videos with ease', icon: Video, videoId: 'dQw4w9WgXcQ' },
  { id: "book", title: 'Book App', description: 'Your personal digital library and reading companion', icon: BookOpen, videoId: 'dQw4w9WgXcQ' },
  { id: "ecommerce", title: 'Ecommerce App', description: 'Build and manage your online store', icon: ShoppingCart, videoId: 'dQw4w9WgXcQ' },
  { id: "marketing", title: 'Marketing App', description: 'Boost your brand with powerful marketing tools', icon: TrendingUp, videoId: 'dQw4w9WgXcQ' },
  { id: "training", title: 'AI Training', description: 'Train and deploy custom AI models', icon: Cpu, videoId: 'dQw4w9WgXcQ' },
  { id: "central", title: 'Central Hub', description: 'Unified system management and analytics', icon: Database, videoId: 'dQw4w9WgXcQ' },
  { id: "service", title: 'Other Services', description: 'Explore our comprehensive tech solutions', icon: Wifi, videoId: 'dQw4w9WgXcQ' },
  { id: "design", title: 'Design Studio', description: 'Create stunning visuals with our design tools', icon: Palette, videoId: 'dQw4w9WgXcQ' },
];

const ProductContent = memo(({ productId }) => {
  const contentMap = {
    code: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Advanced Code Editor</h3>
        <p className="text-lg">Our web-based code editor is designed for developers who demand power and flexibility. Experience the future of coding with our AI-powered features:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "AI-generated codebase",
            "AI-powered chatbot assistant",
            "Dynamic, customizable layout",
            "Integrated project management",
            "Advanced file management",
            "Efficient code navigation",
            "Built-in testing frameworks",
            "Auto deployment to GitHub",
            "AI debugging assistant",
            "Real-time collaboration",
            "Git version control",
            "AI-driven code analysis",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Try it out!</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <code className="text-sm text-green-400">
              // AI-generated code example
              <br />
              function generateAICode() {`{`}
              <br />
              &nbsp;&nbsp;const prompt = "Create a React component";
              <br />
              &nbsp;&nbsp;const aiCode = AICodeGenerator.generate(prompt);
              <br />
              &nbsp;&nbsp;console.log(aiCode);
              <br />
              {`}`}
            </code>
          </motion.div>
        </div>
      </motion.div>
    ),
    document: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Collaborative Document Editor</h3>
        <p className="text-lg">Transform your writing process with our AI-enhanced document editor. Collaborate seamlessly and create stunning documents with ease:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Real-time multi-user collaboration",
            "AI-powered writing assistance",
            "Advanced formatting options",
            "Version history and tracking",
            "Cloud storage integration",
            "Template library",
            "AI metadata generation",
            "Voice-to-text capabilities",
            "Multi-language support",
            "Automated proofreading",
            "Citation and bibliography tools",
            "Interactive elements and widgets",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Start writing with AI assistance</h4>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Textarea
              placeholder="Type or say 'Hey AI, help me write an introduction about...' "
              minRows={5}
              className="w-full p-4 bg-white/10 rounded-lg border border-gray-600 text-white"
            />
          </motion.div>
        </div>
      </motion.div>
    ),
    image: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">AI-Powered Image Editor</h3>
        <p className="text-lg">Revolutionize your image editing workflow with our cutting-edge AI technologies:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "AI-generated images from text",
            "Intelligent background removal",
            "Advanced photo retouching",
            "Smart object selection",
            "Style transfer and filters",
            "Automatic color correction",
            "AI-assisted cropping and composition",
            "Face retouching and beautification",
            "Text-to-image editing commands",
            "Photorealistic AI upscaling",
            "Generative fill and inpainting",
            "Artistic style transfer",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Try AI image generation</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              placeholder="Describe the image you want to create..."
              className="w-full mb-4"
            />
            <Button color="primary">Generate Image</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    audio: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">AI-Enhanced Audio Editor</h3>
        <p className="text-lg">Experience the future of audio editing with our AI-powered tools:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Multi-language voice generation",
            "AI voice cloning and customization",
            "Intelligent noise reduction",
            "Automated audio mixing and mastering",
            "Speech-to-text transcription",
            "AI-powered audio effects",
            "Mood-based music generation",
            "Voice style transfer",
            "Adaptive sound design",
            "Automatic podcast editing",
            "Collaborative audio projects",
            "AI-assisted audio restoration",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Generate AI voice</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Textarea
              placeholder="Enter the text you want to convert to speech..."
              minRows={3}
              className="w-full mb-4"
            />
            <Select
              label="Choose a voice"
              className="mb-4"
            >
              <SelectItem key="en-US-female">English (US) - Female</SelectItem>
              <SelectItem key="en-US-male">English (US) - Male</SelectItem>
              <SelectItem key="fr-FR-female">French - Female</SelectItem>
              <SelectItem key="de-DE-male">German - Male</SelectItem>
            </Select>
            <Button color="primary">Generate Audio</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    video: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-500">AI-Powered Video Editor</h3>
        <p className="text-lg">Transform your video content with our cutting-edge AI video editing tools:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "AI-generated video scripts",
            "Automatic video transcription",
            "Intelligent scene detection",
            "AI-powered color grading",
            "Automated video summarization",
            "Smart object tracking",
            "AI-assisted video stabilization",
            "Automatic content moderation",
            "Text-to-video generation",
            "AI-driven special effects",
            "Emotion-based video editing",
            "Personalized video recommendations",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Create AI video</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Textarea
              placeholder="Describe the video you want to create..."
              minRows={3}
              className="w-full mb-4"
            />
            <Button color="primary">Generate Video</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    book: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">AI-Enhanced Book App</h3>
        <p className="text-lg">Dive into a world of literature with our AI-powered book companion:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Personalized book recommendations",
            "AI-generated book summaries",
            "Interactive reading experience",
            "Mood-based book suggestions",
            "Virtual book clubs",
            "AI reading comprehension assistant",
            "Customizable reading interfaces",
            "Cross-platform synchronization",
            "Integrated audiobook player",
            "AI-powered language translation",
            "Interactive character maps",
            "Collaborative annotation features",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Discover your next read</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              placeholder="Enter your favorite book or author..."
              className="w-full mb-4"
            />
            <Button color="primary">Get AI Recommendations</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    ecommerce: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">AI-Powered Ecommerce Platform</h3>
        <p className="text-lg">Revolutionize your online business with our cutting-edge AI ecommerce solutions:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "AI-driven product recommendations",
            "Dynamic pricing optimization",
            "Intelligent inventory management",
            "Personalized shopping experiences",
            "Automated customer service chatbots",
            "Visual search capabilities",
            "Fraud detection and prevention",
            "AI-powered marketing automation",
            "Smart order fulfillment",
            "Predictive analytics for sales",
            "Virtual try-on technology",
            "Voice-activated shopping assistant",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Experience AI-Powered Shopping</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              placeholder="Search for products..."
              className="w-full mb-4"
            />
            <div className="flex space-x-2 mb-4">
              <Select label="Category">
                <SelectItem key="electronics">Electronics</SelectItem>
                <SelectItem key="clothing">Clothing</SelectItem>
                <SelectItem key="home">Home & Garden</SelectItem>
                <SelectItem key="beauty">Beauty & Personal Care</SelectItem>
              </Select>
              <Select label="Sort By">
                <SelectItem key="relevance">Relevance</SelectItem>
                <SelectItem key="price-low">Price: Low to High</SelectItem>
                <SelectItem key="price-high">Price: High to Low</SelectItem>
                <SelectItem key="rating">Customer Rating</SelectItem>
              </Select>
            </div>
            <Button color="primary">AI-Powered Search</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    marketing: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-600">AI-Enhanced Marketing Platform</h3>
        <p className="text-lg">Supercharge your marketing efforts with our AI-powered tools and insights:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "AI-driven content creation",
            "Predictive audience targeting",
            "Automated A/B testing",
            "Multi-channel campaign management",
            "Real-time performance analytics",
            "Sentiment analysis for brand monitoring",
            "Personalized email marketing",
            "AI-powered social media management",
            "Dynamic ad copy generation",
            "Customer journey optimization",
            "Voice search optimization",
            "Influencer discovery and management",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Generate AI Marketing Content</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              placeholder="Enter your product or service..."
              className="w-full mb-4"
            />
            <Select
              label="Content Type"
              className="mb-4"
            >
              <SelectItem key="social-post">Social Media Post</SelectItem>
              <SelectItem key="email">Email Campaign</SelectItem>
              <SelectItem key="ad-copy">Ad Copy</SelectItem>
              <SelectItem key="blog-post">Blog Post</SelectItem>
            </Select>
            <Button color="primary">Generate Content</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    training: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">AI Training and Deployment Platform</h3>
        <p className="text-lg">Empower your team with cutting-edge AI model training and deployment tools:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "No-code AI model creation",
            "AutoML for optimized model selection",
            "Distributed training on cloud infrastructure",
            "Real-time model performance monitoring",
            "One-click model deployment",
            "A/B testing for model variants",
            "Explainable AI features",
            "Transfer learning capabilities",
            "Automated data preprocessing",
            "Model versioning and rollback",
            "Integration with popular ML frameworks",
            "Custom model architecture design",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Start Training Your AI Model</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Select
              label="Choose Model Type"
              className="mb-4"
            >
              <SelectItem key="classification">Classification</SelectItem>
              <SelectItem key="regression">Regression</SelectItem>
              <SelectItem key="nlp">Natural Language Processing</SelectItem>
              <SelectItem key="cv">Computer Vision</SelectItem>
            </Select>
            <Input
              type="file"
              label="Upload Training Data"
              className="mb-4"
            />
            <Button color="primary">Begin Training</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    central: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-600">AI-Powered Central Hub</h3>
        <p className="text-lg">Unify your digital ecosystem with our intelligent central management platform:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Cross-platform file management",
            "AI-driven file organization",
            "Secure file sharing and collaboration",
            "Automated file tagging and metadata",
            "Intelligent search and retrieval",
            "Version control and file history",
            "Integration with cloud storage providers",
            "Real-time synchronization across devices",
            "AI-powered content recommendations",
            "Automated backup and disaster recovery",
            "Advanced permission management",
            "Analytics and usage insights",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Organize Your Digital Workspace</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              placeholder="Search your files..."
              className="w-full mb-4"
            />
            <div className="flex space-x-2">
              <Button color="primary">Upload Files</Button>
              <Button color="secondary">Create Folder</Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    ),
    service: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">Comprehensive AI Services</h3>
        <p className="text-lg">Leverage our full suite of AI-powered services to transform your business:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Custom AI solution development",
            "AI strategy consulting",
            "Data science and analytics",
            "Machine learning model optimization",
            "AI-powered process automation",
            "Natural language processing services",
            "Computer vision solutions",
            "Predictive maintenance systems",
            "AI-enhanced cybersecurity",
            "Chatbot and virtual assistant development",
            "AI ethics and governance consulting",
            "AI-driven business intelligence",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Get Started with AI Services</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Select
              label="Choose a Service"
              className="mb-4"
            >
              <SelectItem key="consulting">AI Strategy Consulting</SelectItem>
              <SelectItem key="development">Custom AI Development</SelectItem>
              <SelectItem key="analytics">Data Analytics Services</SelectItem>
              <SelectItem key="automation">AI-Powered Automation</SelectItem>
            </Select>
            <Button color="primary">Request Consultation</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
    design: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">AI-Powered Design Studio</h3>
        <p className="text-lg">Unleash your creativity with our AI-enhanced design tools:</p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "AI-generated design concepts",
            "Automated layout suggestions",
            "Color palette recommendations",
            "Typography pairing assistant",
            "Smart image editing and enhancement",
            "Brand identity generator",
            "Responsive design automation",
            "3D modeling and rendering",
            "Animation and motion graphics tools",
            "Accessibility checker and optimizer",
            "Design trend analysis and forecasting",
            "Collaborative design workspace",
          ].map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-3">Start Your AI-Powered Design</h4>
          <motion.div 
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              placeholder="Describe your design concept..."
              className="w-full mb-4"
            />
            <Select
              label="Choose Design Type"
              className="mb-4"
            >
              <SelectItem key="logo">Logo Design</SelectItem>
              <SelectItem key="web">Web Design</SelectItem>
              <SelectItem key="print">Print Design</SelectItem>
              <SelectItem key="ui">UI/UX Design</SelectItem>
            </Select>
            <Button color="primary">Generate Design</Button>
          </motion.div>
        </div>
      </motion.div>
    ),
  };

  return contentMap[productId] || <div>Content not available</div>;
});

const ProductCard = ({ product, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card isPressable onPress={handleOpen} className="w-full h-[300px] overflow-hidden group">
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-sm text-gray-900/85 uppercase font-bold">{product.title}</p>
            <h4 className="text-gray-700/90 font-medium text-xl text-start py-2">{product.description}</h4>
          </CardHeader>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
          <img
            alt={product.title}
            className="z-0 w-full h-full object-cover transition-transform duration-300 opacity-20 group-hover:scale-110"
            src={`/global/images/product/${product.id.toLowerCase()}.png`}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-20 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <product.icon className="w-10 h-11 text-white" />
              <p className="text-tiny text-white/60">Learn More</p>
            </div>
            <Button radius="full" size="sm" color="primary">Explore</Button>
          </CardFooter>
        </Card>
      </motion.div>
      <ProductModal
        title={product.title}
        content={<ProductContent productId={product.id} />}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onClose={handleClose}
      />
    </>
  );
}

const ProductModal = ({ title, content, isOpen, onOpenChange, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      backdrop="blur"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }
      }}
      className="bg-gradient-to-br from-purple-700 to-indigo-900"
    >
      <ModalContent>
       {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </ModalHeader>
          <ModalBody className="text-white">
            {content}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </>
      )}
      </ModalContent>
    </Modal>
  );
}

const AnimatedTitle = ({ children }) => {
  return (
    <motion.h2
      className="text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
};

const Products = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedTitle>Our Innovative Products</AnimatedTitle>
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs mx-auto"
          />
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <AnimatePresence>
            {filteredProducts.slice(0, visibleProducts).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {visibleProducts < filteredProducts.length && (
          <div className="text-center mt-12">
            <motion.button
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleProducts(prev => Math.min(prev + 4, filteredProducts.length))}
            >
              Load More
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;



