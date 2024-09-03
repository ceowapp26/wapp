"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AudioUploadDropzone } from "./audio-upload-dropzone";

interface AudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesProcessed: (files: File[]) => void; 
}

export const AudioUploadModal: React.FC<AudioUploadModalProps> = ({
  isOpen,
  onClose,
  onFilesProcessed,
}) => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInsertFiles = (files) => {
    if (files) {
      onFilesProcessed(files);
      setIsSubmitting(false);
      onClose();
    }
    return;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
         <DialogHeader>
          <DialogTitle>Upload Audios</DialogTitle>
          <DialogDescription>
            Upload one or more audios to include in your message.
          </DialogDescription>
        </DialogHeader>
        <AudioUploadDropzone
          className="w-full outline-none"
          handleInsertFiles={handleInsertFiles}
          disabled={isSubmitting}
          multiple
        />
      </DialogContent>
    </Dialog>
  );
};
