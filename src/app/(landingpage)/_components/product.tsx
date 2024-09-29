import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Smartphone, Database, Zap, Building2, Workflow, Brain, Wifi, Gamepad2, Bitcoin, QrCode, VrHeadset } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Image, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

const products = [
  { title: 'Web App Development', description: 'Custom web applications tailored to your needs', icon: Code, videoId: 'dQw4w9WgXcQ' },
  { title: 'Mobile App Development', description: 'Native and cross-platform mobile solutions', icon: Smartphone, videoId: 'dQw4w9WgXcQ' },
  { title: 'Data Analytics', description: 'Unlock insights from your data', icon: Database, videoId: 'dQw4w9WgXcQ' },
  { title: 'Business Automation', description: 'Streamline your operations', icon: Zap, videoId: 'dQw4w9WgXcQ' },
  { title: 'BIM Technology', description: 'Advanced building information modeling', icon: Building2, videoId: 'dQw4w9WgXcQ' },
  { title: 'API Integration', description: 'Seamless connection of systems', icon: Workflow, videoId: 'dQw4w9WgXcQ' },
  { title: 'AI ProductSection', description: 'AI model training and applications', icon: Brain, videoId: 'dQw4w9WgXcQ' },
  { title: 'IoT (Internet of Things)', description: 'Connect and control smart devices', icon: Wifi, videoId: 'dQw4w9WgXcQ' },
  { title: 'Gamification', description: 'Engage users through game mechanics', icon: Gamepad2, videoId: 'dQw4w9WgXcQ' },
  { title: 'Blockchain', description: 'Secure and decentralized solutions', icon: Bitcoin, videoId: 'dQw4w9WgXcQ' },
  { title: 'QR Technology', description: 'Quick Response code solutions', icon: QrCode, videoId: 'dQw4w9WgXcQ' },
  { title: 'VR & AR', description: 'Immersive virtual and augmented experiences', icon: VrHeadset, videoId: 'dQw4w9WgXcQ' },
];

const ProductCard = ({ service, index }) => {
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
        <Card isPressable onPress={handleOpen} className="w-full h-[300px]">
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">{service.title}</p>
            <h4 className="text-white/90 font-medium text-xl">{service.description}</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt={service.title}
            className="z-0 w-full h-full object-cover"
            src={`https://source.unsplash.com/random/800x600?${service.title.toLowerCase().replace(/ /g, '-')}`}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <service.icon className="w-10 h-11 text-white" />
              <p className="text-tiny text-white/60">Learn More</p>
            </div>
            <Button radius="full" size="sm" color="primary">Explore</Button>
          </CardFooter>
        </Card>
      </motion.div>
      <StepCard
        title={service.title}
        content={
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${service.videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onClose={handleClose}
      />
    </>
  );
}

const StepCard = ({ title, content, isOpen, onOpenChange, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
      aria-labelledby="modal-title"
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
      classNames={{
        wrapper: 'z-[99999]',
        body: 'py-6',
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
        header: 'border-b-[1px] border-[#292f46]',
        footer: 'border-t-[1px] border-[#292f46]',
        closeButton: 'hover:bg-white/5 active:bg-white/10',
      }}
    >
      <ModalContent>
       {(onClose) => (
        <>
          <ModalHeader>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div>
                {content}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button auto flat color="error" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </>
      )}
      </ModalContent>
    </Modal>
  );
}

const ProductSection = () => {
  const [visibleProductSection, setVisibleProductSection] = useState(8);

  return (
    <section id="products" className="py-20 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {products.slice(0, visibleProductSection).map((service, index) => (
              <ProductCard key={index} service={service} index={index} />
            ))}
          </AnimatePresence>
        </div>
        {visibleProductSection < products.length && (
          <div className="text-center mt-12">
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleProductSection(prev => Math.min(prev + 4, products.length))}
            >
              Load More
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;