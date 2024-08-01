import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import TokenSettings from '@/components/models/token-settings';
import { useTokenSettings } from "@/hooks/use-token-settings";

export const TokenSettingsModal = () => {
  const settings = useTokenSettings();
  
  return (
    <Modal 
      isOpen={settings.isOpen} 
      onOpenChange={settings.onClose}
      classNames={{
        wrapper: "z-[99999]",
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent className="w-full min-w-[600px] max-h-[500px] overflow-y-auto">
        {(onClose) => (
          <React.Fragment>
            <ModalHeader className="flex flex-col gap-1">Token Settings</ModalHeader>
            <ModalBody>
              <TokenSettings />
            </ModalBody>
          </React.Fragment>
        )}
      </ModalContent>
    </Modal>
  );
};
