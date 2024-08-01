'use client';
import { useState } from 'react';
import { Card, CardHeader, CardBody, Divider, Button } from '@nextui-org/react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { Activity, Clock, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChangelogItem = ({ version, date, changes, isLatest }) => {
  const [isExpanded, setIsExpanded] = useState(isLatest);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        variant="bordered" 
        className={`mb-4 overflow-hidden ${isLatest ? 'border-2 border-blue-500' : ''}`}
      >
        <CardHeader 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between w-full">
            <Typography variant="h6" className="flex items-center">
              <Activity className="mr-2" />
              Version {version}
              {isLatest && (
                <span className="ml-2 bg-yellow-400 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <Star size={12} className="mr-1" />
                  Latest
                </span>
              )}
            </Typography>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardBody>
                <ul className="list-disc pl-5 mb-4">
                  {changes.map((change, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Typography variant="body1" className="mb-2">
                        {change}
                      </Typography>
                    </motion.li>
                  ))}
                </ul>
                <Divider className="my-2" />
                <Typography variant="body2" className="self-start text-gray-600 py-2 flex items-center">
                  <Clock className="mr-1" size={16} />
                  <span className="ml-auto mt-1">Released on {date}</span>
                </Typography>
              </CardBody>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const ChangelogPage = () => {
  const changelogData = [
    {
      version: '1.2.0',
      date: 'October 15, 2023',
      changes: [
        'Added new feature: User profiles with customizable avatars.',
        'Improved performance and stability across all platforms.',
        'Enhanced UI/UX for better user engagement.',
        'Implemented real-time notifications system.'
      ],
      isLatest: true
    },
    {
      version: '1.1.0',
      date: 'September 5, 2023',
      changes: [
        'Implemented dark mode for better user experience.',
        'Fixed various bugs reported by users.',
        'Added support for multiple languages.',
        'Optimized app load time by 30%.'
      ],
      isLatest: false
    },
    {
      version: '1.0.0',
      date: 'August 1, 2023',
      changes: [
        'Initial release of our application.',
        'Core features implemented including user authentication.',
        'Basic dashboard and analytics functionality.',
        'Mobile responsive design across all major devices.'
      ],
      isLatest: false
    }
  ];

  return (
    <Container maxWidth="lg" className="py-12">
      <Typography variant="h3" className="text-4xl font-bold mb-8 p-2 text-center text-gray-800">
        Changelog
      </Typography>
      <Box className="mb-6 text-center">
        <Typography variant="body1" className="text-gray-600">
          Keep track of all the updates and improvements we've made to our application.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {changelogData.map((item, index) => (
          <Grid item xs={12} key={index}>
            <ChangelogItem {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ChangelogPage;