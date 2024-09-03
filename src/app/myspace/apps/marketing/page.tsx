"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Container, Typography, Box, Grid } from '@mui/material';
import { ArrowForward, CheckCircleOutline, TrendingUp, Lightbulb, BarChart, Group, Autorenew, PieChart, Security, SupportAgent } from '@mui/icons-material';

const features = [
  {
    icon: <CheckCircleOutline className="text-green-500" style={{ fontSize: 40 }} />,
    title: "AI-Powered Insights",
    description: "Leverage cutting-edge AI algorithms to gain deep insights into your marketing performance.",
  },
  {
    icon: <TrendingUp className="text-blue-500" style={{ fontSize: 40 }} />,
    title: "Real-time Analytics",
    description: "Monitor your campaigns in real-time and make data-driven decisions on the fly.",
  },
  {
    icon: <Lightbulb className="text-yellow-500" style={{ fontSize: 40 }} />,
    title: "Smart Recommendations",
    description: "Receive personalized recommendations to optimize your marketing strategies and improve ROI.",
  },
  {
    icon: <BarChart className="text-purple-500" style={{ fontSize: 40 }} />,
    title: "Performance Tracking",
    description: "Track your marketing performance with precision and adjust your strategies accordingly.",
  },
  {
    icon: <Group className="text-red-500" style={{ fontSize: 40 }} />,
    title: "Customer Segmentation",
    description: "Segment your audience to deliver more targeted and effective marketing campaigns.",
  },
  {
    icon: <Autorenew className="text-indigo-500" style={{ fontSize: 40 }} />,
    title: "Automated Workflows",
    description: "Automate your marketing workflows to save time and improve efficiency.",
  },
  {
    icon: <PieChart className="text-teal-500" style={{ fontSize: 40 }} />,
    title: "Advanced Reporting",
    description: "Generate comprehensive reports that provide actionable insights into your marketing efforts.",
  },
  {
    icon: <Security className="text-orange-500" style={{ fontSize: 40 }} />,
    title: "Data Security",
    description: "Ensure the security of your marketing data with top-notch encryption and security protocols.",
  },
  {
    icon: <SupportAgent className="text-pink-500" style={{ fontSize: 40 }} />,
    title: "24/7 Support",
    description: "Get round-the-clock support from our expert team to keep your marketing efforts running smoothly.",
  },
];

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="ml-3 text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const MarketingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-gray-900 dark:to-blue-900 w-full">
      <Container>
        <motion.header
          className="py-20 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h1" component="h2" className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            Welcome to WAPP-MARKETING
          </Typography>
          <Typography variant="h2" component="h3" className="text-2xl mb-8 text-gray-600 dark:text-gray-300">
            Revolutionize Your Marketing with AI-Powered Insights
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 top-4 rounded-full transition duration-300"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.header>

        <motion.section
          className="py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h3" component="h3" className="text-3xl font-semibold mb-20 py-10 text-center text-gray-800 dark:text-white">
            Why Choose Wapp-Marketing?
          </Typography>
          <Grid container spacing={6}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </Grid>
            ))}
          </Grid>
        </motion.section>
        <motion.section
          className="py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollY > 600 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" component="h3" className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
            Ready to Transform Your Marketing?
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForward />}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              Start Free Trial
            </Button>
          </motion.div>
        </motion.section>
      </Container>
    </div>
  );
}

export default MarketingPage;