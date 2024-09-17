import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Scissors, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WarningModalProps {
  isFunctionCalled: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAutoStrip: () => void;
  onAutoSummarize: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, isFunctionCalled, onClose, onAutoStrip, onAutoSummarize }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="w-full sm:max-w-[425px]">
            <DialogHeader>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              </motion.div>
              <DialogTitle className="text-center text-2xl font-bold">Chat Length Exceeded</DialogTitle>
              <DialogDescription className="text-center">
                Your chat is exceeding the allowed length limit for this session.
              </DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Alert variant="warning" className="my-4">
                <AlertDescription>
                  Consider creating a new chat or choose from the options below to manage your current session.
                </AlertDescription>
              </Alert>
            </motion.div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              {isFunctionCalled && 
                <React.Fragment>
                  <Button variant="secondary" onClick={onAutoStrip} className="w-full sm:w-auto">
                    <Scissors className="w-4 h-4 mr-2" />
                    Auto Strip
                  </Button>
                  <Button variant="default" onClick={onAutoSummarize} className="w-full sm:w-auto">
                    <FileText className="w-4 h-4 mr-2" />
                    Auto Summarize
                  </Button>
                </React.Fragment>
              }
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default WarningModal;