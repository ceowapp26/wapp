"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

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
  padding: theme.spacing(3),
}));

const faqItems = [
  {
    sectionTitle: "Artificial Intelligence",
    question: "What is Artificial Intelligence?",
    answer: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines.",
    details: "These machines are programmed to think and act like humans. AI is used in various applications including speech recognition, decision-making, and visual perception."
  },
  {
    sectionTitle: "Machine Learning",
    question: "How does machine learning work?",
    answer: "Machine learning is a subset of AI that involves training algorithms to learn from data.",
    details: "These algorithms can identify patterns, make decisions, and improve over time without being explicitly programmed."
  },
  {
    sectionTitle: "ML vs AI Differences",
    question: "What is the difference between AI and machine learning?",
    answer: "AI is a broad concept of creating intelligent machines, while machine learning is a specific method used to achieve AI.",
    details: "Machine learning uses statistical techniques to enable machines to improve at tasks with experience."
  },
  {
    sectionTitle: "Neural Networks",
    question: "What are neural networks?",
    answer: "Neural networks are a series of algorithms that mimic the operations of a human brain to recognize relationships between vast amounts of data.",
    details: "They are a core component of deep learning, a subset of machine learning."
  },
  {
    sectionTitle: "Deep Learning",
    question: "What is deep learning?",
    answer: "Deep learning is a subset of machine learning that uses neural networks with many layers.",
    details: "It is particularly effective for tasks such as image and speech recognition."
  },
  {
    sectionTitle: "Natural Language Processing(NLP)",
    question: "What is natural language processing (NLP)?",
    answer: "NLP is a branch of AI that deals with the interaction between computers and humans using natural language.",
    details: "It involves enabling computers to understand, interpret, and generate human language."
  },
  {
    sectionTitle: "AI Chatbot",
    question: "What is a chatbot?",
    answer: "A chatbot is an AI software that can simulate a conversation with a user in natural language.",
    details: "They are commonly used in customer service to provide quick responses to user queries."
  },
  {
    sectionTitle: "AI Applications",
    question: "How is AI used in healthcare?",
    answer: "AI is used in healthcare for diagnostics, personalized treatment, and predictive analytics.",
    details: "It helps in analyzing complex medical data and providing insights that can improve patient outcomes."
  },
  {
    sectionTitle: "Ethical Concerns",
    question: "What are the ethical concerns with AI?",
    answer: "Ethical concerns with AI include bias, privacy, job displacement, and the potential for misuse.",
    details: "It is crucial to address these concerns to ensure the responsible use of AI technology."
  },
  {
    sectionTitle: "Future of AI",
    question: "What is the future of AI?",
    answer: "The future of AI is expected to bring advancements in various fields such as healthcare, finance, and transportation.",
    details: "Ongoing research aims to make AI more efficient, ethical, and accessible to solve complex global challenges."
  }
];

const FaqItem = ({ sectionTitle, question, answer, details }) => (
  <StyledAccordion>
    <StyledAccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
    >
      <Typography variant="h6" color="primary" fontWeight="bold">
        {sectionTitle}
      </Typography>
    </StyledAccordionSummary>
    <StyledAccordionDetails>
      <Box>
        <Typography variant="h6" color="secondary" gutterBottom>
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

const FaqSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-black overflow-hidden min-h-screen rounded-b-3xl rounded-t-3xl p-8 md:p-16 mt-20"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography variant="h2" align="center" color="primary" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Explore the world of AI through our comprehensive FAQ
        </Typography>
      </motion.div>
      <Grid container justifyContent="center" alignItems="stretch" spacing={3}>
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
