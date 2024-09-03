"use client"

import React from 'react';
import { DataGrid } from '@/components/apps/document/editor/x-data-grid';
import { Typography } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'Order ID', width: 100 },
  { field: 'customer', headerName: 'Customer', width: 150 },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'total', headerName: 'Total', type: 'number', width: 100 },
];

const rows = [
  { id: 1, customer: 'John Doe', date: '2023-05-01', status: 'Delivered', total: 125.99 },
  { id: 2, customer: 'Jane Smith', date: '2023-05-02', status: 'Processing', total: 89.99 },
  // Add more order data here
];

const OrdersPage = () => {
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
      </div>
    </React.Fragment>
  );
};

export default OrdersPage;