"use client";
import React, { useState, useEffect } from 'react';

const TOSPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.getBoundingClientRect().height;
        if (sectionTop <= window.innerHeight / 2 && sectionTop + sectionHeight > window.innerHeight / 2) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="tos-page bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <div className="flex flex-col md:flex-row">
        <nav className="sidebar bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8 md:mb-0 md:mr-8 md:flex-shrink-0">
          <ul className="space-y-4">
            <li onClick={() => scrollToSection('two')} className={`cursor-pointer ${activeSection === 'two' ? 'font-bold text-blue-500 underline' : 'hover:text-blue-300'}`}>
              <a href="#two">Terms of Service</a>
            </li>
            <li onClick={() => scrollToSection('three')} className={`cursor-pointer ${activeSection === 'three' ? 'font-bold text-blue-500 underline' : 'hover:text-blue-300'}`}>
              <a href="#three">Privacy Policy</a>
            </li>
            <li onClick={() => scrollToSection('four')} className={`cursor-pointer ${activeSection === 'four' ? 'font-bold text-blue-500 underline' : 'hover:text-blue-300'}`}>
              <a href="#four">Intellectual Property</a>
            </li>
            <li onClick={() => scrollToSection('five')} className={`cursor-pointer ${activeSection === 'five' ? 'font-bold text-blue-500 underline' : 'hover:text-blue-300'}`}>
              <a href="#five">Dispute Resolution</a>
            </li>
            <li onClick={() => scrollToSection('six')} className={`cursor-pointer ${activeSection === 'six' ? 'font-bold text-blue-500 underline' : 'hover:text-blue-300'}`}>
              <a href="#six">Acknowledgment and Acceptance</a>
            </li>
          </ul>
        </nav>
        <div className="content flex-1">
         <header className="py-8 px-4 text-center">
           <h1 className="text-3xl font-bold mb-4">Terms of Service and Privacy Policy</h1>
           <p className="text-lg">
             Here, you will find all the essential information regarding your use of our platform and the protection of
             your personal data.
           </p>
         </header>
         <section id="two" className="mb-12">
           <h2 className="text-2xl font-bold text-blue-500 mb-4">Terms of Service</h2>
           <p className="mb-4">
             By accessing and using our platform, you agree to be bound by these Terms of Service. Our Terms of Service
             outline your rights, responsibilities, and the guidelines you must follow when using our services.
           </p>
           <ul className="list-disc pl-6 space-y-2">
             <li>Acceptable Use Policy</li>
             <li>User Accounts and Registration</li>
             <li>User Conduct</li>
             <li>Fees and Payments</li>
             <li>Intellectual Property Rights</li>
             <li>Termination and Suspension</li>
             <li>Limitation of Liability</li>
             <li>Indemnification</li>
             <li>Governing Law and Jurisdiction</li>
           </ul>
         </section>

         <section id="three" className="mb-12">
           <h2 className="text-2xl font-bold text-blue-500 mb-4">Privacy Policy</h2>
           <p className="mb-4">
             We take the privacy of our users very seriously. Our Privacy Policy explains how we collect, use, and
             protect your personal information. It also outlines your rights regarding your data and how you can
             exercise those rights.
           </p>
           <ul className="list-disc pl-6 space-y-2">
             <li>Information We Collect</li>
             <li>How We Use Your Information</li>
             <li>How We Protect Your Information</li>
             <li>Your Privacy Rights</li>
             <li>Data Retention</li>
             <li>Third-Party Websites and Services</li>
             <li>Changes to Our Privacy Policy</li>
             <li>Contact Us</li>
           </ul>
         </section>

         <section id="four" className="mb-12">
           <h2 className="text-2xl font-bold text-blue-500 mb-4">Intellectual Property</h2>
           <p className="mb-4">
             Our platform and all its content are the property of our company. You are granted a limited, non-exclusive
             license to use our services, but you may not reproduce, distribute, or modify our intellectual property
             without our permission.
           </p>
           <ul className="list-disc pl-6 space-y-2">
             <li>Ownership of Content</li>
             <li>Permitted Use</li>
             <li>Prohibited Conduct</li>
             <li>Trademarks and Copyrights</li>
           </ul>
         </section>

         <section id="five" className="mb-12">
           <h2 className="text-2xl font-bold text-blue-500 mb-4">Dispute Resolution</h2>
           <p className="mb-4">
             In the event of any disputes or issues related to our Terms of Service or Privacy Policy, we encourage you
             to contact our support team first. If a resolution cannot be reached, we have established a fair and
             transparent dispute resolution process to address your concerns.
           </p>
           <ul className="list-disc pl-6 space-y-2">
             <li>Informal Resolution</li>
             <li>Mediation</li>
             <li>Arbitration</li>
             <li>Class Action Waiver</li>
           </ul>
         </section>

         <section id="six" className="mb-12">
           <h2 className="text-2xl font-bold text-blue-500 mb-4">Acknowledgment and Acceptance</h2>
           <p>
             By continuing to use our platform, you acknowledge that you have read, understood, and agree to be bound
             by our Terms of Service and Privacy Policy. If you do not agree with any part of these terms, please
             discontinue your use of our services.
           </p>
         </section>
       </div>
     </div>
   </div>
 );
};

TOSPage.displayName = 'TOSPage';
export default TOSPage;