"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardBody, CardFooter, CardImage, Button, Input, Spacer, Image, Badge } from "@nextui-org/react";
import { Container, Typography, Box, Grid } from '@mui/material';
import { ShoppingCart, Star } from 'lucide-react';

const products = [
  { id: 1, name: 'Smartphone', price: 699.99, image: '/global/images/platform/UL-Skin-products-1024x846.jpg', rating: 4.8 },
  { id: 2, name: 'Laptop', price: 1299.99, image: '/global/images/platform/UL-Skin-products-1024x846.jpg', rating: 4.6 },
  { id: 3, name: 'Headphones', price: 249.99, image: '/global/images/platform/UL-Skin-products-1024x846.jpg', rating: 4.7 },
  { id: 4, name: 'Tablet', price: 499.99, image: '/global/images/platform/UL-Skin-products-1024x846.jpg', rating: 4.5 },
];

export default function ProductList() {
  return (
    <Grid 
      container 
      spacing={6} 
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={3}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card hoverable clickable>
              <CardBody className="mb-20">
                <Image
                  src={product.image}
                  objectFit="cover"
                  width="100%"
                  height={140}
                  alt={product.name}
                />
              </CardBody>
              <CardFooter className="absolute bg-black/40 dark:bg-transparent bottom-0 z-10 border-t-1 border-default-600 dark:border-none dark:border-default-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</p>
                  <Badge 
                    classNames={{
                      badge: "hidden",
                    }}
                    color="primary" 
                    variant="flat"
                  >
                    {product.rating} <Star fill="yellow" size={12} />
                  </Badge>
                </div>
                <Button className="self-end ml-auto" auto rounded color="primary" startContent={<ShoppingCart size={20} />}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
