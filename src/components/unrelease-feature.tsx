"use client"
import React from 'react';
import { Container } from '@mui/material';
import { Card, CardHeader, CardFooter, CardBody, Progress, Divider, Button, Link, Image } from "@nextui-org/react";
import { motion } from "framer-motion";

const UnreleaseFeature = ({ featureName, featureDescription }) => {
  return (
    <Container className="flex justify-center items-center rounded-md w-full h-full mt-6 p-4" maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card   
          isFooterBlurred
          radius="lg"
          className="border-none w-full bg-slate-900"
        >
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={50}
              radius="sm"
              src="/global/company_logos/wapp-logo.png"
              width={50}
            />
            <div className="flex flex-col">
              <p className="text-xl text-white">{featureName}</p>
              <p className="text-small text-default-300">{featureDescription}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col gap-4 px-6 py-16">
            <p className="text-white text-center text-md opacity-80">
              We're working hard to bring you this exciting new feature. Stay tuned!
            </p>
             <Progress
                aria-label="Loading..."
                size="sm"
                isIndeterminate
                classNames={{
                  base: "w-full px-8",
                  track: "bg-white/30",
                  indicator: "bg-white",
                }}
              />
              <p className="justifytext-white text-center text-sm opacity-70">
                Coming Soon
              </p>
          </CardBody>   
          <Divider />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-2 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">Available soon....</p>
            <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
              Notify me
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Container>
  );
};

export default UnreleaseFeature;