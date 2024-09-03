import React, { useState } from "react";
import { Card, CardBody, Button, Accordion, AccordionItem, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSignInAlt, FaCog, FaRocket, FaEdit, FaImage, FaSlash, FaUsers, FaEnvelope, FaCubes, FaInfoCircle, FaComments, FaRobot, FaBook, FaQuestionCircle } from "react-icons/fa";

const BasicNavigation = () => {
  const [activeSection, setActiveSection] = useState("landing");

  const sections = [
    { key: "landing", title: "Landing Page", icon: <FaSignInAlt /> },
    { key: "home", title: "Home Page", icon: <FaRocket /> },
    { key: "settings", title: "Settings Page", icon: <FaCog /> },
    { key: "app", title: "App Page", icon: <FaCubes /> },
    { key: "doc", title: "W APP-Doc Features", icon: <FaEdit /> },
    { key: "editor", title: "Editor Features", icon: <FaEdit /> },
    { key: "settingsMenu", title: "Settings Menu", icon: <FaCog /> },
    { key: "management", title: "Management", icon: <FaUsers /> },
    { key: "metadata", title: "Document Metadata", icon: <FaInfoCircle /> },
    { key: "accessibility", title: "Document Accessibility", icon: <FaUsers /> },
    { key: "chat", title: "Chat Menu", icon: <FaComments /> },
    { key: "chatbot", title: "Chatbot Features", icon: <FaRobot /> },
    { key: "additional", title: "Additional Settings", icon: <FaCog /> },
    { key: "navigation", title: "Navigation Menu", icon: <FaBook /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-4 overflow-hidden">
        <CardBody>
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">W APP Guide</h1>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {sections.map((section) => (
              <Tooltip key={section.key} content={section.title}>
                <Button
                  auto
                  color={activeSection === section.key ? "primary" : "default"}
                  onClick={() => setActiveSection(section.key)}
                  className="min-w-[40px]"
                >
                  {section.icon}
                </Button>
              </Tooltip>
            ))}
          </div>

          <Accordion>
            {sections.map((section) => (
              <AccordionItem
                key={section.key}
                aria-label={section.title}
                title={
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>
                }
              >
                <ContentSection section={section.key} />
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <p className="mb-4">To learn more about W APP, register today and explore all the powerful features we offer!</p>
            <Link 
              href="mailto:ceowapp@gmail.com" 
              className="text-blue-500 hover:text-blue-700 underline block mb-4"
            >
              Contact us
            </Link>
            <Button color="primary" size="lg" className="font-bold">
              Register Now
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default BasicNavigation;

const ContentSection = ({ section }) => {
  switch (section) {
    case "landing":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">1. Landing Page</h3>
          <ul className="list-disc list-inside">
            <li>Sign In/Sign Up: From the landing page, click on "Sign In." W APP offers various methods for signing in or signing up. Choose the option that best suits your needs.</li>
            <li>Redirect to Home Page: After signing in or signing up, you'll be redirected to your home page.</li>
          </ul>
        </>
      );
    case "home":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">2. Home Page</h3>
          <p>Overview: The home page is your central hub for accessing all features and settings of W APP.</p>
        </>
      );
    case "settings":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">3. Settings Page</h3>
          <ul className="list-disc list-inside">
            <li>Usage Monitoring: On the settings page, you can monitor your usage and track your activity.</li>
            <li>Plan Upgrades: Upgrade your plan or purchase more credits or tokens for AI features.</li>
          </ul>
        </>
      );
    case "app":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">4. App Page</h3>
          <ul className="list-disc list-inside">
            <li>Choosing Apps: Navigate to the app page to select your preferred app. You can scroll through the available options or search for apps by name or category.</li>
            <li>Highlight: We’ll focus on W APP-Doc, an AI-powered document editor with advanced features.</li>
          </ul>
        </>
      );
    case "doc":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">5. W APP-Doc Features</h3>
          <ul className="list-disc list-inside">
            <li>Document Management: In W APP-Doc, create new documents or filter existing ones based on your account type—personal or organization. You can upload files and publish documents for real-time collaboration.</li>
          </ul>
        </>
      );
    case "editor":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">6. Editor Features</h3>
          <ul className="list-disc list-inside">
            <li>Text Options: To use the editor, select the text. From the dropdown popover menu, you can summarize, shorten, fix grammar, or generate charts, dashboards, and tree nodes for better text comprehension.</li>
            <li>Image Management: Insert images from Unsplash, upload from your local computer, or use AI-generated images. To extract text and get a description from an image, select the image and choose the appropriate option from the popover menu.</li>
            <li>Slash Commands: Use slash commands to add tables, audio, embed links, upload files, use a code editor, and more.</li>
          </ul>
        </>
      );
    case "settingsMenu":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">7. Settings Menu</h3>
          <ul className="list-disc list-inside">
            <li>Organization Monitoring: Access various features including viewing organization memberships and creating new organizations.</li>
            <li>Email Features: Choose templates from our library or generate new ones with AI. You can schedule sending times and set recipients.</li>
          </ul>
        </>
      );
    case "management":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">8. Management</h3>
          <ul className="list-disc list-inside">
            <li>Resource Management: Manage your organization setups and resources from the management section.</li>
            <li>Future AI Features: Look out for new AI features currently in development.</li>
          </ul>
        </>
      );
    case "metadata":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">9. Document Metadata</h3>
          <ul className="list-disc list-inside">
            <li>Metadata Options: To manage document metadata such as titles and descriptions generated by AI, select the dot option next to the document item and click "Generate." You can update titles by clicking "Update Title."</li>
          </ul>
        </>
      );
    case "accessibility":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">10. Document Accessibility</h3>
          <ul className="list-disc list-inside">
            <li>Access Control: Manage document accessibility by selecting your organization from the dropdown menu. Control which members and users can access your assets.</li>
            <li>Updates: Update your setup from the display table as needed.</li>
          </ul>
        </>
      );
    case "chat":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">11. Chat Menu</h3>
          <ul className="list-disc list-inside">
            <li>Chat Management: Click "Enter Chat" on the top of the left sidebar to create new chats, folders, and filter existing chats.</li>
            <li>Sidebar Expansion: Expand the sidebar menu for better visibility by dragging it.</li>
          </ul>
        </>
      );
    case "chatbot":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">12. Chatbot Features</h3>
          <ul className="list-disc list-inside">
            <li>Opening Chatbots: Click on a chat item to open the chatbot. Choose your model from the dropdown list and apply context as needed.</li>
            <li>Model Settings: To change model settings, click on the item at the top of the chatbot viewport. You can insert content into the current document and more.</li>
          </ul>
        </>
      );
    case "additional":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">13. Additional Settings</h3>
          <ul className="list-disc list-inside">
            <li>Prompt Library: Set up your prompt library, clear chats, or change default configuration options from the left sidebar.</li>
            <li>Navbar Settings: Change the app theme, language, and AI model settings from the navbar. Refer to the support documents for detailed setup instructions.</li>
            <li>Token Transfer: Transfer tokens between users if needed.</li>
          </ul>
        </>
      );
    case "navigation":
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">14. Navigation Menu</h3>
          <ul className="list-disc list-inside">
            <li>Menu Options: Open the menu to navigate through different options. The app section provides shortcuts to various apps within W APP, and you can select extensions as well.</li>
            <li>Technical Support: For support and an app tour, select "Technical Support."</li>
          </ul>
        </>
      );
    default:
      return <p>Content for {section} goes here.</p>;
  }
};
