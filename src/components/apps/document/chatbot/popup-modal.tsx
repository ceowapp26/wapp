import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { X } from 'lucide-react';

const PopupModal = ({
  title = 'Information',
  message,
  isModalOpen,
  setIsModalOpen,
  handleConfirm,
  handleClose,
  handleClickBackdrop,
  cancelButton = true,
  children,
}: {
  title?: string;
  message?: string;
  isModalOpen?: boolean;
  setIsModalOpen: () => void;
  handleConfirm?: () => void;
  handleClose?: () => void;
  handleClickBackdrop?: () => void;
  cancelButton?: boolean;
  children?: React.ReactNode;
}) => {
  const { t } = useTranslation();

  const _handleClose = () => {
    handleClose && handleClose();
    setIsModalOpen(false);
  };

  const _handleBackdropClose = () => {
    if (handleClickBackdrop) handleClickBackdrop();
    else _handleClose();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (handleClickBackdrop) handleClickBackdrop();
      else handleClose ? handleClose() : setIsModalOpen(false);
    } else if (event.key === 'Enter') {
      if (handleConfirm) handleConfirm();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleConfirm, handleClose, handleClickBackdrop]);

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={setIsModalOpen}
      aria-labelledby="modal-title"
      backdrop="blur"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
      classNames={{
        wrapper: 'z-[99999]',
        body: 'py-6',
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
        header: 'border-b-[1px] border-[#292f46]',
        footer: 'border-t-[1px] border-[#292f46]',
        closeButton: 'hover:bg-white/5 active:bg-white/10',
      }}
    >
      <ModalContent>
       {(onClose) => (
        <>
          <ModalHeader>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {message && (
                <div className="flex items-start p-4 space-x-3 mb-4 bg-amber-50 border-l-4 border-amber-500 rounded-md shadow-md">
                  <svg className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <p className="text-amber-700 text-base font-medium">{message}</p>
                </div>
              )}
              <div>
                {children}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {cancelButton && (
              <Button
                startContent={<X className="h-6 w-6" />}
                auto
                flat
                color="error"
                onClick={_handleClose}
              >
                {t('cancel')}
              </Button>
            )}
            {handleConfirm && (
              <Button
                auto
                onClick={async () => await handleConfirm()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-150 ease-in-out"
              >
                {t('confirm')}
              </Button>
            )}
          </ModalFooter>
        </>
      )}
      </ModalContent>
      <div
        className="bg-gray-800/90 absolute top-0 left-0 h-full w-full z-[-1]"
        onClick={_handleBackdropClose}
      />
    </Modal>
  );
};

export default PopupModal;
