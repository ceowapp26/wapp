import React from 'react';
import { Card, CardContent, Grid, Typography, CardMedia, Button, CardActions } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const BoxSection = () => {
  const router = useRouter();
  const boxes = [
    {
      id: 1,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Healthcare",
      description: "Artificial Intelligence is revolutionizing healthcare with predictive analytics, personalized medicine, and advanced diagnostics."
    },
    {
      id: 2,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Finance",
      description: "AI technologies like machine learning and deep learning are transforming the financial industry by improving fraud detection and trading strategies."
    },
    {
      id: 3,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Manufacturing",
      description: "AI is optimizing manufacturing processes through predictive maintenance, quality control, and supply chain management."
    },
    {
      id: 4,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Transportation",
      description: "Autonomous vehicles and smart traffic management systems are just a few examples of how AI is enhancing transportation."
    },
    {
      id: 5,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Education",
      description: "AI-powered tools are providing personalized learning experiences and automating administrative tasks in the education sector."
    },
    {
      id: 6,
      image: "/global/additionals/ai-technology.webp",
      title: "Software Development Trends",
      description: "Keep up with the latest trends in software development, including DevOps, containerization, and microservices architecture."
    },
    {
      id: 7,
      image: "/global/additionals/ai-technology.webp",
      title: "Agile Development",
      description: "Agile methodologies are streamlining software development processes, fostering collaboration, and delivering value faster."
    },
    {
      id: 8,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Software Testing",
      description: "AI-driven testing tools are enhancing software quality by automating test case generation and bug detection."
    },
    {
      id: 9,
      image: "/global/additionals/ai-technology.webp",
      title: "Cloud Computing",
      description: "Cloud computing is transforming how software is developed, deployed, and scaled, offering flexibility and cost-efficiency."
    },
    {
      id: 10,
      image: "/global/additionals/ai-technology.webp",
      title: "Cybersecurity",
      description: "AI is playing a crucial role in cybersecurity by detecting and mitigating threats in real-time to protect sensitive data."
    },
    {
      id: 11,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Retail",
      description: "Retailers are leveraging AI to enhance customer experiences, optimize inventory management, and improve sales forecasting."
    },
    {
      id: 12,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Marketing",
      description: "AI is revolutionizing marketing by enabling personalized campaigns, customer segmentation, and predictive analytics."
    },
    {
      id: 13,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Customer Service",
      description: "Chatbots and virtual assistants powered by AI are improving customer service by providing instant support and resolving queries."
    },
    {
      id: 14,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Gaming",
      description: "AI is enhancing gaming experiences by creating intelligent NPCs, dynamic environments, and personalized content."
    },
    {
      id: 15,
      image: "/global/additionals/ai-technology.webp",
      title: "AI Ethics",
      description: "Exploring the ethical implications of AI, including bias, transparency, and the impact on jobs and society."
    },
    {
      id: 16,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Agriculture",
      description: "AI is improving agricultural practices through precision farming, crop monitoring, and yield prediction."
    },
    {
      id: 17,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Energy",
      description: "AI is optimizing energy consumption and distribution, contributing to the development of smart grids and renewable energy solutions."
    },
    {
      id: 18,
      image: "/global/additionals/ai-technology.webp",
      title: "Natural Language Processing",
      description: "NLP is enabling machines to understand and interact with human language, powering applications like chatbots and translators."
    },
    {
      id: 19,
      image: "/global/additionals/ai-technology.webp",
      title: "Robotics",
      description: "AI-driven robotics are transforming industries from manufacturing to healthcare, improving efficiency and precision."
    },
    {
      id: 20,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Real Estate",
      description: "AI is enhancing real estate operations through property management automation, market analysis, and personalized recommendations."
    },
    {
      id: 21,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Supply Chain",
      description: "AI is optimizing supply chain operations by improving demand forecasting, inventory management, and logistics."
    },
    {
      id: 22,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Sports",
      description: "AI is revolutionizing sports analytics, performance monitoring, and fan engagement through data-driven insights."
    },
    {
      id: 23,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Entertainment",
      description: "AI is transforming the entertainment industry by enabling content recommendations, automated editing, and virtual production."
    },
    {
      id: 24,
      image: "/global/additionals/ai-technology.webp",
      title: "AI in Human Resources",
      description: "AI is improving HR processes through talent acquisition, employee engagement, and performance management."
    },
  ];

  const handleButtonClick = (id) => {
    router.push(`/details/${id}`);
  };

  return (
    <Grid className="p-10" container spacing={2} justifyContent="center">
      {boxes.map((box) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={box.id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={box.image}
              alt={box.title}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {box.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {box.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary" 
                endIcon={<ArrowForward />}
                onClick={() => handleButtonClick(box.id)}
              >
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BoxSection;
