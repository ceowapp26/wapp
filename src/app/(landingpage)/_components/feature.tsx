"use client"
import React, { useState } from 'react';
import { Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import { Code, Description, Assessment, Folder, Mail } from '@mui/icons-material';
import clsx from 'clsx';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '2em',
  boxShadow: '5px 5px 30px rgba(0 0 0/ 0.3)',
  transition: 'transform 200ms ease-in',
  '&:hover': {
    transform: 'scale(1.015)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledTabContent = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export default function FeatureSection() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <StyledTabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon label tabs example"
            >
              <Tab icon={<Code />} label="Code" />
              <Tab icon={<Description />} label="About" />
              <Tab icon={<Assessment />} label="Services" />
              <Tab icon={<Folder />} label="Portfolio" />
              <Tab icon={<Mail />} label="Contact" />
            </StyledTabs>
            <StyledTabContent>
              <TabPanel value={value} index={0}>
                <Typography variant="h6">Headline 1</Typography>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat.
                </Typography>
                {/* Add more content for other tabs */}
              </TabPanel>
              {/* Add more TabPanels for other tabs */}
            </StyledTabContent>
          </StyledPaper>
        </Grid>
      </Grid>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}
