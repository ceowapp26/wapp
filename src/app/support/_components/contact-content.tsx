import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="faq-item border-b border-gray-200 dark:border-gray-700"
      initial={false}
      animate={{ backgroundColor: isOpen ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.h3 
        className="flex justify-between items-center text-lg font-medium cursor-pointer p-4 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{question}</span>
        <motion.svg 
          className="w-6 h-6"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </motion.svg>
      </motion.h3>
      <AnimatePresence>
        {isOpen && (
          <motion.p 
            className="p-4 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ContactContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Form submitted!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={`font-sans ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
        {/*<header className="sticky top-0 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div 
              className="text-2xl font-bold text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              WAPP
            </motion.div>
            <motion.button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </motion.button>
          </div>
        </header>*/}

        <main className="container mx-auto px-4 py-12">
          <motion.section 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-50 p-4">How can we help you?</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're here to assist you with any questions or concerns you may have. Feel free to reach out!
            </p>
          </motion.section>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.section 
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-primary">Contact Us</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 transition duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 transition duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 transition duration-300" 
                    rows={4}
                  ></textarea>
                </div>
                <motion.button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-400 hover:text-gray-900 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.section>

            <motion.section 
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-primary">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <FAQItem question="How do I create an account?" answer="To create an account, click on the 'Sign Up' button in the top right corner of our homepage. Follow the prompts to enter your details and set up your account." />
                <FAQItem question="What payment methods do you accept?" answer="We accept all major credit cards, PayPal, and bank transfers. For more information, please visit our Payment Options page." />
                <FAQItem question="How can I reset my password?" answer="To reset your password, go to the login page and click on 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password." />
              </div>
            </motion.section>
          </div>
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-300">&copy; 2024 WAPP. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ContactContent;

