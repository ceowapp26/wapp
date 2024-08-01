'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Tabs, Tab, Card, CardContent, CardActions, CardMedia, Typography, Grid, Box, Button, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import IntroTable from './intro-table';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const InfoCardData = {
  "12x4": [
    { imgSrc: "/global/images/intro/ai.jpg", title: "AI Analytics", description: "Leveraging AI for data insights.", xs: 12, md: 4 },
    { imgSrc: "/global/images/intro/ai.jpg", title: "Real-time Collaboration", description: "Work together with AI assistance.", xs: 12, md: 4 },
    { imgSrc: "/global/images/intro/ai.jpg", title: "Cloud Integration", description: "Seamless cloud connectivity.", xs: 12, md: 4 },
  ],
  "12x6": [
    { imgSrc: "/global/images/intro/ai.jpg", title: "AI Security", description: "Enhanced security with AI.", xs: 12, md: 6 },
    { imgSrc: "/global/images/intro/ai.jpg", title: "AI Customization", description: "Customize AI models.", xs: 12, md: 6 }
  ],
  "12x12": [
    { imgSrc: "/global/images/intro/ai.jpg", title: "AI Advanced Reporting", description: "Detailed AI-driven reports.", xs: 12, md: 12 }
  ]
};

interface InfoCardProps {
  imgSrc: string;
  title: string;
  description: string;
  xs: number;
  md: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
}));

const InfoCard: React.FC<InfoCardProps> = ({ imgSrc, title, description, xs, md }) => {
  return (
    <Grid item xs={xs} md={md}>
      <StyledCard>
        <CardMedia
          component="img"
          alt={title}
          height="200"
          image={imgSrc}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" className="font-bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="primary">Learn More</Button>
        </CardActions>
      </StyledCard>
    </Grid>
  );
};

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 15,
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  color: 'white',
  padding: theme.spacing(4),
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FFF 30%, #FFD700 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  fontSize: '2.5rem',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    color: 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
}));

function ContactCard() {
  return (
    <GradientCard>
      <CardContent>
        <GradientTitle variant="h4">
          Contact Information
        </GradientTitle>
        <List>
          <ListItem>
            <StyledListItemText
              primary="Contact section content goes here. This section contains more than 200 words.
              Here is some example content: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nullam ultricies nunc vel arcu sollicitudin, vel tempor libero
              gravida..."
            />
          </ListItem>
          <ListItem>
            <StyledListItemText
              primary="Additional content: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper."
            />
          </ListItem>
          <ListItem>
            <StyledListItemText
              primary="Further content: Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi."
            />
          </ListItem>
        </List>
      </CardContent>
    </GradientCard>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StyledTab = React.forwardRef(({ className, selected, ...props }, ref) => (
  <Tab
    ref={ref}
    className={`${className} ${
      selected
        ? 'text-blue-500 dark:text-white font-bold border-b-2 border-blue-700 dark:border-white'
        : 'text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300'
    } transition-colors duration-200`}
    {...props}
  />
));

const IntroSection: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col p-8 overflow-y-auto min-h-[500px] dark:bg-black bg-white rounded-3xl shadow-2xl"
    >
      <div className="flex flex-grow w-full">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <Tabs
                value={value}
                onChange={handleChange}
                orientation="vertical"
                aria-label="Intro Options"
                sx={{ minWidth: 200 }}
              >
                <StyledTab label="About" {...a11yProps(0)} />
                <StyledTab label="Features" {...a11yProps(1)} />
                <StyledTab label="Pricing" {...a11yProps(2)} />
                <StyledTab label="Contact" {...a11yProps(3)} />
              </Tabs>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <motion.div
              key={value}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CustomTabPanel value={value} index={0}>
                <Card className="overflow-hidden shadow-xl bg-white dark:bg-black">
                  <CardContent>
                    <video 
                      ref={videoRef}
                      width="100%" 
                      loop 
                      autoPlay 
                      muted 
                      playsInline 
                      preload="auto"
                      className="rounded-lg"
                    >
                      <source src="./global/videos/placeholder.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </CardContent>
                </Card>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Grid container spacing={3}>
                  {InfoCardData["12x4"].map((item, index) => (
                    <InfoCard
                      key={index}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      description={item.description}
                      xs={item.xs}
                      md={item.md}
                    />
                  ))}
                  {InfoCardData["12x6"].map((item, index) => (
                    <InfoCard
                      key={index}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      description={item.description}
                      xs={item.xs}
                      md={item.md}
                    />
                  ))}
                  {InfoCardData["12x12"].map((item, index) => (
                    <InfoCard
                      key={index}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      description={item.description}
                      xs={item.xs}
                      md={item.md}
                    />
                  ))}
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Card className="shadow-xl">
                  <CardContent>
                    <IntroTable />
                  </CardContent>
                </Card>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <ContactCard />
              </CustomTabPanel>
            </motion.div>
          </Grid>
        </Grid>
      </div>
    </motion.div>
  );
};

export default IntroSection;

function a11yProps(index: number) {
  return {
    id: `wapp-tab-${index}`,
    'aria-controls': `wapp-tabpanel-${index}`,
  };
}


