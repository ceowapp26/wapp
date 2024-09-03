"use client"

import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AttachMoney, ShoppingCart, Person, TrendingUp } from '@mui/icons-material';
import StatCard from "../_components/stat-card";

const data = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
];

const DashboardPage = () => {
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Sales" value="$15,890" icon={<AttachMoney fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value="1,256" icon={<ShoppingCart fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="New Customers" value="356" icon={<Person fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Conversion Rate" value="3.2%" icon={<TrendingUp fontSize="large" />} />
        </Grid>
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              Sales Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default DashboardPage;