import React, { useState } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import { useTranslation } from 'react-i18next';
import { Textarea, Button } from '@nextui-org/react';
import PopupModal from './popup-modal';
import {
  FrequencyPenaltySlider,
  MaxTokenSlider,
  ModelSelector,
  PresencePenaltySlider,
  TemperatureSlider,
  TopPSlider,
} from './config-menu';
import { api } from "@/convex/_generated/api";
import { ConfigInterface, ModelOption } from '@/types/ai';
import { modelMaxToken, modelOptions, _defaultAIConfig } from '@/constants/ai';
import { useAction, useMutation, useQuery } from "convex/react";
import { _defaultSystemMessage } from '@/constants/chat';
import { useDisclosure } from "@nextui-org/react";
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatConfigModal = ({
  isOpen,
  onOpenChange,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation('model');
  const AIConfig = useStore((state) => state.AIConfig);
  const configModel = useStore((state) => state.configModel);
  const setAIConfig = useStore((state) => state.setAIConfig);
  const updateModel = useMutation(api.models.updateModel);
  const cloudModels = useQuery(api.models.getAllModels);
  const setDefaultSystemMessage = useStore(
    (state) => state.setDefaultSystemMessage
  );
  const [_systemMessage, _setSystemMessage] = useState<string>(
    useStore.getState().defaultSystemMessage
  );
  const [_model, _setModel] = useState<ModelOption>(AIConfig[configModel].model);
  const [_maxToken, _setMaxToken] = useState<number>(AIConfig[configModel].max_tokens);
  const [_temperature, _setTemperature] = useState<number>(AIConfig[configModel].temperature);
  const [_topP, _setTopP] = useState<number>(AIConfig[configModel].top_p);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(
    AIConfig[configModel].presence_penalty
  );
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(
    AIConfig[configModel].frequency_penalty
  );

  const handleSave = async () => {
    const data = {
      model: _model,
      temperature: _temperature,
      presence_penalty: _presencePenalty,
      top_p: _topP,
      frequency_penalty: _frequencyPenalty,
      max_tokens: _maxToken,
    }
    const updatedConfigs = {
      ...AIConfig,
      [_model]: { ...AIConfig[_model], ...data }
    };
    setAIConfig(updatedConfigs);
    setDefaultSystemMessage(_systemMessage);
    onClose();
  };

  const handleReset = () => {
    _setModel(_defaultAIConfig[configModel].model);
    _setMaxToken(_defaultAIConfig[configModel].max_tokens);
    _setTemperature(_defaultAIConfig[configModel].temperature);
    _setTopP(_defaultAIConfig[configModel].top_p);
    _setPresencePenalty(_defaultAIConfig[configModel].presence_penalty);
    _setFrequencyPenalty(_defaultAIConfig[configModel].frequency_penalty);
    _setSystemMessage(_defaultSystemMessage);
  };

  return (
    <PopupModal
      title={t('defaultChatConfig') as string}
      isModalOpen={isOpen}
      setIsModalOpen={onOpenChange}
      handleConfirm={handleSave}
    >
      <div className='p-6 space-y-4 border-b border-gray-200 dark:border-gray-600 w-[90vw] max-w-full text-sm text-gray-900 dark:text-gray-300'>
        <DefaultSystemChat
          _systemMessage={_systemMessage}
          _setSystemMessage={_setSystemMessage}
        />
        <ModelSelector _model={_model} _setModel={_setModel} />
        <MaxTokenSlider
          _maxToken={_maxToken}
          _setMaxToken={_setMaxToken}
          _model={_model}
        />
        <TemperatureSlider
          _temperature={_temperature}
          _setTemperature={_setTemperature}
        />
        <TopPSlider _topP={_topP} _setTopP={_setTopP} />
        <PresencePenaltySlider
          _presencePenalty={_presencePenalty}
          _setPresencePenalty={_setPresencePenalty}
        />
        <FrequencyPenaltySlider
          _frequencyPenalty={_frequencyPenalty}
          _setFrequencyPenalty={_setFrequencyPenalty}
        />
        <Button
          color="secondary"
          auto
          className='mt-5'
          onClick={handleReset}
        >
          {t('resetToDefault')}
        </Button>
      </div>
    </PopupModal>
  );
};

const DefaultSystemChat = ({
  _systemMessage,
  _setSystemMessage,
}: {
  _systemMessage: string;
  _setSystemMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation('model');

  return (
    <div>
      <Textarea
        label={t('defaultSystemMessage')}
        value={_systemMessage}
        onChange={(e) => _setSystemMessage(e.target.value)}
        minRows={1}
        maxRows={5}
        width="100%"
        className="my-2"
        placeholder={t('enterDefaultSystemMessage')}
      />
    </div>
  );
};

const ChatConfigButton = ({ 
  onCloseModal, 
  onOpen,
}: { 
  onCloseModal: () => void; 
  onOpen: () => void;
}) => {
  const { t } = useTranslation('model');
  const handleClick = () => {
    onCloseModal();
    onOpen();
  }
  return (
    <motion.button
      className="flex items-center px-8 py-4 bg-violet-500 text-white rounded-lg shadow-md hover:bg-violet-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      aria-label={t('defaultChatConfig')}
    >
      <SlidersHorizontal className="w-5 h-5 mr-2" />
      <span className="font-medium">{t('defaultChatConfig')}</span>
    </motion.button>
  
  );
};

export { ChatConfigButton, ChatConfigModal };

