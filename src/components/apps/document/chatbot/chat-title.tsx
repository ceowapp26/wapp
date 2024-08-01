import React from 'react';
import { useTranslation } from 'react-i18next';
import ConfigMenu from './config-menu';
import { shallow } from 'zustand/shallow';
import { useStore } from '@/redux/features/apps/document/store';
import { api } from "@/convex/_generated/api";
import { useDisclosure } from "@nextui-org/react";
import { Settings, ChevronDown } from 'lucide-react';

const ChatTitle = React.memo(() => {
  const { t } = useTranslation('model');
  const AIConfig = useStore((state) => state.AIConfig);
  const configModel = useStore((state) => state.configModel);
  const configMenuModal = useDisclosure();

  const ConfigItem = ({ label, value }) => (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200">
      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t(label)}</span>
      <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );

  return (
    <div className="w-full">
      <div
        className="flex flex-wrap justify-center items-center gap-3 p-4 mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer"
        onClick={configMenuModal.onOpen}
      >
        <ConfigItem label="model" value={AIConfig[configModel].model} />
        <ConfigItem label="token.label" value={AIConfig[configModel].max_tokens} />
        <ConfigItem label="temperature.label" value={AIConfig[configModel].temperature} />
        <ConfigItem label="topP.label" value={AIConfig[configModel].top_p} />
        <ConfigItem label="presencePenalty.label" value={AIConfig[configModel].presence_penalty} />
        <ConfigItem label="frequencyPenalty.label" value={AIConfig[configModel].frequency_penalty} />
        <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md transition-colors duration-200">
          <Settings size={18} />
          <ChevronDown size={18} className="ml-1" />
        </button>
      </div>
      <ConfigMenu
        onOpenChange={configMenuModal.onOpenChange}
        isOpen={configMenuModal.isOpen}
        onClose={configMenuModal.onClose}
        config={AIConfig[configModel]}
      />
    </div>
  );
});

export default ChatTitle;