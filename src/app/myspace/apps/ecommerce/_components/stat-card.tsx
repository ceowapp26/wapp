"use client"

import React from 'react';
import { Paper, Typography } from '@mui/material';

const StatCard = ({ title, value, icon }) => {
  return (
    <Paper className="p-4 flex items-center">
      <div className="mr-4 text-blue-500">{icon}</div>
      <div>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </div>
    </Paper>
  );
};

export default StatCard;