"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Grid, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled, useTheme } from '@mui/material/styles';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '15px !important',
  marginBottom: '20px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },
  '&:before': {
    display: 'none',
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  borderRadius: '15px',
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const faqItems = [
  {
    sectionTitle: "WAPP",
    question: "What is WAPP?",
    answer: "WAPP is your all-in-one AI-powered productivity powerhouse.",
    details: "Imagine a centralized system where cutting-edge AI meets intuitive design, empowering you to work smarter, not harder. WAPP seamlessly integrates multiple apps, allowing you to effortlessly share and utilize files across the entire ecosystem. It's not just a tool; it's your personal productivity revolution."
  },
  {
    sectionTitle: "WAPP Features",
    question: "What is within WAPP?",
    answer: "WAPP is a treasure trove of productivity-boosting mini-apps designed to supercharge your daily workflow.",
    details: "From AI-assisted writing and data analysis to project management and communication tools, WAPP's interconnected apps work in harmony to streamline your tasks. It's like having a team of AI-powered assistants at your fingertips, ready to tackle any challenge you throw their way."
  },
  {
    sectionTitle: "Future Plans",
    question: "What are WAPP's plans for the future?",
    answer: "WAPP is on a mission to revolutionize productivity on a global scale.",
    details: "We're not just dreaming big; we're coding big. Our roadmap includes expanding our app ecosystem, enhancing AI capabilities, and tailoring solutions for diverse industries. With WAPP, you're not just using a product; you're joining a movement that's shaping the future of work."
  },
  {
    sectionTitle: "Unique Selling Point",
    question: "What makes WAPP stand out?",
    answer: "WAPP is where state-of-the-art AI meets unparalleled user experience.",
    details: "We've harnessed the power of the latest AI models and combined it with sleek, intuitive design. The result? A platform that's not just powerful, but a joy to use. WAPP doesn't just meet your expectations; it anticipates your needs before you even realize them."
  },
  {
    sectionTitle: "Target Audience",
    question: "Is WAPP the right fit for me?",
    answer: "Whether you're a solo entrepreneur or a Fortune 500 company, WAPP scales to fit your unique needs.",
    details: "Our flexible platform adapts to your workflow, not the other way around. From freelancers looking to boost their productivity to enterprises seeking to streamline operations, WAPP is the Swiss Army knife of productivity tools that grows with you."
  },
  {
    sectionTitle: "Founder",
    question: "Who is the founder of WAPP?",
    answer: "WAPP is the brainchild of a visionary self-taught developer who turned passion into innovation.",
    details: "Our founder's journey from coding novice to creating a revolutionary AI-powered platform is a testament to the power of determination and creativity. With WAPP, you're not just getting a product; you're benefiting from a vision that challenges the status quo of productivity tools."
  },
  {
    sectionTitle: "Pricing",
    question: "Is WAPP's pricing reasonable?",
    answer: "WAPP believes in democratizing productivity with a 'value-for-all' pricing model.",
    details: "Our tiered pricing structure ensures that everyone, from students to CEOs, can access the power of AI-driven productivity. Start with our feature-rich free plan and scale up to our premium offerings as your needs grow. With WAPP, world-class productivity is always within reach."
  },
  {
    sectionTitle: "SaaS Integration",
    question: "How easy is it to integrate WAPP with other SaaS tools?",
    answer: "WAPP is the ultimate team player in your software ecosystem.",
    details: "We've built WAPP to play nice with others. Our robust APIs and pre-built connectors make integration a breeze, not a chore. Whether it's your CRM, project management tool, or custom software, WAPP fits into your existing workflow like the missing puzzle piece you've been searching for."
  },
  {
    sectionTitle: "Data Security",
    question: "How does WAPP ensure the security of my data?",
    answer: "At WAPP, your data's security is our top priority – it's Fort Knox meets Silicon Valley.",
    details: "We employ military-grade encryption, conduct regular security audits, and adhere to the strictest global compliance standards. With features like two-factor authentication and SSO, we're not just meeting industry standards; we're setting them. Your data isn't just secure; it's WAPP secure."
  },
  {
    sectionTitle: "Customization",
    question: "Can WAPP be customized to fit my specific business needs?",
    answer: "WAPP is your digital chameleon, adapting to your business with unparalleled flexibility.",
    details: "From custom workflows that mirror your processes to branded interfaces that reflect your identity, WAPP bends to your will. Our extensive API access means the only limit to customization is your imagination. With WAPP, you're not conforming to software; the software is conforming to you."
  }
];

const FaqItem = ({ sectionTitle, question, answer, details }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledAccordion>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
      >
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          color="primary" 
          fontWeight="bold"
        >
          {sectionTitle}
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Box>
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            color="secondary" 
            gutterBottom
          >
            {question}
          </Typography>
          <Typography variant="body1" paragraph>
            {answer}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {details}
          </Typography>
        </Box>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

const FaqSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-white dark:bg-black overflow-hidden min-h-screen rounded-t-3xl ${isMobile ? 'p-4' : 'p-8 md:p-16'} mt-20`}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          align="center" 
          color="primary" 
          gutterBottom
        >
          Frequently Asked Questions
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h5"} 
          align="center" 
          color="text.secondary" 
          paragraph
        >
          Explore the world of AI through our comprehensive FAQ
        </Typography>
      </motion.div>
      <Grid container justifyContent="center" alignItems="stretch" spacing={isMobile ? 2 : 3}>
        {faqItems.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <FaqItem
                sectionTitle={item.sectionTitle}
                question={item.question}
                answer={item.answer}
                details={item.details}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.section>
  );
};

export default FaqSection;


