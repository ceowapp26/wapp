import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { exportPrompts } from '@/utils/prompt';
import { Button, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Download, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ExportPrompt = () => {
  const { t } = useTranslation();
  const prompts = useDocumentStore.getState().prompts;
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportPrompts(prompts);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardBody className="min-h-[136px] justify-end">
          <motion.h4 
            className="text-md font-bold mb-6 ml-3"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            Export Prompts
          </motion.h4>
          <Button
            auto
            color="primary"
            startContent={<Download size={18} />}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? t('Exporting...') : t('Export Prompts')}
          </Button>
        </CardBody>
      </Card>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{t('Export Successful')}</ModalHeader>
          <ModalBody>
            <div className="flex items-center justify-center flex-col">
              <CheckCircle size={48} className="text-green-500" />
              <p className="mt-4 text-center">
                {t('Your prompts have been successfully exported to a CSV file.')}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setShowSuccessModal(false)}>
              {t('Close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExportPrompt;