"use client"
import React from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppsIcon from '@mui/icons-material/Apps';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FullScreenBox = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
  padding: 0,
  margin: 0,
  overflow: 'hidden',
  position: 'relative',
});

const ContentBox = styled(Box)({
  width: '100%',
  maxWidth: '1200px',
  padding: '0 16px',
  boxSizing: 'border-box',
  zIndex: 1,
});

const StyledTypography = styled(Typography)({
  marginBottom: '1.5rem',
  color: '#ffffff',
  textAlign: 'center',
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: '0.5rem',
  padding: '0.75rem 2rem',
  borderRadius: 30,
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
    transition: 'all 0.5s ease',
    opacity: 0,
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    '&::after': {
      opacity: 1,
      transform: 'translate(50%, 50%) scale(1)',
    },
  },
  '&:active': {
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const FloatingCircle = styled(Box)(({ theme, size, top, left, delay }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  top,
  left,
  animation: `float 6s ease-in-out infinite ${delay}s`,
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}));

const HeadSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const titleAnimation = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const subtitleAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } },
  };

  const featureAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <FullScreenBox>
      <FloatingCircle size="100px" top="10%" left="5%" delay={0} />
      <FloatingCircle size="150px" top="60%" left="80%" delay={1} />
      <FloatingCircle size="80px" top="30%" left="70%" delay={2} />
      <ContentBox>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box display="flex" justifyContent="center" mb={isMobile ? 2 : isTablet ? 3 : 4}>
            <Logo 
              width={isMobile ? 80 : isTablet ? 120 : 160} 
              height={isMobile ? 80 : isTablet ? 120 : 160} 
            />
          </Box>
          <motion.div variants={titleAnimation} initial="hidden" animate="visible">
            <StyledTypography 
              variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'} 
              component="h1" 
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
            >
              ONE SYSTEM, ENDLESS POSSIBILITIES
            </StyledTypography>
          </motion.div>
          <motion.div variants={subtitleAnimation} initial="hidden" animate="visible">
            <StyledTypography 
              variant={isMobile ? 'body1' : 'h5'} 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
            >
              WAPP: Your centralized hub for all your application needs
            </StyledTypography>
          </motion.div>
          <Box mt={isMobile ? 2 : 4}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm="auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    size={isMobile ? "medium" : "large"}
                    fullWidth={isMobile}
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                      color: 'white',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Get Started
                  </StyledButton>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm="auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StyledButton
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    fullWidth={isMobile}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)',
                      },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    }}
                  >
                    Learn More
                  </StyledButton>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
        <Box mt={6}>
          <Grid container spacing={3}>
            {[
              { icon: <AppsIcon fontSize="large" />, title: "Centralized Apps", description: "Access all your applications from one place" },
              { icon: <SecurityIcon fontSize="large" />, title: "Enhanced Security", description: "Advanced security measures to protect your data" },
              { icon: <SpeedIcon fontSize="large" />, title: "Improved Efficiency", description: "Streamline your workflow with integrated tools" },
              { icon: <CloudIcon fontSize="large" />, title: "Cloud-Based", description: "Access your apps from anywhere, anytime" },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  variants={featureAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <FeatureCard>
                    <CardContent>
                      <IconButton sx={{ color: 'white', mb: 2 }}>
                        {feature.icon}
                      </IconButton>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ContentBox>
    </FullScreenBox>
  );
};

export default HeadSection;