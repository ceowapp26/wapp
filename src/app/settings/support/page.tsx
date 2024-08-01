'use client';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';
import { Container, Grid, Typography } from '@mui/material';
import { MessageSquare, Mail, Phone, User, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const SupportCard = ({ icon: Icon, title, description, action, actionText, extraInfo }) => (
  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="flex items-center text-white">
        <Icon size={24} className="mr-3" />
        <Typography variant="h6" className="font-bold">{title}</Typography>
      </div>
    </CardHeader>
    <CardBody className="p-6">
      <Typography variant="body1" className="mb-4 text-gray-600">
        {description}
      </Typography>
      {extraInfo && (
        <Typography variant="body2" className="mb-4 text-gray-500">
          {extraInfo}
        </Typography>
      )}
      <Button 
        color="primary" 
        auto 
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-opacity duration-300 mt-4"
        endContent={<ExternalLink size={16} />}
      >
        {actionText}
      </Button>
    </CardBody>
  </Card>
);

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12">
      <Container maxWidth="lg">
        <Typography variant="h3" className="text-4xl font-bold mb-12 text-center text-gray-800 p-6">
          How Can We Help You?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <SupportCard
              icon={MessageSquare}
              title="Live Chat Support"
              description="Get immediate assistance from our support team via live chat."
              actionText="Start Chat"
              action={() => {}}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SupportCard
              icon={Mail}
              title="Email Support"
              description="Send us an email and we'll get back to you as soon as possible."
              actionText="Send Email"
              action={() => {}}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SupportCard
              icon={Phone}
              title="Phone Support"
              description="Call our support team directly for urgent matters."
              extraInfo="+1 (123) 456-7890"
              actionText="Call Now"
              action={() => {}}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SupportCard
              icon={User}
              title="Account Help"
              description="Manage your account settings and profile information."
              actionText="Manage Account"
              action={() => {}}
            />
          </Grid>
        </Grid>
        <Card className="mt-8 bg-white shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center text-white">
              <Image
                src="/global/company_logos/wapp-logo.png"
                alt="WApp Logo"
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <Typography variant="h6" className="font-bold">Contact Us</Typography>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <Typography variant="body1" className="mb-4 text-gray-600">
              For any other inquiries or assistance, please don't hesitate to reach out.
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Email: thenguyenfiner@gmail.com
            </Typography>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default SupportPage;