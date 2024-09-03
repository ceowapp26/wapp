"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Button, Input, Spacer, Image, Badge } from "@nextui-org/react";
import { Container, Typography, Box, Grid } from '@mui/material';
import { Search } from 'lucide-react';

export default function AIProductFinder() {
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSuggestions([
        { name: 'Smart Watch', price: 199.99, rating: 4.5 },
        { name: 'Wireless Earbuds', price: 129.99, rating: 4.2 },
        { name: 'Fitness Tracker', price: 89.99, rating: 4.7 },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardBody>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">AI Product Finder</h2>
        <Spacer y={1} />
        <form onSubmit={handleSubmit}>
          <Input
            fullWidth
            clearable
            bordered
            labelPlaceholder="Describe the product you're looking for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            contentLeft={<Search />}
          />
          <Spacer y={4} />
          <Button
            auto
            shadow
            color="primary"
            icon={isLoading ? null : <Search />}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Searching...' : 'Find Products'}
          </Button>
        </form>
        <Spacer y={1} />
         {suggestions.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Suggestions:</h3>
            <Grid container spacing={2}>
              {suggestions.map((product, index) => (
                <Grid key={index} xs={12} sm={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card hoverable clickable>
                      <CardBody>
                        <span className="font-medium text-gray-800 dark:text-white">{product.name}</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</span>
                        <Badge color="primary" variant="flat">
                          {product.rating} <Star size={12} />
                        </Badge>
                      </CardBody>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
