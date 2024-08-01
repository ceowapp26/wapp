import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Slider, Spacer } from "@nextui-org/react";
import { motion } from "framer-motion";
import { LocalModelConfigInterface, ModelOption } from '@/types/ai';
import { modelMaxToken, modelOptions } from '@/constants/ai';
import { useStore } from "@/redux/features/apps/document/store";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoaderPinwheel } from 'lucide-react';
import PopupModal from "./popup-modal";

const ConfigMenu = ({
  isOpen,
  onClose,
  onOpenChange,
  config,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  config: LocalModelConfigInterface;
}) => {
  const AIConfig = useStore((state) => state.AIConfig);
  const setAIConfig = useStore((state) => state.setAIConfig);
  const [_maxToken, _setMaxToken] = useState<number>(config.max_tokens);
  const [_model, _setModel] = useState<ModelOption>(config.model);
  const [_temperature, _setTemperature] = useState<number>(config.temperature);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(config.presence_penalty);
  const [_topP, _setTopP] = useState<number>(config.top_p);
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(config.frequency_penalty);
  const { t } = useTranslation('model');

  const handleConfirm = async () => {
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
    onClose();
  };

  return (
    <PopupModal
      title={t('configuration') as string}
      isModalOpen={isOpen}
      setIsModalOpen={onOpenChange}
      handleConfirm={handleConfirm}
      handleClickBackdrop={handleConfirm}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ModelSelector _model={_model} _setModel={_setModel} />
        <Spacer y={1} />
        <MaxTokenSlider _maxToken={_maxToken} _setMaxToken={_setMaxToken} _model={_model} />
        <Spacer y={1} />
        <TemperatureSlider _temperature={_temperature} _setTemperature={_setTemperature} />
        <Spacer y={1} />
        <TopPSlider _topP={_topP} _setTopP={_setTopP} />
        <Spacer y={1} />
        <PresencePenaltySlider _presencePenalty={_presencePenalty} _setPresencePenalty={_setPresencePenalty} />
        <Spacer y={1} />
        <FrequencyPenaltySlider _frequencyPenalty={_frequencyPenalty} _setFrequencyPenalty={_setFrequencyPenalty} />
      </motion.div>
    </PopupModal>
  );
};

export const ModelSelector = ({ _model, _setModel }: { _model: ModelOption; _setModel: React.Dispatch<React.SetStateAction<ModelOption>> }) => {
  const setConfigModel = useStore((state) => state.setConfigModel);
  return (
    <Dropdown
      showArrow
      classNames={{
        wrapper: "p-4 mb-4",
        base: "before:bg-default-200 mb-2",
        content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
      }}
    >
      <DropdownTrigger flat>
        <Button 
          variant="bordered"
          size="large"
          className="p-2 text-white" 
          startContent={<LoaderPinwheel />}
        >
          {_model}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Model selection"
        selectionMode="single"
        selectedKeys={[_model]}
        onSelectionChange={(keys) => {
          const selectedModel = keys.currentKey as ModelOption;
          _setModel(selectedModel);
          setConfigModel(selectedModel);
        }}
      >
        {modelOptions.map((m) => (
          <DropdownItem key={m}>{m}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export const SliderWrapper = ({ label, value, onChange, min, max, step, description }) => {
  const { t } = useTranslation('model');
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {t(label)}
        </h3>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
          {value}
        </span>
      </div>
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="mt-2"
        color="primary"
      />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
        {t(description)}
      </p>
    </div>
  );
};

export const MaxTokenSlider = ({ _maxToken, _setMaxToken, _model }: { _maxToken: number; _setMaxToken: React.Dispatch<React.SetStateAction<number>>; _model: ModelOption }) => (
  <SliderWrapper
    label="token.label"
    value={_maxToken}
    onChange={_setMaxToken}
    min={0}
    max={modelMaxToken[_model]}
    step={1}
    description="token.description"
  />
);

export const TemperatureSlider = ({ _temperature, _setTemperature }: { _temperature: number; _setTemperature: React.Dispatch<React.SetStateAction<number>> }) => (
  <SliderWrapper
    label="temperature.label"
    value={_temperature}
    onChange={_setTemperature}
    min={0}
    max={2}
    step={0.1}
    description="temperature.description"
  />
);

export const TopPSlider = ({ _topP, _setTopP }: { _topP: number; _setTopP: React.Dispatch<React.SetStateAction<number>> }) => (
  <SliderWrapper
    label="topP.label"
    value={_topP}
    onChange={_setTopP}
    min={0}
    max={1}
    step={0.05}
    description="topP.description"
  />
);

export const PresencePenaltySlider = ({ _presencePenalty, _setPresencePenalty }: { _presencePenalty: number; _setPresencePenalty: React.Dispatch<React.SetStateAction<number>> }) => (
  <SliderWrapper
    label="presencePenalty.label"
    value={_presencePenalty}
    onChange={_setPresencePenalty}
    min={-2}
    max={2}
    step={0.1}
    description="presencePenalty.description"
  />
);

export const FrequencyPenaltySlider = ({ _frequencyPenalty, _setFrequencyPenalty }: { _frequencyPenalty: number; _setFrequencyPenalty: React.Dispatch<React.SetStateAction<number>> }) => (
  <SliderWrapper
    label="frequencyPenalty.label"
    value={_frequencyPenalty}
    onChange={_setFrequencyPenalty}
    min={-2}
    max={2}
    step={0.1}
    description="frequencyPenalty.description"
  />
);

export default ConfigMenu;