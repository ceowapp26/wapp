import React, { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  id: number;
  name: string;
  href: string;
}

interface NavigationMenuProps {
  activeSection: number;
  handleSectionClick: (sectionId: number) => void;
  isSticky: boolean;
  isVisible: boolean;
}

const NavigationMenu = forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ activeSection, handleSectionClick, isSticky, isVisible }, ref) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const sections: Section[] = [
      { id: 1, name: 'Explore', href: '#explore' },
      { id: 2, name: 'Display', href: '#display' },
      { id: 3, name: 'Prompt', href: '#prompt' },
    ];

    return (
      <AnimatePresence>
        <div className="w-full flex items-center justify-center">
          {isVisible && (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className={`fixed ${isSticky ? 'bottom-8' : 'bottom-4'} transform -translate-x-1/2 z-50 min-w-lg max-w-xl w-full overflow-x-auto px-4 sm:px-0`}
            >
              <nav className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-full shadow-lg">
                <ul className="flex justify-around items-center p-2">
                  {sections.map((section) => (
                    <li key={section.id} className="relative">
                      <a
                        href={section.href}
                        onClick={() => handleSectionClick(section.id)}
                        className={`block px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 ${
                          activeSection === section.id
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {section.name}
                      </a>
                      {activeSection === section.id && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    );
  }
);

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;
