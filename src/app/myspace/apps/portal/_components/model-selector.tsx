import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { useModelStore } from '@/stores/features/models/store';
import { Select } from "@/components/ui/nextui-select";
import { ModelOption } from "@/types/ai";
import { AIModelOptions } from "@/constants/ai";
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';

const ModelSelector = React.memo(() => {
    const { t } = useTranslation();
    const setChatModel = usePortalStore((state) => state.setChatModel);
    const currentChatIndex = usePortalStore((state) => state.currentChatIndex);
    const chatModel = usePortalStore((state) => state.chatModel); // Retrieve the current chat model
    const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

    const handleAsyncConfig = async (selectedModelKey: ModelOption) => {
      if (!selectedModelKey) return;
    };

    return (
      <div ref={dropDownRef}>
        <Select 
          options={AIModelOptions} 
          label="Model"
          defaultOption={chatModel}
          selectedOption={chatModel} 
          setSelectedOption={setChatModel} 
          handleAsyncConfig={handleAsyncConfig} 
        />
      </div>
    );
});

export default ModelSelector;