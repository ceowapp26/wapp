"use client"
import React from 'react';
import { DataGrid } from '@/components/apps/document/editor/x-data-grid';
import { Button, Typography } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'price', headerName: 'Price', type: 'number', width: 90 },
  { field: 'stock', headerName: 'Stock', type: 'number', width: 90 },
];

const rows = [
  { id: 1, name: 'Product 1', category: 'Electronics', price: 35.99, stock: 100 },
  { id: 2, name: 'Product 2', category: 'Clothing', price: 42.99, stock: 50 },
  // Add more product data here
];

const ProductsPage = () => {
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Button variant="contained" color="primary" className="!mb-6">
        Add New Product
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
      </div>
    </React.Fragment>
  );
};

export default ProductsPage;