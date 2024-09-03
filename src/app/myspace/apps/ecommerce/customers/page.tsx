"use client"

import React from 'react';
import { DataGrid } from '@/components/apps/document/editor/x-data-grid';
import { Typography } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First Name', width: 130 },
  { field: 'lastName', headerName: 'Last Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'totalOrders', headerName: 'Total Orders', type: 'number', width: 110 },
];

const rows = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', totalOrders: 5 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', totalOrders: 3 },
  // Add more customer data here
];

const CustomersPage = () => {
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
      </div>
    </React.Fragment>
  );
};

export default CustomersPage;