"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Fade, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const GradientBox = styled(Box)`
  background: linear-gradient(45deg, #8B5CF6, #EC4899, #F43F5E);
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
  @keyframes gradientShift {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

const AnimatedTypography = styled(Typography)`
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: fadeInDown 0.8s ease-out;
`;

const PulseButton = styled(Button)`
  transition: all 0.3s ease-in-out;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }
  &:hover {
    transform: scale(1.05);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const PromptSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box className="bg-black dark:bg-gray-100" sx={{ minHeight: '100vh', p: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
      <GradientBox 
        className="w-full h-full rounded-3xl flex flex-col items-center justify-center" 
        sx={{ 
          minHeight: { xs: 'calc(100vh - 32px)', sm: 'calc(100vh - 48px)', md: 'calc(100vh - 64px)', lg: 'calc(100vh - 96px)' },
          p: { xs: 3, sm: 4, md: 6 }
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Fade in={isVisible} timeout={1000}>
            <Box>
              <AnimatedTypography 
                className="text-white" 
                variant={isMobile ? "h3" : isTablet ? "h2" : "h1"}
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 3, md: 4 },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: { xs: 2, sm: 3, md: 4 },
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.75rem' }
                }}
              >
                ALL-IN-ONE PLATFORM
              </AnimatedTypography>
              <AnimatedTypography 
                className="text-white" 
                variant={isMobile ? "body1" : "h5"}
                sx={{ 
                  mb: { xs: 3, sm: 4, md: 6 }, 
                  fontWeight: 'light',
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                }}
              >
                Experience the future of seamless integration
              </AnimatedTypography>
              <PulseButton 
                href="/myspace/apps"
                variant="outlined" 
                size={isMobile ? "medium" : "large"}
                sx={{ 
                  mt: { xs: 2, sm: 3, md: 4 },
                  color: 'white',
                  borderColor: 'white',
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  px: { xs: 3, sm: 3.5, md: 4 },
                  py: { xs: 1, sm: 1.25, md: 1.5 }
                }}
              >
                Enter Wapp
              </PulseButton>
            </Box>
          </Fade>
        </Container>
      </GradientBox>
    </Box>
  );
};

export default PromptSection;