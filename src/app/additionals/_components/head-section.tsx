"use client"
import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
});

const ContentBox = styled(Box)({
  width: '100%',
  maxWidth: '1200px',
  padding: '0 16px',
  boxSizing: 'border-box',
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

const HeadSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <FullScreenBox>
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
          <StyledTypography 
            variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
          >
            APPS FOR EVERYONE
          </StyledTypography>
          <StyledTypography 
            variant={isMobile ? 'body1' : 'h5'} 
            gutterBottom
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
          >
            WAPP will be with you every step of the way.
          </StyledTypography>
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
                  >
                    Choose App
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
                    Back Home
                  </StyledButton>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </ContentBox>
    </FullScreenBox>
  );
};

export default HeadSection;