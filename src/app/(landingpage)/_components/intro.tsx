'use client';
import React, { useEffect, useRef, Suspense, lazy } from 'react';
import Image from 'next/image';
import { Tabs, Tab, Card, CardContent, CardActions, CardMedia, Typography, Grid, Box, Button, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Phone, Email, LocationOn, Language } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import IntroTable from './intro-table';
import { styled } from '@mui/system';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { motion, AnimatePresence } from 'framer-motion';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Welcome to Wapp
    </Typography>
    <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
      Wapp is a centralized system that consists of multiple apps to help users with daily tasks. From note-taking to code editing, scheduling to file sharing, and collaboration - all in one seamless platform.
    </Typography>
    <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
      With Wapp, you don't have to switch between apps. Just one platform is all you need. Wapp helps users work more efficiently, boost productivity, and avoid digital clutter.
    </Typography>
    <Button variant="contained" color="primary" className="mt-4">
      Join Wapp Today
    </Button>
  </motion.div>
);

const KeyFeatures = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Key Features
    </Typography>
    <Box container>
      <IntroTable />
    </Box>
  </motion.div>
);

const Solutions = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Solutions & Use Cases
    </Typography>
    <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
      Wapp is created with the vision to tailor to user experience. It's designed for both individuals and enterprises, integrating features that leverage a centralized system.
    </Typography>
    <Grid container spacing={3}>
      {['Personal Use', 'Small Businesses', 'Large Enterprises', 'Educational Institutions'].map((solution, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="h-full bg-white dark:bg-gray-800 shadow-lg">
              <CardContent>
                <Typography variant="h6" className="text-blue-500 dark:text-blue-300">
                  {solution}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Tailored solutions for {solution.toLowerCase()} to maximize productivity and efficiency.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </motion.div>
);

const CaseStudies = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Customer Testimonials & Case Studies
    </Typography>
    <Grid container spacing={3}>
      {[1, 2, 3].map((study) => (
        <Grid item xs={12} key={study}>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent>
              <Typography variant="h6" className="text-blue-500 dark:text-blue-300">
                Company {study}
              </Typography>
              <Typography variant="body2" paragraph className="text-gray-600 dark:text-gray-400">
                "Wapp revolutionized our workflow. We saw a 30% increase in productivity within the first month!"
              </Typography>
              <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                - John Doe, CEO
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </motion.div>
);

const Security = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Security
    </Typography>
    <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
      At Wapp, we take your data security seriously. Our state-of-the-art encryption and compliance with GDPR ensure that your information is always protected.
    </Typography>
    <List>
      {['256-bit Encryption', 'GDPR Compliant', 'Regular Security Audits', 'Two-Factor Authentication'].map((item, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <SendIcon className="text-blue-500 dark:text-blue-300" />
          </ListItemIcon>
          <ListItemText primary={item} className="text-gray-700 dark:text-gray-300" />
        </ListItem>
      ))}
    </List>
  </motion.div>
);

const Support = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Support
    </Typography>
    <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
      Our dedicated support team is available 24/7 to assist you with any questions or issues you may have.
    </Typography>
    <Grid container spacing={3}>
      {['Live Chat', 'Email Support', 'Phone Support', 'Community Forums'].map((channel, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Card className="h-full bg-white dark:bg-gray-800 shadow-lg">
            <CardContent>
              <Typography variant="h6" className="text-blue-500 dark:text-blue-300">
                {channel}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                Get help through our {channel.toLowerCase()} for quick and efficient support.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </motion.div>
);

const OnboardingProcess = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Onboarding Process
    </Typography>
    <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
      Getting started with Wapp is easy. Follow our simple onboarding process to set up your account and start boosting your productivity.
    </Typography>
    <List>
      {['Sign Up', 'Personalize Your Dashboard', 'Connect Your Apps', 'Explore Features', 'Get Support'].map((step, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <DraftsIcon className="text-blue-500 dark:text-blue-300" />
          </ListItemIcon>
          <ListItemText primary={`Step ${index + 1}: ${step}`} className="text-gray-700 dark:text-gray-300" />
        </ListItem>
      ))}
    </List>
  </motion.div>
);

const Updates = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Typography variant="h4" gutterBottom className="text-blue-600 dark:text-blue-400">
      Product Updates & Roadmap
    </Typography>
    <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
      We're constantly improving Wapp to meet your needs. Check out our latest updates and upcoming features.
    </Typography>
    <Timeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" className="text-blue-500 dark:text-blue-300">
            Latest Update: Version 2.5
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Enhanced collaboration features and improved UI
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" className="text-blue-500 dark:text-blue-300">
            Coming Soon: Version 3.0
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            AI-powered productivity assistant and advanced analytics
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </motion.div>
);


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StyledTab = React.forwardRef(({ className, selected, ...props }, ref) => (
  <Tab
    ref={ref}
    className={`${className} ${
      selected
        ? 'text-blue-500 dark:text-white font-bold border-b-2 border-blue-700 dark:border-white'
        : 'text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300'
    } transition-colors duration-200`}
    {...props}
  />
));

const IntroSection: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
  }, []);
return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col p-8 overflow-y-auto min-h-[500px] dark:bg-black bg-white rounded-3xl shadow-2xl"
    >
      <div className="flex flex-grow w-full">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <Tabs
                value={value}
                onChange={handleChange}
                orientation="vertical"
                aria-label="Intro Options"
                sx={{ minWidth: 200 }}
              >
                <StyledTab label="About" {...a11yProps(0)} />
                <StyledTab label="Key Features" {...a11yProps(1)} />
                <StyledTab label="Solutions" {...a11yProps(2)} />
                <StyledTab label="Case Studies" {...a11yProps(3)} />
                <StyledTab label="Security" {...a11yProps(4)} />
                <StyledTab label="Support" {...a11yProps(5)} />
                <StyledTab label="Onboarding Process" {...a11yProps(6)} />
                <StyledTab label="Updates" {...a11yProps(7)} />
              </Tabs>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <AnimatePresence mode="wait">
              <motion.div
                key={value}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CustomTabPanel value={value} index={0}>
                  <About />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <KeyFeatures />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <Solutions />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                  <CaseStudies />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={4}>
                  <Security />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={5}>
                  <Support />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={6}>
                  <OnboardingProcess />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={7}>
                  <Updates />
                </CustomTabPanel>
              </motion.div>
            </AnimatePresence>
          </Grid>
        </Grid>
      </div>
    </motion.div>
  );
};


export default IntroSection;

function a11yProps(index: number) {
  return {
    id: `wapp-tab-${index}`,
    'aria-controls': `wapp-tabpanel-${index}`,
  };
}


