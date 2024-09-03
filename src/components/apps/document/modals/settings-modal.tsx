import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import AppSettings from '@/components/apps/document/app-settings'; 
import { useSettings } from '@/hooks/use-settings';

export const SettingsModal = () => {
  const settings = useSettings();
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="w-full -mt-10 max-w-[1000px] min-h-[500px] max-h-[500px]">
        <AppSettings />
      </DialogContent>
    </Dialog>
  );
};


