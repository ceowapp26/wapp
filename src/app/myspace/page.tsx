"use client";
import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FcmTokenComp from "@/components/firebase-foreground";
import { registerServiceWorker } from "@/lib/registerServiceWorker";

type MyspaceProps = {
  children: React.ReactNode;
  [key: string]: any; 
};

const MyspacePage = ({ children, ...rest }: MyspaceProps) => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <React.Fragment>
      <Typography className="text-center" variant="h1" gutterBottom>
        WELCOME TO WAPP. WE PROVIDE YOU WITH EVERYTHING YOU NEED.
      </Typography>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 100, backgroundColor: 'lightblue' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 100, backgroundColor: 'lightgreen' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 100, backgroundColor: 'lightcoral' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 100, backgroundColor: 'lightgoldenrodyellow' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 100, backgroundColor: 'lightsalmon' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 100, backgroundColor: 'lightseagreen' }} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Section Title
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          This is the subtitle of the section
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <video width="100%" controls>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default MyspacePage;
