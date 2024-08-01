"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Fade, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { Logo } from '@/components/logo'
import { useTheme } from '@mui/material/styles';

const AnimatedTypography = styled(Typography)`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: fadeInUp 0.6s ease-out;
`;

const GlowingButton = styled(Button)`
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 0 15px 5px rgba(25, 118, 210, 0.5);
    transform: translateY(-2px);
  }
`;

const ExploreSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box 
      className='bg-gradient-to-b from-black to-gray-900 dark:from-gray-900 dark:to-black' 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 2, sm: 4, md: 6, lg: 10 },
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Fade in={isVisible} timeout={1000}>
          <Box>
            <Logo 
              width={isMobile ? 100 : isTablet ? 150 : 200} 
              height={isMobile ? 100 : isTablet ? 150 : 200} 
              className="mx-auto mb-4 sm:mb-6 md:mb-8" 
            />
            <AnimatedTypography 
              className='text-white dark:text-gray-200' 
              variant={isMobile ? "h3" : "h2"} 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 1, sm: 1.5, md: 2 }, 
                letterSpacing: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              APPS FOR EVERYONE
            </AnimatedTypography>
            <AnimatedTypography 
              className='text-gray-300 dark:text-gray-400' 
              variant={isMobile ? "body1" : "h5"} 
              sx={{ 
                mb: { xs: 3, sm: 4, md: 6 }, 
                fontWeight: 'light',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              WAPP will be with you every step of the way.
            </AnimatedTypography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: '1em', sm: '1.5em' }, 
              flexWrap: 'wrap' 
            }}>
              <GlowingButton 
                href="/myspace/apps"
                variant="contained" 
                color="primary"
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
                sx={{ mb: isMobile ? 2 : 0 }}
              >
                Choose App
              </GlowingButton>
              <GlowingButton 
                href="/settings" 
                variant="outlined" 
                color="primary"
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
              >
                My Settings
              </GlowingButton>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default ExploreSection;