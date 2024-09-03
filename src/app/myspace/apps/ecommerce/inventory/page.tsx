"use client"

import React from 'react';
import { DataGrid } from '@/components/apps/document/editor/x-data-grid';
import { Typography, Button } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'sku', headerName: 'SKU', width: 120 },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100 },
  { field: 'reorderLevel', headerName: 'Reorder Level', type: 'number', width: 130 },
];

const rows = [
  { id: 1, name: 'Product 1', sku: 'SKU001', quantity: 100, reorderLevel: 20 },
  { id: 2, name: 'Product 2', sku: 'SKU002', quantity: 50, reorderLevel: 15 },
  // Add more inventory data here
];

const InventoryPage = () => {
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      <Button variant="contained" color="primary" className="!mb-4">
        Update Inventory
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
      </div>
    </React.Fragment>
  );
};

export default InventoryPage;