"use client"

import React from "react";
import AIProductFinder from './_components/ai-product-finder';
import ProductList from './_components/product-list';

export default function EcommercePage() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">Welcome to Our AI-Powered E-commerce Store</h1>
      <AIProductFinder />
      <h2 className="text-2xl font-bold mt-12 mb-20 text-gray-800 dark:text-white">Featured Products</h2>
      <ProductList />
    </React.Fragment>
  );
}