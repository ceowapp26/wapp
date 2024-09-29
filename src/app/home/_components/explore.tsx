import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Container, Fade, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Logo } from '@/components/logo';
import { useTheme } from 'next-themes';
import { LayoutGrid, Settings, SquareArrowRight, Star, Rocket, Shield } from 'lucide-react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence } from "framer-motion";
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const GradientText = styled('h2')`
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
`;

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

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 0 15px 5px rgba(25, 118, 210, 0.5)'
  },
}));

const ExploreSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');

  const titleRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(titleRef.current, {
      duration: 3,
      text: {
        value: "WAPP - Your All-In-One Central Hub",
        delimiter: ""
      },
      ease: "none"
    });
    tl.to(titleRef.current, {
      duration: 1,
      opacity: 0,
      yoyo: true,
      repeat: 1
    });

    return () => {
      tl.kill();
    };
  }, []);

  const features = [
    { icon: <LayoutGrid size={32} />, title: 'Multiple Apps', description: 'Access a wide range of applications from one central hub.' },
    { icon: <Star size={32} />, title: 'User-Friendly', description: 'Intuitive interface designed for ease of use across all skill levels.' },
    { icon: <Rocket size={32} />, title: 'High Performance', description: 'Lightning-fast performance to boost your productivity.' },
    { icon: <Shield size={32} />, title: 'Secure Platform', description: 'Advanced security measures to protect your data and privacy.' },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 2, sm: 4, md: 6, lg: 10 },
        background: isDarkMode
          ? 'linear-gradient(to bottom, #000000, #1c1c1c)'
          : 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
        color: isDarkMode ? '#ffffff' : '#000000',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Fade in={isVisible} timeout={1000}>
          <Box>
            <Logo 
              width={isMobile ? 100 : isTablet ? 150 : 200} 
              height={isMobile ? 100 : isTablet ? 150 : 200} 
              className="mx-auto mb-4 sm:mb-6 md:mb-8" 
            />
            <GradientText
              ref={titleRef}
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 1, sm: 1.5, md: 2 }, 
                letterSpacing: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              WAPP - Your All-In-One Central Hub
            </GradientText>
            <AnimatedTypography 
              variant={isMobile ? "body1" : "h5"} 
              sx={{
                marginLeft: '100px',
                mb: { xs: 3, sm: 4, md: 6 }, 
                fontWeight: 'light',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                color: isDarkMode ? '#cccccc' : '#4a4a4a',
              }}
            >
             <motion.p
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
                className="overflow-hidden whitespace-nowrap text-blue-900 dark:text-blue-500 text-xl"
              >
                Discover a world of possibilities with our centralized app ecosystem.
              </motion.p>
            </AnimatedTypography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: '1em', sm: '1.5em' }, 
              flexWrap: 'wrap',
              mb: { xs: 4, sm: 6, md: 8 }
            }}>
              <GlowingButton 
                href="/myspace/apps"
                variant="contained" 
                color="primary"
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
                sx={{ mb: isMobile ? 2 : 0 }}
                endIcon={<SquareArrowRight />}
              >
                Explore Apps
              </GlowingButton>
              <GlowingButton 
                href="/settings" 
                variant="outlined" 
                color="primary"
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
                endIcon={<Settings />}
              >
                My Settings
              </GlowingButton>
            </Box>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard 
                    elevation={3}
                    sx={{
                      minHeight: '250px',
                      overflow: 'hidden',
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2">{feature.description}</Typography>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default ExploreSection;