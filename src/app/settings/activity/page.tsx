'use client';
import { Card, CardHeader, CardBody, Avatar, Button } from '@nextui-org/react';
import { Container, Grid, Typography, Divider, Box } from '@mui/material';
import { Activity, Clock, MessageSquare, User, ArrowRight, Bell } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ActivityCard = ({ icon: Icon, title, content, timestamp, avatar }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-full overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center text-white">
            <Icon size={24} className="mr-3" />
            <Typography variant="h6" className="font-bold">{title}</Typography>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <div className="flex items-center mb-3">
            {avatar && (
              <Avatar
                src={avatar}
                size="lg"
                className="mr-3 border-2 border-purple-500"
              />
            )}
            <Typography variant="body1" className="text-gray-700">
              {content}
            </Typography>
          </div>
          <Divider className="my-3" />
          <div className="flex justify-between items-center">
            <Typography variant="body2" className="text-gray-500 flex items-center">
              <Clock className="mr-1" size={16} />
              {timestamp}
            </Typography>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                auto
                light
                color="primary"
                className="p-4 w-full mt-2"
                endContent={<ArrowRight size={16} />}
              >
                View Details
              </Button>
            </motion.div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

const ActivityPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { label: 'All', value: 'all', icon: Bell },
    { label: 'Posts', value: 'posts', icon: Activity },
    { label: 'Comments', value: 'comments', icon: MessageSquare },
    { label: 'Followers', value: 'followers', icon: User },
  ];

  const activities = [
    {
      icon: Activity,
      title: "New Blog Post",
      content: "Your blog post 'The Future of AI' has been published and is now live.",
      timestamp: "2 hours ago",
      type: 'posts'
    },
    {
      icon: MessageSquare,
      title: "New Comment",
      content: "John Doe commented on your post: 'Great insights! Looking forward to more content like this.'",
      timestamp: "4 hours ago",
      type: 'comments'
    },
    {
      icon: User,
      title: "New Follower",
      content: "Sarah Smith started following you.",
      timestamp: "1 day ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      type: 'followers'
    },
    {
      icon: Activity,
      title: "Product Update",
      content: "Version 2.0 of our app has been released with exciting new features.",
      timestamp: "2 days ago",
      type: 'posts'
    },
  ];

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 w-full">
      <Container maxWidth="lg">
        <Typography variant="h3" className="text-4xl font-bold mb-8 text-center text-gray-800 p-6">
          Your Recent Activity
        </Typography>
        
        <Box className="flex justify-center mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              auto
              color={selectedFilter === filter.value ? "primary" : "default"}
              className="mx-2"
              startContent={<filter.icon size={16} />}
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </Box>

        <Grid container spacing={4}>
          {filteredActivities.map((activity, index) => (
            <Grid item xs={12} md={6} key={index}>
              <ActivityCard {...activity} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ActivityPage;