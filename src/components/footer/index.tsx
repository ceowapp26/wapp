import React from 'react';
import { SocialIcon } from 'react-social-icons';
import { Grid, Typography, Container, Box } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FooterLink = ({ href, children }) => (
  <motion.li 
    whileHover={{ x: 5 }}
    className="py-2"
  >
    <Link className="text-gray-400 hover:text-white no-underline transition-colors duration-300" href={href}>
      {children}
    </Link>
  </motion.li>
);

const Footer = () => {
  return (
    <Box component="footer" className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <Container maxWidth="lg">
        <Grid container spacing={8} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              COMPANY
            </Typography>
            <ul className="text-left space-y-2">
              <FooterLink href="#">Contact Us</FooterLink>
              <FooterLink href="#">Contribute</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
              <FooterLink href="#">Privacy</FooterLink>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              GUIDES
            </Typography>
            <ul className="text-left space-y-2">
              <FooterLink href="#">WApp-Doc</FooterLink>
              <FooterLink href="#">WApp-Book</FooterLink>
              <FooterLink href="#">WApp-Music</FooterLink>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              RESOURCES
            </Typography>
            <ul className="text-left space-y-2">
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Customers</FooterLink>
              <FooterLink href="#">Events</FooterLink>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Community</FooterLink>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" gutterBottom className="text-left font-bold text-indigo-400">
              CONTACT
            </Typography>
            <Link className="text-gray-400 hover:text-white transition-colors duration-300" href="mailto:ceowapp@gmail.com">
              thenguyenfiner@gmail.com
            </Link>
            <Box className="flex justify-start space-x-4 mt-6">
              <motion.div whileHover={{ y: -5 }}>
                <SocialIcon url="https://linkedin.com/in/couetilc" className="w-[40px] h-[40px]" />
              </motion.div>
              <motion.div whileHover={{ y: -5 }}>
                <SocialIcon url="https://github.com" className="w-[40px] h-[40px]" bgColor="#ff5a01" />
              </motion.div>
              <motion.div whileHover={{ y: -5 }}>
                <SocialIcon url="https://www.facebook.com/" className="w-[40px] h-[40px]" />
              </motion.div>
            </Box>
          </Grid>
        </Grid>
        <Box className="border-t border-gray-700 mt-12 pt-8 text-center">
          <Typography variant="body2" className="text-gray-400">
            &copy; {new Date().getFullYear()} WApp. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;