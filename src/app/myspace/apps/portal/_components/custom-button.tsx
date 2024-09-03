import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { LucideIcon, ChevronLeft, ChevronRight, MessageCircle, FolderOpen } from 'lucide-react';
import { useAppDispatch } from '@/hooks/hooks';
import { setPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import { useMyspaceContext } from '@/context/myspace-context-provider'

interface CustomButtonProps {
  handleClick: () => void;
  icon: LucideIcon;
  text: string;
  tooltipText: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ handleClick, icon: Icon, text, tooltipText }) => {
  return (
    <Tooltip content={tooltipText}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="w-full sm:w-auto flex items-center justify-center gap-x-2 px-3 py-2
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white font-semibold text-sm rounded-full
                     shadow-md hover:shadow-lg transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          onClick={handleClick}
        >
          <Icon className="w-5 h-5" />
          <span className="hidden sm:inline">{text}</span>
        </Button>
      </motion.div>
    </Tooltip>
  );
};

const ButtonWrapper: React.FC<> = () => {
  const dispatch = useAppDispatch();
  const {
    isLeftSidebarOpened,
    setIsLeftSidebarOpened,
  } = useMyspaceContext();

  const handleRedirectBack = () => {
    dispatch(setPortalContext('code-project'));
    if (!isLeftSidebarOpened) setIsLeftSidebarOpened(true);
  };

  const handleEnterChat = () => {
    dispatch(setPortalContext('left-ai'));
    if (!isLeftSidebarOpened) setIsLeftSidebarOpened(true);
  };

  return (
    <div className="flex justify-between items-center w-full px-4">
      <CustomButton 
        handleClick={handleRedirectBack} 
        text="Project" 
        icon={FolderOpen} 
        tooltipText="Go back to project" 
      />
      <CustomButton 
        handleClick={handleEnterChat} 
        text="Chat" 
        icon={MessageCircle} 
        tooltipText="Enter AI chat" 
      />
    </div>
  );
};

export { ButtonWrapper, CustomButton };